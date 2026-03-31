import { notFound, redirect } from "next/navigation";

import type {
  GetHomeData200,
  GetUserTrainData200,
} from "@/app/_lib/api/fetch-generated";
import {
  getHomeData,
  getUserTrainData,
} from "@/app/_lib/api/fetch-generated";
import {
  getServerSession,
  type AuthSession,
} from "@/app/_lib/get-server-session";
import { getTodayDate } from "@/app/_lib/home";

type ProtectedPageContext = {
  homeData: GetHomeData200 | null;
  requiresOnboarding: boolean;
  session: AuthSession;
  userTrainData: GetUserTrainData200;
};

type AppPageContext = {
  homeData: GetHomeData200;
  session: AuthSession;
  userTrainData: GetUserTrainData200;
};

async function getProtectedPageContext(): Promise<ProtectedPageContext> {
  const session = await getServerSession();

  if (!session?.session.userId) {
    redirect("/auth");
  }

  const [homeDataResponse, userTrainDataResponse] = await Promise.all([
    getHomeData(getTodayDate(), {
      cache: "no-store",
    }),
    getUserTrainData({
      cache: "no-store",
    }),
  ]);

  if (homeDataResponse.status === 401 || userTrainDataResponse.status === 401) {
    redirect("/auth");
  }

  if (homeDataResponse.status !== 200 && homeDataResponse.status !== 404) {
    notFound();
  }

  if (
    userTrainDataResponse.status !== 200 &&
    userTrainDataResponse.status !== 500
  ) {
    notFound();
  }

  const homeData = homeDataResponse.status === 200 ? homeDataResponse.data : null;
  const userTrainData =
    userTrainDataResponse.status === 200 ? userTrainDataResponse.data : null;
  const requiresOnboarding = homeData === null;

  return {
    homeData,
    requiresOnboarding,
    session,
    userTrainData,
  };
}

export async function getAppPageContext(): Promise<AppPageContext> {
  const context = await getProtectedPageContext();

  if (context.requiresOnboarding || context.homeData === null) {
    redirect("/onboarding");
  }

  return {
    homeData: context.homeData,
    session: context.session,
    userTrainData: context.userTrainData,
  };
}

export async function getOnboardingPageContext(): Promise<ProtectedPageContext> {
  const context = await getProtectedPageContext();

  if (!context.requiresOnboarding) {
    redirect("/");
  }

  return context;
}
