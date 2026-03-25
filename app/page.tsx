import { redirect } from "next/navigation";

import { getServerSession } from "@/app/_lib/get-server-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle>FIT.AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Voce entrou com sucesso.</p>
          <p className="text-base font-medium text-foreground">
            {session.user.name ?? session.user.email}
          </p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </CardContent>
      </Card>
    </main>
  );
}
