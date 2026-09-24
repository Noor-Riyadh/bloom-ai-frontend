"use client";

import { useEffect, useState } from "react";

export function ReadAloudButton({
  text,
  language = "en",
}: {
  text: string;
  language?: "en" | "ar";
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window,
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function toggleSpeech() {
    if (!supported || !text.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const requestedLanguage = language === "ar" ? "ar" : "en";
    const matchingVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(requestedLanguage),
    );

    utterance.lang = language === "ar" ? "ar-SA" : "en-US";
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={toggleSpeech}
      disabled={!supported || !text.trim()}
      title={
        supported
          ? undefined
          : "Read Aloud is not supported by this browser."
      }
      className="mt-3 rounded-lg border border-[#a900eb] px-3 py-1.5 text-sm font-semibold text-[#a900eb] transition hover:bg-[#a900eb] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSpeaking ? "⏹ Stop" : "🔊 Read Aloud"}
    </button>
  );
}
