import { Conversation } from "./conversation";
import { ExtensionContext } from "vscode";
import { ChatMessage } from "../ChatModel/ChatModel";
import { CONTEXT_INSTRUCTION } from "../commands/constants";

export class ConversationManager {
  // TODO: Use constants where needed
  private readonly context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  get conversations(): Conversation[] {
    return (
      this.context.workspaceState.get<Conversation[]>("conversations") || []
    );
  }

  set conversations(value: Conversation[]) {
    const ids = value.map((conversation) => conversation.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate ids");
    }
    this.context.workspaceState.update("conversations", value);
  }

  get conversationIds(): number[] {
    return this.context.workspaceState.get<number[]>("conversationIds") || [];
  }

  set conversationIds(value: number[]) {
    if (new Set(value).size !== value.length) {
      throw new Error("Duplicate ids");
    }
    this.context.workspaceState.update("conversationIds", value);
  }

  get activeConversationId(): number | null {
    return (
      this.context.workspaceState.get<number>("activeConversationId") || null
    );
  }

  set activeConversationId(value: number | null) {
    const conversationIds = this.conversationIds;
    if (value && !this.conversationIds.includes(value)) {
      throw new Error("Conversation ID does not exist");
    }
    this.context.workspaceState.update("activeConversationId", value);
  }

  getConversation(id: number): Conversation | undefined {
    return this.conversations.find((conversation) => conversation.id === id);
  }

  getActiveConversation(): Conversation | undefined {
    if (!this.activeConversationId) {
      return undefined;
    }
    return this.getConversation(this.activeConversationId);
  }

  /**
   *
   * @returns An array of conversation previews, each containing the conversation id and name.
   */
  getConversationPreviews(): {
    id: number;
    name: string;
  }[] {
    return this.conversations.map((conversation) => {
      return {
        id: conversation.id,
        name: conversation.name,
      };
    });
  }

  /**
   * Adds a conversation to the conversation history and sets it as the active conversation.
   * Throws an error if a conversation with the same id already exists.
   *
   * @param name Conversation name
   * @param messages Conversation messages
   * @returns The created conversation
   */
  startConversation(name: string, messages?: ChatMessage[]): Conversation {
    const conversation = this.createConversation(name, messages);
    this.conversations = [...this.conversations, conversation];
    try {
      if (!this.conversationIds.includes(conversation.id)) {
        this.conversationIds = [...this.conversationIds, conversation.id];
      }
    } catch (error) {
      // Rollback the first operation
      this.conversations = this.conversations.filter(
        (c) => c.id !== conversation.id
      );
      throw error;
    }
    this.activeConversationId = conversation.id;
    return conversation;
  }

  /**
   * Returns a new Conversation object with the given name and messages.
   * Allocates a new id for the conversation (1 higher than the current
   * max or 1 if there are no conversations yet).
   * Note: Does not add the conversation to the conversation history.
   *
   * @param name
   * @param messages
   * @returns A new Conversation object
   */
  private createConversation(
    name: string,
    messages?: ChatMessage[]
  ): Conversation {
    let newId: number;
    if (this.conversationIds.length > 0) {
      newId = Math.max(...this.conversationIds) + 1;
    } else {
      newId = 1;
    }
    const conversation: Conversation = {
      id: newId,
      name,
      messages: messages ?? [],
      contextInstruction: CONTEXT_INSTRUCTION,
    };
    return conversation;
  }

  /**
   * Updates the conversation with the given id.
   * Throws an error if no conversation with the given id exists.
   *
   * @param updatedConversation
   */
  updateConversation(updatedConversation: Conversation): void {
    if (
      !this.conversations.some((convo) => convo.id === updatedConversation.id)
    ) {
      throw new Error("No conversation with id exists");
    }
    this.conversations = this.conversations.map((convo) => {
      if (convo.id === updatedConversation.id) {
        return updatedConversation;
      }
      return convo;
    });
  }

  /**
   * Deletes the conversation with the given id from the conversation history if it exists.
   *
   * @param id
   */
  deleteConversation(id: number) {
    const oldConversations = this.conversations;
    this.conversations = this.conversations.filter(
      (conversation) => conversation.id !== id
    );
    try {
      if (this.conversationIds.includes(id)) {
        this.conversationIds = this.conversationIds.filter((i) => i !== id);
      }
    } catch (error) {
      // Rollback the first operation
      this.conversations = oldConversations;
      throw error;
    }
  }

  /**
   * Deletes all conversations from the conversation history.
   */
  clearAllConversations() {
    this.conversations = [];
    this.conversationIds = [];
    this.activeConversationId = null;
  }
}
