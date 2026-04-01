type WorkoutDayExerciseChipProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const WorkoutDayExerciseChip = ({
  children,
  icon,
}: WorkoutDayExerciseChipProps) => {
  return (
    <div className="inline-flex items-center justify-center gap-1 rounded-full bg-home-surface-border px-[10px] py-[5px]">
      {icon}
      <span className="text-[12px] font-semibold leading-none text-home-week-label">
        {children}
      </span>
    </div>
  );
};

export default WorkoutDayExerciseChip;

