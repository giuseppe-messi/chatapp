// Tailwind color palette
const colors = [
  "#800000	",
  "#ff0000",
  "#800080",
  "#ff00ff",
  "#008000",
  "#00ff00",
  "#808000",
  "#ffff00",
  "#000080",
  "#0000ff",
  "#008080",
  "#00ffff"
];

export function getRandomAvatarColor(): string {
  const index = Math.floor(Math.random() * colors.length);
  return `${colors[index]}c7`;
}
