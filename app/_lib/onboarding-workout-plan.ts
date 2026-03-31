import { z } from "zod";

import type {
  CreateWorkoutPlanBody,
  CreateWorkoutPlanBodyWorkoutDaysItemExercisesItem,
  CreateWorkoutPlanBodyWorkoutDaysItemWeekDay,
} from "@/app/_lib/api/fetch-generated";

const weekDayMap = {
  domingo: "SUNDAY",
  friday: "FRIDAY",
  monday: "MONDAY",
  quarta: "WEDNESDAY",
  "quarta-feira": "WEDNESDAY",
  quinta: "THURSDAY",
  "quinta-feira": "THURSDAY",
  sabado: "SATURDAY",
  saturday: "SATURDAY",
  segunda: "MONDAY",
  "segunda-feira": "MONDAY",
  sexta: "FRIDAY",
  "sexta-feira": "FRIDAY",
  sunday: "SUNDAY",
  terca: "TUESDAY",
  "terca-feira": "TUESDAY",
  thursday: "THURSDAY",
  tuesday: "TUESDAY",
  wednesday: "WEDNESDAY",
} as const satisfies Record<string, CreateWorkoutPlanBodyWorkoutDaysItemWeekDay>;

const weekDayLabels: Record<CreateWorkoutPlanBodyWorkoutDaysItemWeekDay, string> = {
  FRIDAY: "Sexta-feira",
  MONDAY: "Segunda-feira",
  SATURDAY: "Sabado",
  SUNDAY: "Domingo",
  THURSDAY: "Quinta-feira",
  TUESDAY: "Terca-feira",
  WEDNESDAY: "Quarta-feira",
};

const orderedWeekDays: CreateWorkoutPlanBodyWorkoutDaysItemWeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const workoutExerciseSchema = z.object({
  name: z.string().trim().min(1),
  order: z.number().int().min(0),
  reps: z.number().int().min(1),
  restTimeInSeconds: z.number().int().min(1),
  sets: z.number().int().min(1),
});

const workoutDaySchema = z.object({
  coverImageUrl: z.string().trim().min(1).optional(),
  estimatedDurationInSeconds: z.number().int().min(1),
  exercises: z.array(workoutExerciseSchema),
  isRest: z.boolean().optional(),
  name: z.string().trim().min(1),
  weekDay: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
});

const workoutPlanSchema = z.object({
  name: z.string().trim().min(1),
  workoutDays: z.array(workoutDaySchema).min(1),
});

type ChatMessage = {
  parts?: Array<{
    text?: string;
    type?: string;
  }>;
  role?: string;
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const getPlanName = (content: string) => {
  const match = content.match(
    /(?:plano(?: de treino)?|treino)\s*[:\-]\s*([^\n]+)/i,
  );

  return match?.[1]?.trim() || "Plano FIT.AI";
};

const getDurationInSeconds = (content: string, isRest: boolean) => {
  const minutesMatch = content.match(
    /(\d{1,3})\s*(?:min|mins|minuto|minutos)\b/i,
  );

  if (minutesMatch) {
    return Math.max(60, Number(minutesMatch[1]) * 60);
  }

  return isRest ? 60 : 1800;
};

const getRestTimeInSeconds = (content: string) => {
  const minutesMatch = content.match(
    /descans(?:o|ar)[^0-9]{0,20}(\d{1,2})\s*(?:min|minutos)\b/i,
  );

  if (minutesMatch) {
    return Math.max(60, Number(minutesMatch[1]) * 60);
  }

  const secondsMatch = content.match(
    /descans(?:o|ar)[^0-9]{0,20}(\d{1,3})\s*(?:s|seg|segundo|segundos)\b/i,
  );

  if (secondsMatch) {
    return Math.max(1, Number(secondsMatch[1]));
  }

  return 60;
};

const getSetsAndReps = (content: string) => {
  const byMultiplierMatch = content.match(/(\d{1,2})\s*x\s*(\d{1,3})/i);

  if (byMultiplierMatch) {
    return {
      reps: Number(byMultiplierMatch[2]),
      sets: Number(byMultiplierMatch[1]),
    };
  }

  const bySeriesMatch = content.match(
    /(\d{1,2})\s*series?(?:\s*de)?\s*(\d{1,3})/i,
  );

  if (bySeriesMatch) {
    return {
      reps: Number(bySeriesMatch[2]),
      sets: Number(bySeriesMatch[1]),
    };
  }

  return {
    reps: 12,
    sets: 3,
  };
};

const getExerciseName = (line: string) =>
  line
    .replace(/^[-*\u2022\d.)\s]+/, "")
    .replace(/\s+[\u2013\u2014-]\s+.*$/, "")
    .replace(/\s*[:(].*$/, "")
    .trim();

const extractExercises = (
  content: string,
): CreateWorkoutPlanBodyWorkoutDaysItemExercisesItem[] => {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .filter((line) =>
      /^[-*\u2022]/.test(line) ||
      /^\d+[.)]/.test(line) ||
      /(?:\d{1,2}\s*x\s*\d{1,3}|\d{1,2}\s*series?)/i.test(line),
    )
    .map((line, index) => {
      const { reps, sets } = getSetsAndReps(line);

      return {
        name: getExerciseName(line),
        order: index,
        reps,
        restTimeInSeconds: getRestTimeInSeconds(line),
        sets,
      };
    })
    .filter((exercise) => exercise.name.length > 0);
};

