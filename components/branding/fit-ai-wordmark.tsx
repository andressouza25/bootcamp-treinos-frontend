import { cn } from "@/lib/utils";

type FitAiWordmarkProps = {
  className?: string;
  tone?: "default" | "inverse";
};

const toneClassNameByVariant = {
  default: "text-foreground",
  inverse: "text-primary-foreground",
} satisfies Record<NonNullable<FitAiWordmarkProps["tone"]>, string>;

const FitAiWordmark = ({
  className,
  tone = "default",
}: FitAiWordmarkProps) => {
  return (
    <span
      className={cn(
        "text-[22px] font-semibold leading-[1.15] uppercase",
        toneClassNameByVariant[tone],
        className,
      )}
    >
      FIT.AI
    </span>
  );
};

export default FitAiWordmark;
