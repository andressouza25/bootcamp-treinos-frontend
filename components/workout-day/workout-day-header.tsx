import WorkoutDayBackButton from "@/components/workout-day/workout-day-back-button";

type WorkoutDayHeaderProps = {
  title: string;
};

const WorkoutDayHeader = ({ title }: WorkoutDayHeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <WorkoutDayBackButton />
      <h1 className="text-[18px] font-semibold leading-[1.4] text-foreground">
        {title}
      </h1>
      <div className="size-6" />
    </header>
  );
};

export default WorkoutDayHeader;

