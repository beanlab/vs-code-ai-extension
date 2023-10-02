// File for any constants used in commands

// Review command constants
export const CODE_REVIEW_INSTRUCTION = `Review the provided code. Return code that reflects the following improvements:
  - fix bugs
  - improve code quality, best practices, readability
  - improve performance
  - provide code comments as necessary
  - add missing documentation`;
export const CODE_REVIEW_PROGRESS_TITLE = "Reviewing code...";
export const PROMPT_FOR_USER_PROMPT =
  "Enter a request for the AI's review of the code.";
export const INVALID_USER_INPUT_ERROR_MESSAGE =
  "No input provided. Cannot query model.";
export const CUSTOM_PROMPT_TEMPLATE_PREFIX =
  "You are a coding assistant. Return only the modified code. Avoid returning any code fences or additional explanations. Your primary task: ";
export const CUSTOM_PROMPT_TEMPLATE_SUFFIX = "\nCode to review:\n";
export const EMPTY_COMPLETION_ERROR_MESSAGE =
  "Empty completion returned from model";
export const NO_COMPLETION_ERROR_MESSAGE = "No completion returned from model";
export const UNKNOWN_COMPLETION_ERROR_MESSAGE =
  "Unknown error occurred while getting the completion from the model";
export const DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE = ": AI Suggestions ↔ Current";
export const DIFF_VIEW_TITLE_SUFFIX_AUTO_MODE =
  ": Original → Incoming AI Suggestions";
export const NOT_IMPLEMENTED_ERROR_MESSAGE = "Not implemented";
export const MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE =
  "Error with byoLAD extension setting applySuggestions.diffViewPosition: Could not get merge-conflict.diffViewPosition setting or it doesn't match any of the available options (likely due to a breaking change in that extension). Using the default byoLAD setting.";
