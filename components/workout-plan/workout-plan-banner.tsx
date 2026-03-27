import Image from "next/image";
import { Goal } from "lucide-react";

import { workoutPlanBannerImageUrl } from "@/app/_lib/workout-plan";

type WorkoutPlanBannerProps = {
  workoutPlanName: string;
};

const WorkoutPlanBanner = ({ workoutPlanName }: WorkoutPlanBannerProps) => {
  return (
    <section className="relative flex h-[296px] flex-col justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
      <Image
        alt={`Plano ${workoutPlanName}`}
        className="object-cover"
        fill
        priority
        sizes="100vw"
        src={workoutPlanBannerImageUrl}
      />
      <div className="absolute inset-0 bg-workout-plan-banner-overlay" />

      <span className="relative z-10 text-[22px] font-semibold leading-[1.15] text-primary-foreground uppercase">
        FIT.AI
      </span>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center justify-center gap-1 rounded-full bg-primary px-[10px] py-[5px]">
            <Goal className="size-4 text-primary-foreground" />
            <span className="text-[12px] font-semibold leading-none text-primary-foreground uppercase">
              {workoutPlanName}
            </span>
          </div>

          <h1 className="text-[24px] font-semibold leading-[1.05] text-primary-foreground">
            Plano de Treino
          </h1>
        </div>

        <div className="size-12" />
      </div>
    </section>
  );
};

export default WorkoutPlanBanner;

