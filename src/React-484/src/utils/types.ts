export type ChatMessage = {
  title: string;
  role: string;
  content: string;
};

export type Message = {
  BOT: string;
  USER: string;
};

export type Chat = {
  title: string;
  messages: Message[];
};
