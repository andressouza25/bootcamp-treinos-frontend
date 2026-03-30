import { cookies } from "next/headers";

const profileCookieName = "fitai-profile-from-chat";

export type ProfileFromChatData = {
  age?: number;
  bodyFatPercentage?: number;
  heightInCentimeters?: number;
  userName?: string;
  weightInGrams?: number;
};

export const getProfileFromChat = async (): Promise<ProfileFromChatData | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(profileCookieName)?.value;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as ProfileFromChatData;
  } catch {
    return null;
  }
};