const parseWeekDay = (line: string) => {
  const normalizedLine = normalizeText(line);
  const entry = Object.entries(weekDayMap).find(([weekDayLabel]) =>
    normalizedLine.includes(weekDayLabel),
  );

  return entry?.[1];
};

const hasWorkoutSectionMarker = (line: string) => {
  const normalizedLine = normalizeText(line);

  return (
    /^#{1,6}\s+/.test(line) ||
    /^treino\s+[a-z0-9]/i.test(line) ||
    /^dia\s+\d+/i.test(line) ||
    /^day\s+\d+/i.test(line) ||
    /^(upper|lower|push|pull|legs|full\s*body|fullbody)\b/i.test(normalizedLine)
  );
};

const getSequentialWeekDay = (index: number) =>
  orderedWeekDays[index % orderedWeekDays.length];

const buildWorkoutDayName = (
  header: string,
  weekDay: CreateWorkoutPlanBodyWorkoutDaysItemWeekDay,
  isRest: boolean,
) => {
  const normalizedHeader = header
    .replace(/^#+\s*/, "")
    .replace(/^[-*\u2022\d.)\s]+/, "")
    .trim();
  const splitHeader = normalizedHeader
    .split(/[:\-\u2013\u2014|]/)
    .map((value) => value.trim());
  const descriptiveName = splitHeader.find(
    (value) => value.length > 0 && parseWeekDay(value) === undefined,
  );

  if (descriptiveName) {
    return descriptiveName;
  }

  if (isRest) {
    return `Descanso ${weekDayLabels[weekDay]}`;
  }

  return `Treino ${weekDayLabels[weekDay]}`;
};

const extractWorkoutDaysFromSections = (content: string) => {
  const lines = content.split("\n");
  const sections: Array<{
    content: string;
    header: string;
    weekDay: CreateWorkoutPlanBodyWorkoutDaysItemWeekDay;
  }> = [];
  let currentSection:
    | {
        content: string[];
        header: string;
        weekDay: CreateWorkoutPlanBodyWorkoutDaysItemWeekDay;
      }
    | null = null;

  for (const line of lines) {
    const weekDay = parseWeekDay(line);

    if (weekDay) {
      if (currentSection) {
        sections.push({
          content: currentSection.content.join("\n"),
          header: currentSection.header,
          weekDay: currentSection.weekDay,
        });
      }

      currentSection = {
        content: [],
        header: line.trim(),
        weekDay,
      };

      continue;
    }

    if (currentSection) {
      currentSection.content.push(line);
    }
  }

  if (currentSection) {
    sections.push({
      content: currentSection.content.join("\n"),
      header: currentSection.header,
      weekDay: currentSection.weekDay,
    });
  }

  return sections.map(({ content: sectionContent, header, weekDay }) => {
    const isRest = /descanso|recuperacao|folga/i.test(
      normalizeText(sectionContent),
    );
    const exercises = isRest ? [] : extractExercises(sectionContent);
    const resolvedIsRest = isRest || exercises.length === 0;

    return {
      estimatedDurationInSeconds: getDurationInSeconds(
        sectionContent,
        resolvedIsRest,
      ),
      exercises,
      isRest: resolvedIsRest,
      name: buildWorkoutDayName(header, weekDay, resolvedIsRest),
      weekDay,
    };
  });
};

const extractSequentialWorkoutDaysFromSections = (content: string) => {
  const lines = content.split("\n");
  const sections: Array<{
    content: string;
    header: string;
    weekDay: CreateWorkoutPlanBodyWorkoutDaysItemWeekDay;
  }> = [];
  let currentSection:
    | {
        content: string[];
        header: string;
        weekDay: CreateWorkoutPlanBodyWorkoutDaysItemWeekDay;
      }
    | null = null;

  for (const line of lines) {
    if (hasWorkoutSectionMarker(line)) {
      if (currentSection) {
        sections.push({
          content: currentSection.content.join("\n"),
          header: currentSection.header,
          weekDay: currentSection.weekDay,
        });
      }

      currentSection = {
        content: [],
        header: line.trim(),
        weekDay: parseWeekDay(line) ?? getSequentialWeekDay(sections.length),
      };

      continue;
    }

    if (currentSection) {
      currentSection.content.push(line);
    }
  }

  if (currentSection) {
    sections.push({
      content: currentSection.content.join("\n"),
      header: currentSection.header,
      weekDay: currentSection.weekDay,
    });
  }

  return sections
    .map(({ content: sectionContent, header, weekDay }) => {
      const isRest = /descanso|recuperacao|folga|rest/i.test(
        normalizeText(sectionContent),
      );
      const exercises = isRest ? [] : extractExercises(sectionContent);
      const resolvedIsRest = isRest || exercises.length === 0;

      return {
        estimatedDurationInSeconds: getDurationInSeconds(
          sectionContent,
          resolvedIsRest,
        ),
        exercises,
        isRest: resolvedIsRest,
        name: buildWorkoutDayName(header, weekDay, resolvedIsRest),
        weekDay,
      };
    })
    .filter((workoutDay) => workoutDay.isRest || workoutDay.exercises.length > 0);
};

