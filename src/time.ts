export const clocks = [
  "🕛",
  "🕐",
  "🕑",
  "🕒",
  "🕓",
  "🕔",
  "🕕",
  "🕖",
  "🕗",
  "🕘",
  "🕙",
  "🕚",
];

export const getCurrentClockEmoji = () => {
  const currentHour = new Date().getHours();

  console.log("currentHour", currentHour, clocks[currentHour % clocks.length]);

  return clocks[currentHour % clocks.length];
};
