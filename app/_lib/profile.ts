import type { AuthSession } from "@/app/_lib/get-server-session";

type ProfileMetrics = {
  age: string;
  bodyFatPercentage: string;
  heightInCentimeters: string;
  weightInKilograms: string;
};

export const getProfileDisplayName = (
  trainUserName: string | null | undefined,
  session: AuthSession,
) => trainUserName ?? session.user.name ?? session.user.email?.split("@")[0] ?? "Aluno";

export const getProfileMetrics = (
  userTrainData:
    | {
        age: number;
        bodyFatPercentage: number;
        heightInCentimeters: number;
        weightInGrams: number;
      }
    | null,
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
    age: String(userTrainData.age),
    bodyFatPercentage: Number.isInteger(userTrainData.bodyFatPercentage)
      ? `${userTrainData.bodyFatPercentage}%`
      : `${userTrainData.bodyFatPercentage.toFixed(1)}%`,
    heightInCentimeters: String(userTrainData.heightInCentimeters),
    weightInKilograms: (userTrainData.weightInGrams / 1000).toFixed(1),
  };
};

export const getUserInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