const normalizeWorkoutDay = (
  workoutDay: CreateWorkoutPlanBody["workoutDays"][number],
) => {
  const normalizedExercises = (workoutDay.exercises ?? []).map(
    (exercise, index) => ({
      name: exercise.name.trim(),
      order: index,
      reps: Math.max(1, Math.round(exercise.reps)),
      restTimeInSeconds: Math.max(1, Math.round(exercise.restTimeInSeconds)),
      sets: Math.max(1, Math.round(exercise.sets)),
    }),
  );
  const isRest = workoutDay.isRest ?? normalizedExercises.length === 0;

  return {
    coverImageUrl: workoutDay.coverImageUrl?.trim() || undefined,
    estimatedDurationInSeconds: Math.max(
      1,
      Math.round(workoutDay.estimatedDurationInSeconds),
    ),
    exercises: isRest ? [] : normalizedExercises,
    isRest,
    name: workoutDay.name.trim(),
    weekDay: workoutDay.weekDay,
  };
};

const extractJsonCandidates = (content: string) => {
  const codeBlockMatches = [
    ...content.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi),
  ].map((match) => match[1]?.trim());
  const objectMatches = [...content.matchAll(/\{[\s\S]*\}/g)].map((match) =>
    match[0]?.trim(),
  );

  return [...codeBlockMatches, ...objectMatches].filter(
    (candidate): candidate is string => Boolean(candidate),
  );
};

const tryParseStructuredWorkoutPlan = (content: string) => {
  for (const candidate of extractJsonCandidates(content)) {
    try {
      const parsedCandidate = JSON.parse(candidate) as unknown;
      const parsedWorkoutPlan = workoutPlanSchema.safeParse(parsedCandidate);

      if (parsedWorkoutPlan.success) {
        return {
          name: parsedWorkoutPlan.data.name.trim(),
          workoutDays: parsedWorkoutPlan.data.workoutDays.map(normalizeWorkoutDay),
        } satisfies CreateWorkoutPlanBody;
      }
    } catch {}
  }

  return null;
};

const buildWorkoutPlanFromText = (content: string) => {
  const workoutDays =
    extractWorkoutDaysFromSections(content).length > 0
      ? extractWorkoutDaysFromSections(content)
      : extractSequentialWorkoutDaysFromSections(content);

  if (workoutDays.length === 0) {
    return null;
  }

  return {
    name: getPlanName(content),
    workoutDays,
  } satisfies CreateWorkoutPlanBody;
};

const normalizeWorkoutPlan = (workoutPlan: CreateWorkoutPlanBody) => {
  const normalizedWorkoutPlan = {
    name: workoutPlan.name.trim(),
    workoutDays: workoutPlan.workoutDays.map(normalizeWorkoutDay),
  };
  const parsedWorkoutPlan = workoutPlanSchema.safeParse(normalizedWorkoutPlan);

  if (!parsedWorkoutPlan.success) {
    return null;
  }

  return {
    name: parsedWorkoutPlan.data.name,
    workoutDays: parsedWorkoutPlan.data.workoutDays,
  } satisfies CreateWorkoutPlanBody;
};

const extractAssistantTexts = (messages: ChatMessage[]) =>
  messages
    .filter((message) => message.role === "assistant")
    .map((message) =>
      (message.parts ?? [])
        .filter((part) => part.type === "text" && typeof part.text === "string")
        .map((part) => part.text?.trim() ?? "")
        .filter(Boolean)
        .join("\n"),
    )
    .filter(Boolean);

export const extractWorkoutPlanFromMessages = (
  messages: ChatMessage[],
): CreateWorkoutPlanBody | null => {
  const assistantTexts = extractAssistantTexts(messages);

  for (const assistantText of [...assistantTexts].reverse()) {
    const structuredWorkoutPlan = tryParseStructuredWorkoutPlan(assistantText);

    if (structuredWorkoutPlan) {
      return normalizeWorkoutPlan(structuredWorkoutPlan);
    }
  }

  for (const assistantText of [...assistantTexts].reverse()) {
    const parsedWorkoutPlan = buildWorkoutPlanFromText(assistantText);

    if (parsedWorkoutPlan) {
      return normalizeWorkoutPlan(parsedWorkoutPlan);
    }
  }

  return null;
};
