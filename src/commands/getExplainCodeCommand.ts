import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ChatWebviewMessageSender } from "../webview/ChatWebviewMessageSender";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";

/**
 * Command to explain the selected code (or whole file if no selection) in a chat.
 * Sends the selection and the user's configured prompt as a chat message.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getExplainCodeCommand = (
  settingsProvider: SettingsProvider,
  chatDataManager: ChatDataManager,
  chatEditor: ChatEditor,
  llmApiService: LLMApiService,
  chatWebviewMessageSender: ChatWebviewMessageSender,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand("vscode-byolad.explainCode", async () => {
    const prompt = settingsProvider.getExplainCodePrompt();
    const includeCodeFromEditor = true;
    await sendChatMessage(
      chatDataManager.getActiveChat(),
      prompt,
      includeCodeFromEditor,
      chatWebviewMessageSender,
      chatEditor,
      chatDataManager,
      llmApiService,
      chatWebviewProvider,
    );
  });
