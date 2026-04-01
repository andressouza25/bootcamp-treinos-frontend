import type { AuthSession } from "@/app/_lib/get-server-session";
import type { ProfileFromChatData } from "@/app/_lib/profile-from-chat";

type ProfileMetrics = {
  age: string;
  bodyFatPercentage: string;
  heightInCentimeters: string;
  weightInKilograms: string;
};

type ResolvedProfileData = {
  age?: number;
  bodyFatPercentage?: number;
  heightInCentimeters?: number;
  userName?: string;
  weightInGrams?: number;
};

export const getProfileDisplayName = (
  trainUserName: string | null | undefined,
  session: AuthSession,
) =>
  trainUserName?.trim() ||
  session.user.name ||
  session.user.email?.split("@")[0] ||
  "Aluno";

export const getProfileMetrics = (
  userTrainData: ResolvedProfileData | null,
): ProfileMetrics => {
  if (!userTrainData) {
    return {
      age: "--",
      bodyFatPercentage: "--",
      heightInCentimeters: "--",
      weightInKilograms: "--",
    };
  }

  return {
    age: userTrainData.age && userTrainData.age > 0 ? String(userTrainData.age) : "--",
    bodyFatPercentage:
      userTrainData.bodyFatPercentage !== undefined &&
      userTrainData.bodyFatPercentage > 0
        ? Number.isInteger(userTrainData.bodyFatPercentage)
          ? `${userTrainData.bodyFatPercentage}%`
          : `${userTrainData.bodyFatPercentage.toFixed(1)}%`
        : "--",
    heightInCentimeters:
      userTrainData.heightInCentimeters && userTrainData.heightInCentimeters > 0
        ? String(userTrainData.heightInCentimeters)
        : "--",
    weightInKilograms:
      userTrainData.weightInGrams && userTrainData.weightInGrams > 0
        ? (userTrainData.weightInGrams / 1000).toFixed(1)
        : "--",
  };
};

export const mergeProfileData = (
  userTrainData:
    | {
        age: number;
        bodyFatPercentage: number;
        heightInCentimeters: number;
        userName: string;
        weightInGrams: number;
      }
    | null,
  profileFromChat: ProfileFromChatData | null,
): ResolvedProfileData | null => {
  if (!userTrainData && !profileFromChat) {
    return null;
  }

  return {
    age: profileFromChat?.age ?? userTrainData?.age,
    bodyFatPercentage:
      profileFromChat?.bodyFatPercentage ?? userTrainData?.bodyFatPercentage,
    heightInCentimeters:
      profileFromChat?.heightInCentimeters ?? userTrainData?.heightInCentimeters,
    userName: profileFromChat?.userName ?? userTrainData?.userName,
    weightInGrams:
      profileFromChat?.weightInGrams ?? userTrainData?.weightInGrams,
  };
};

export const getUserInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
