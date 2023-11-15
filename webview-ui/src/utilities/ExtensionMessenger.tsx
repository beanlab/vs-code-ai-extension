import { vscode } from "./vscode";

/**
 * Sends messages to the extension context.
 */
export class ExtensionMessenger {
  reviewCode() {
    vscode.postMessage({
      messageType: "reviewCode",
    });
  }

  explainCode() {
    vscode.postMessage({
      messageType: "explainCode",
    });
  }

  sendChatMessage(userInput: string, useCodeReference: boolean) {
    vscode.postMessage({
      messageType: "sendChatMessage",
      params: {
        userInput: userInput,
        useCodeReference: useCodeReference,
      },
    });
  }

  copyToClipboard(content: string): void {
    vscode.postMessage({
      messageType: "copyToClipboard",
      params: {
        content: content,
      },
    });
  }

  diffClodeBlock(code: string) {
    vscode.postMessage({
      messageType: "diffCodeBlock",
      params: {
        code: code,
      },
    });
  }

  insertCodeBlock(code: string) {
    vscode.postMessage({
      messageType: "insertCodeBlock",
      params: {
        code: code,
      },
    });
  }

  deleteAllConversations() {
    vscode.postMessage({
      messageType: "deleteAllConversations",
    });
  }

  newConversaiton() {
    vscode.postMessage({
      messageType: "newConversation",
    });
  }

  getByoladMessageIcon() {
    vscode.postMessage({
      messageType: "getByoladMessageIcon",
    });
  }
}
