import type { Reel } from "./types";

function getRandomWord(reel: Reel): string {
  const idx = Math.floor(Math.random() * reel.words.length);
  return reel.words[idx];
}

export function getRandomWords(): [string, string, string] {
  return [
    getRandomWord(REELS[0]),
    getRandomWord(REELS[1]),
    getRandomWord(REELS[2]),
  ];
}

export const REELS: Reel[] = [
  {
    position: "1",
    words: [
      "favourite",
      "unexpected",
      "forgotten",
      "first",
      "last",
      "strangest",
      "happiest",
      "quietest",
      "loudest",
      "smallest",
      "biggest",
      "embarrassing",
      "proudest",
      "scariest",
      "funniest",
    ],
  },
  {
    position: "2",
    words: [
      "childhood",
      "morning",
      "summer",
      "secret",
      "family",
      "midnight",
      "birthday",
      "holiday",
      "school",
      "workplace",
      "neighbourhood",
      "weekend",
      "kitchen",
      "travel",
    ],
  },
  {
    position: "3",
    words: [
      "sandwich",
      "adventure",
      "conversation",
      "mistake",
      "discovery",
      "friendship",
      "lesson",
      "gift",
      "meal",
      "photograph",
      "sound",
      "smell",
      "habit",
      "dream",
      "decision",
    ],
  },
];
