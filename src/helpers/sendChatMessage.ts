import * as vscode from "vscode";
import {
  ChatMessage,
  ChatModelResponse,
  ChatRole,
} from "../ChatModel/ChatModel";
import { Conversation } from "../ChatModel/ChatModel";
import { SettingsProvider } from "./SettingsProvider";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export async function sendChatMessage(
  chatMessage: ChatMessage,
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  const conversation = conversationManager.getActiveConversation();
  if (!conversation) {
    vscode.window.showErrorMessage("No active conversation");
    return;
  }

  if (
    conversation.messages.length === 0 ||
    conversation.messages[conversation.messages.length - 1].role !==
      ChatRole.User
  ) {
    conversation.messages.push(chatMessage);
  } else {
    conversation.messages[conversation.messages.length - 1] = chatMessage;
  }

  let response: ChatModelResponse;
  // TODO: Use a loading/typing indicator of sorts in the side panel instead of notification progress bar
  vscode.window
    .withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: "Sending message...", // TODO: make this a constant
      },
      async () => {
        response = await settingsProvider.getChatModel().chat({
          conversation,
        });
      },
    )
    .then(async () => {
      if (response.success && response.message) {
        handleSuccessfulResponse(
          response.message,
          conversation,
          conversationManager,
          chatWebviewProvider,
        );
      } else {
        handleErrorResponse(response);
      }
    });
}

/**
 * Handle a successful response from the chat model. Update the conversation and the side panel.
 *
 * @param responseMessage Response message from the chat model
 * @param conversation Conversation to update
 * @param conversationManager Conversation manager
 * @param chatWebviewProvider Current side panel
 */
function handleSuccessfulResponse(
  responseMessage: ChatMessage,
  conversation: Conversation,
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
): void {
  conversation.messages.push(responseMessage);
  conversationManager.updateConversation(conversation);
  chatWebviewProvider.updateConversation(
    conversationManager.conversations,
    null,
  );
}

/**
 * TODO: How to handle all of these? Probably depends on how the webview sidepanel is implemented.
 *
 * @param response
 * @param conversation
 * @param conversationManager
 */
function handleErrorResponse(
  response: ChatModelResponse,
  // conversation: Conversation,
  // conversationManager: ConversationManager,
): void {
  if (!response.success) {
    if (response.errorMessage) {
      vscode.window.showErrorMessage(`Error: ${response.errorMessage}`);
    } else {
      vscode.window.showErrorMessage("Unknown error");
    }
  } else if (!response.message) {
    vscode.window.showErrorMessage(
      "Response marked successful, but no message was returned",
    );
  } else {
    vscode.window.showErrorMessage("Unknown error");
  }
}
