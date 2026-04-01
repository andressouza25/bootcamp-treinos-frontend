"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { authClient } from "@/app/_lib/auth-client";
import GoogleIcon from "@/app/auth/_components/google-icon";
import { Button } from "@/components/ui/button";

const GoogleSignInButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSignIn = async () => {
    setIsPending(true);
    setHasError(false);

    const { error } = await authClient.signIn.social({
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      provider: "google",
    });

    if (error) {
      setHasError(true);
      setIsPending(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Button
        className="h-[38px] rounded-full bg-primary-foreground px-6 text-sm font-semibold text-foreground shadow-none hover:bg-primary-foreground/90"
        disabled={isPending}
        onClick={handleSignIn}
        type="button"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Fazer login com Google
      </Button>
      {hasError ? (
        <p className="text-center text-sm text-primary-foreground/80">
          Nao foi possivel iniciar o login com Google.
        </p>
      ) : null}
    </div>
  );
};

export default GoogleSignInButton;
