import { messages, type SupportedLanguage } from "./index.js";

export function translate(
    key: string,
    language: SupportedLanguage = "en",
): string {
    const errorMap = messages[language]?.errors as Record<string, string> | undefined;
    return (errorMap && errorMap[key]) || key;
}