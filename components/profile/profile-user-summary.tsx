import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileUserSummaryProps = {
  imageUrl?: string | null;
  initials: string;
  planLabel: string;
  userName: string;
};

export default function ProfileUserSummary({
  imageUrl,
  initials,
  planLabel,
  userName,
}: ProfileUserSummaryProps) {
  return (
    <section className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="size-[52px]">
          {imageUrl ? <AvatarImage alt={userName} src={imageUrl} /> : null}
          <AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-[18px] font-semibold leading-[1.05] text-foreground">
            {userName}
          </h1>
          <p className="text-[14px] leading-[1.15] text-foreground/70">{planLabel}</p>
        </div>
      </div>

      <div className="size-11" />
    </section>
  );
}
