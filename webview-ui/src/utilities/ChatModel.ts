// TODO: There's a better way to share these types between the main extension and the webview
// We don't even have to use the same types necessarily, but there should be a way to convert
// between them easily and safely

export interface ChatModel {
  chat: (request: ChatModelRequest) => Promise<ChatModelResponse>;
}

export interface ChatModelRequest {
  conversation: Conversation;
}

export interface ChatModelResponse {
  success: boolean;
  errorMessage?: string;
  message?: ChatMessage;
}

export interface ChatMessage {
  role: ChatRole;
  content: MessageBlock[];
  finishReason?: ChatMessageFinishReason;
}

export interface MessageBlock {
  type: "text" | "code";
  content: string; // In CodeBlock, the content is simply the code itself without the code fences or language identifier
}

export interface TextBlock extends MessageBlock {
  type: "text";
}

export interface CodeBlock extends MessageBlock {
  type: "code";
  languageId?: string; // The language identifier of the code block as used in markdown code fences
  linesInUserSourceFile?: {
    start: number;
    end: number;
  }; // The lines code in the editor that this code corresponds to (left inclusive, right exclusive)
}

export enum ChatRole {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

export enum ChatMessageFinishReason {
  Stop = "stop",
  Length = "length",
  ContentFilter = "content_filter",
}

export interface Conversation {
  id: number;
  name: string;
  messages: ChatMessage[];
  contextInstruction?: string;
}
