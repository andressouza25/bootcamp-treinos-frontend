import Image from "next/image";
import { redirect } from "next/navigation";

import { getServerSession } from "@/app/_lib/get-server-session";
import GoogleSignInButton from "@/app/auth/_components/google-sign-in-button";
import FitAiWordmark from "@/components/branding/fit-ai-wordmark";

const heroImageUrl = "/auth/login-hero.png";

const AuthPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[402px] bg-auth-page-background">
        <div className="relative min-h-screen w-full overflow-hidden bg-auth-page-background">
          <div className="absolute inset-0">
            <Image
              alt="Atleta em posicao de flexao"
              className="object-cover object-[46%_center]"
              fill
              priority
              sizes="100vw"
              src={heroImageUrl}
            />
            <div className="absolute inset-0 bg-auth-image-overlay" />
          </div>

          <div className="absolute inset-x-0 top-12 z-10 flex justify-center">
            <FitAiWordmark tone="inverse" />
          </div>

          <section className="absolute inset-x-0 bottom-0 z-10 rounded-t-[20px] bg-auth-panel px-5 pb-10 pt-12 text-auth-panel-foreground">
            <div className="flex min-h-[288px] flex-col justify-between">
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-center text-[32px] font-semibold leading-[1.05] tracking-[-0.03em]">
                  O app que vai transformar a forma como voce treina.
                </h1>
                <GoogleSignInButton />
              </div>

              <p className="text-center text-xs leading-[1.4] text-auth-panel-muted-foreground">
                (c)2026 Copyright FIT.AI. Todos os direitos reservados
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
