import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { ChatRole, Conversation } from "./utilities/ChatModel";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import {
  ExtensionToWebviewMessage,
  RefreshChatMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { ChatMessage } from "./utilities/ChatModel";
import { Message } from "./components/Message";
import { ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [history, setHistory] = useState<Array<ChatMessage>>([]);
  const extensionMessenger = new ExtensionMessenger();
  const imagePaths: ImagePaths = window.initialState?.imagePaths;
  const [vsCodeTheme, setVsCodeTheme] = useState(VsCodeTheme.Dark);

  useEffect(() => {
    const theme = getVsCodeThemeFromCssClasses(document.body.className);
    if (theme !== undefined) {
      setVsCodeTheme(theme);
    }

    // Watches the <body> element of the webview for changes to its theme classes, tracking that state
    const mutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const theme = getVsCodeThemeFromCssClasses(document.body.className);
            if (theme !== undefined) {
              setVsCodeTheme(theme);
            }
            return;
          }
        });
      },
    );
    mutationObserver.observe(document.body, { attributes: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, []); // Empty array arg means the code in the `useEffect` will only run on mount and unmount

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newval = event.target.value;
    setUserPrompt(newval);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userPrompt === "") {
      return;
    }
    newUserMessage();
  };

  function newUserMessage() {
    extensionMessenger.sendChatMessage(userPrompt, true); // TODO: identify if they want to use the selected code/whole file as a code reference to the model
  }

  const messages = history.map((message, position) => {
    console.log(position);
    if (message.role != ChatRole.System) {
      return (
        <Message
          role={message.role}
          messageBlocks={message.content}
          extensionMessenger={extensionMessenger}
          imagePaths={imagePaths}
        />
      );
    }
  });

  /**
   * Handle messages sent from the extension to the webview
   */
  window.addEventListener("message", (event) => {
    const message = event.data as ExtensionToWebviewMessage;
    switch (message.messageType) {
      case "refreshChat": {
        const params = message.params as RefreshChatMessageParams;
        const conversation = params.activeConversation as Conversation | null;
        setHistory(conversation?.messages ?? []);
        setUserPrompt("");
        // TODO: Handle refresh request (which contains the contents of the active conversation, including any messages that have just been received)
        // Display the new messages from the model or completely change the chat history in line with the provided active conversation
        // How should we display there being no active conversation? Should that even be an option or should there always have to be something?
        break;
      }
      default:
        // TODO: How to handle?
        console.log("Unknown event 'message' received: ", event);
        break;
    }
  });

  return (
    <VsCodeThemeContext.Provider value={vsCodeTheme}>
      <div className="App">
        <img src={imagePaths.byoLadCircleImageUri} width="50%" />
        <div className="App-body">
          <div className="App-body1">
            <p>
              Here you can chat with the AI about your code. You can ask
              whatever you want, but the best is to ask question about your code
              or generating new code.
            </p>
            <div>
              <VSCodeButton onClick={extensionMessenger.reviewCode}>
                Review Code
              </VSCodeButton>
              <br />
              <VSCodeButton onClick={extensionMessenger.explainCode}>
                Explain Code
              </VSCodeButton>
              <br />
              <VSCodeButton onClick={extensionMessenger.newConversaiton}>
                New Conversation
              </VSCodeButton>
              <br />
              <VSCodeButton onClick={extensionMessenger.deleteAllConversations}>
                Delete All Conversations
              </VSCodeButton>
              <br />
            </div>
            <div>{messages}</div>
          </div>
        </div>

        <footer className="App-footer">
          <div className="chat-box">
            <form
              className="chat-bar"
              name="chatbox"
              onSubmit={(e) => handleSubmit(e)}
            >
              <input
                onChange={handleInputOnChange}
                value={userPrompt}
                type="text"
                placeholder="Ask a question to the AI"
              />
              <VSCodeButton
                type="submit"
                appearance="icon"
                aria-label="Send message"
                title="Send message"
              >
                <span className="codicon codicon-send"></span>
              </VSCodeButton>
            </form>
          </div>
        </footer>
      </div>
    </VsCodeThemeContext.Provider>
  );
}

export default App;
