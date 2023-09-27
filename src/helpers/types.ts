export enum CompletionProviderType {
  OpenAI = "OpenAI",
  Google = "Google",
}

export enum MessageSeverity {
  Error = "error",
  Warning = "warning",
  Info = "information",
}

export enum TextProviderScheme {
  AiCodeReview = "ai-code-review",
}

export enum ApplySuggestionsMode {
  Manual = "Manual",
  Auto = "Auto",
}

export enum ApplyChangesPosition {
  Current = "Current",
  Beside = "Beside",
  Below = "Below",
  UseMergeConflictSetting = "Use Merge Conflict Setting",
}
