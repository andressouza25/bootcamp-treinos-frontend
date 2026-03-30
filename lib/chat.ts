export const CHAT_OPEN_QUERY_KEY = "chat_open";
export const CHAT_INITIAL_MESSAGE_QUERY_KEY = "chat_initial_message";

export const getExerciseChatInitialMessage = (exerciseName: string) => {
  return `Como executar o exercício ${exerciseName} corretamente?`;
};
