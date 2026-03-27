"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export default function ProfileLogoutButton() {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setHasError(false);
    setIsPending(true);

    const { error } = await authClient.signOut();

    if (error) {
      setHasError(true);
      setIsPending(false);
      return;
    }

    router.replace("/auth");
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        className="h-auto gap-2 rounded-full px-4 py-2 text-[16px] font-semibold leading-none text-profile-logout hover:bg-transparent hover:text-profile-logout"
        disabled={isPending}
        onClick={handleLogout}
        type="button"
        variant="ghost"
      >
        <span>Sair da conta</span>
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      </Button>

      {hasError ? (
        <p className="text-center text-sm text-profile-logout">
          Nao foi possivel sair da conta.
        </p>
      ) : null}
    </div>
  );
}
