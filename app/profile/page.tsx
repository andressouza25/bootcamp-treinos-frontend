import { BicepsFlexed, Ruler, User, WeightTilde } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { getUserTrainData } from "@/app/_lib/api/fetch-generated";
import {
  getProfileDisplayName,
  getProfileMetrics,
  getUserInitials,
} from "@/app/_lib/profile";
import { getServerSession } from "@/app/_lib/get-server-session";
import BottomNavigation from "@/components/home/bottom-navigation";
import ProfileLogoutButton from "@/components/profile/profile-logout-button";
import ProfileStatCard from "@/components/profile/profile-stat-card";
import ProfileUserSummary from "@/components/profile/profile-user-summary";
import StatsHeader from "@/components/stats/stats-header";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.session.userId) {
    redirect("/auth");
  }

  const userTrainDataResponse = await getUserTrainData({
    cache: "no-store",
  });

  if (userTrainDataResponse.status === 401) {
    redirect("/auth");
  }

  if (userTrainDataResponse.status !== 200) {
    notFound();
  }

  const userName = getProfileDisplayName(userTrainDataResponse.data?.userName, session);
  const userMetrics = getProfileMetrics(userTrainDataResponse.data);

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-background pb-[120px]">
        <StatsHeader />

        <div className="flex flex-col gap-5 px-5 py-5">
          <ProfileUserSummary
            imageUrl={session.user.image}
            initials={getUserInitials(userName)}
            planLabel="Plano Basico"
            userName={userName}
          />

          <section className="grid grid-cols-2 gap-3">
            <ProfileStatCard
              icon={WeightTilde}
              label="KG"
              value={userMetrics.weightInKilograms}
            />
            <ProfileStatCard
              icon={Ruler}
              label="CM"
              value={userMetrics.heightInCentimeters}
            />
            <ProfileStatCard
              icon={BicepsFlexed}
              label="GC"
              value={userMetrics.bodyFatPercentage}
            />
            <ProfileStatCard icon={User} label="ANOS" value={userMetrics.age} />
          </section>

          <ProfileLogoutButton />
        </div>
      </main>

      <BottomNavigation activeItem="profile" />
    </>
  );
}
