import { NextResponse } from "next/server";

const profileCookieName = "fitai-profile-from-chat";

type ProfileFromChat = {
  age?: number;
  bodyFatPercentage?: number;
  heightInCentimeters?: number;
  userName?: string;
  weightInGrams?: number;
};

type ChatProfileRequestBody = {
  message?: string;
  messages?: Array<{
    parts?: Array<{
      text?: string;
      type?: string;
    }>;
    role?: string;
  }>;
};

const getLastMatch = (input: string, expression: RegExp) => {
  const matches = [...input.matchAll(expression)];

  if (matches.length === 0) {
    return null;
  }

  return matches.at(-1) ?? null;
};

const normalizeDecimal = (value: string) => Number(value.replace(",", "."));

const getWeightInGrams = (content: string) => {
  const contextualMatch = getLastMatch(
    content,
    /(?:peso|meu peso(?: atual)?|peso atual|estou pesando|tenho|voce tem)\D{0,30}(\d{2,3}(?:[.,]\d{1,2})?)\s*(?:kg|kgs?|quilo(?:s)?)(?=$|[\s,.;])/gi,
  );

  if (contextualMatch) {
    return Math.round(normalizeDecimal(contextualMatch[1]) * 1000);
  }

  const genericMatch = getLastMatch(
    content,
    /(?:^|[\s,(])(\d{2,3}(?:[.,]\d{1,2})?)\s*(?:kg|kgs?|quilo(?:s)?)(?=$|[\s),.;])/gi,
  );

  if (!genericMatch) {
    const contextualQuestionMatch = getLastMatch(
      content,
      /quanto voc(?:e|ê) pesa(?:\s*\(em kg\))?\??\s*(\d{2,3}(?:[.,]\d{1,2})?)(?=$|[\s,.;])/gi,
    );

    if (!contextualQuestionMatch) {
      return undefined;
    }

    return Math.round(normalizeDecimal(contextualQuestionMatch[1]) * 1000);
  }

  return Math.round(normalizeDecimal(genericMatch[1]) * 1000);
};

const getHeightInCentimeters = (content: string) => {
  const contextualMeterMatch = getLastMatch(
    content,
    /(?:altura|minha altura|meco|meco cerca de|tenho)\D{0,20}(\d(?:[.,]\d{1,2}))\s*m\b/gi,
  );

  if (contextualMeterMatch) {
    return Math.round(normalizeDecimal(contextualMeterMatch[1]) * 100);
  }

  const genericMeterMatch = getLastMatch(content, /\b(\d(?:[.,]\d{1,2}))\s*m\b/gi);

  if (genericMeterMatch) {
    return Math.round(normalizeDecimal(genericMeterMatch[1]) * 100);
  }

  const contextualCentimeterMatch = getLastMatch(
    content,
    /(?:altura|minha altura|meco|tenho)\D{0,20}(\d{3})\s*cm\b/gi,
  );

  if (contextualCentimeterMatch) {
    return Number(contextualCentimeterMatch[1]);
  }

  const genericCentimeterMatch = getLastMatch(content, /\b(\d{3})\s*cm\b/gi);

  if (!genericCentimeterMatch) {
    return undefined;
  }

  return Number(genericCentimeterMatch[1]);
};

const getBodyFatPercentage = (content: string) => {
  const contextualMatch = getLastMatch(
    content,
    /(?:gordura corporal|percentual de gordura|body fat|bf)\D{0,20}(\d{1,2}(?:[.,]\d{1,2})?)\s*%/gi,
  );

  if (contextualMatch) {
    return normalizeDecimal(contextualMatch[1]);
  }

  const genericMatch = getLastMatch(
    content,
    /\b(\d{1,2}(?:[.,]\d{1,2})?)\s*%\s*(?:de\s+gordura|gordura corporal)?/gi,
  );

  if (!genericMatch) {
    return undefined;
  }

  return normalizeDecimal(genericMatch[1]);
};

const getAge = (content: string) => {
  const contextualMatch = getLastMatch(
    content,
    /(?:idade|minha idade|tenho|estou com)\D{0,20}(\d{1,3})\s*anos/gi,
  );

  if (contextualMatch) {
    return Number(contextualMatch[1]);
  }

  const genericMatch = getLastMatch(content, /\b(\d{1,3})\s*anos\b/gi);

  if (!genericMatch) {
    return undefined;
  }

  return Number(genericMatch[1]);
};

const toTitleCase = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getUserName = (content: string) => {
  const explicitMatch = getLastMatch(
    content,
    /(?:meu nome e|meu nome eh|eu me chamo|pode me chamar de|sou o|sou a)\s+([a-z ]{2,40})/gi,
  );

  if (explicitMatch) {
    return toTitleCase(explicitMatch[1]);
  }

  const leadingNameMatch = content.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?=,)/);

  if (!leadingNameMatch) {
    return undefined;
  }

  return leadingNameMatch[1];
};

const extractProfileFromText = (message: string): ProfileFromChat => {
  const content = message.trim();

  if (!content) {
    return {};
  }

  return {
    age: getAge(content),
    bodyFatPercentage: getBodyFatPercentage(content),
    heightInCentimeters: getHeightInCentimeters(content),
    userName: getUserName(content),
    weightInGrams: getWeightInGrams(content),
  };
};

const extractProfileFromMessages = (
  messages: ChatProfileRequestBody["messages"],
): ProfileFromChat => {
  const content = (messages ?? [])
    .flatMap((message) => message.parts ?? [])
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text?.trim() ?? "")
    .join("\n");

  return extractProfileFromText(content);
};

const mergeProfile = (
  currentProfile: ProfileFromChat,
  extractedProfile: ProfileFromChat,
): ProfileFromChat => ({
  age: extractedProfile.age ?? currentProfile.age,
  bodyFatPercentage:
    extractedProfile.bodyFatPercentage ?? currentProfile.bodyFatPercentage,
  heightInCentimeters:
    extractedProfile.heightInCentimeters ?? currentProfile.heightInCentimeters,
  userName: extractedProfile.userName ?? currentProfile.userName,
  weightInGrams: extractedProfile.weightInGrams ?? currentProfile.weightInGrams,
});

export async function POST(request: Request) {
  const body = (await request.json()) as ChatProfileRequestBody;
  const extractedProfile = body.message
    ? extractProfileFromText(body.message)
    : extractProfileFromMessages(body.messages);
  const existingCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${profileCookieName}=`))
    ?.slice(profileCookieName.length + 1);
  const currentProfile = existingCookie
    ? (JSON.parse(decodeURIComponent(existingCookie)) as ProfileFromChat)
    : {};
  const mergedProfile = mergeProfile(currentProfile, extractedProfile);
  const response = NextResponse.json({ data: mergedProfile });

  response.cookies.set(profileCookieName, JSON.stringify(mergedProfile), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
