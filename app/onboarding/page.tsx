import { getOnboardingPageContext } from "@/app/_lib/onboarding";
import OnboardingChat from "@/components/chat/onboarding-chat";

export default async function OnboardingPage() {
  await getOnboardingPageContext();

  return (
    <main className="mx-auto flex h-dvh w-full max-w-[393px] flex-col overflow-hidden bg-background">
      <OnboardingChat />
    </main>
  );
}
