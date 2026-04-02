export const CHAT_OPEN_QUERY_KEY = "chat_open";
export const CHAT_INITIAL_MESSAGE_QUERY_KEY = "chat_initial_message";

export const getExerciseChatInitialMessage = (exerciseName: string) => {
  return `Explique como executar o exercício ${exerciseName} corretamente. Responda em português do Brasil, de forma objetiva, com postura inicial, execução passo a passo, respiração, erros comuns e dicas de segurança. Não peça dados pessoais e não monte um plano de treino completo.`;
};
