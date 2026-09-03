// daisyUI built-in themes (all themes from daisyui.com), each with swatch colors
// sampled from the official theme definitions.
export interface DaisyTheme {
  id: string;
  label: string;
  swatch: [string, string, string];
  dark: boolean;
}

export const daisyThemes: DaisyTheme[] = [
  { id: "light", label: "Light", swatch: ["#570df8", "#e5e6e6", "#ffffff"], dark: false },
  { id: "dark", label: "Dark", swatch: ["#7d85fe", "#1e293b", "#0f172a"], dark: true },
  { id: "cupcake", label: "Cupcake", swatch: ["#65c3c8", "#ef9fbc", "#faf7f5"], dark: false },
  { id: "bumblebee", label: "Bumblebee", swatch: ["#f9d45c", "#191d24", "#ffffff"], dark: false },
  { id: "emerald", label: "Emerald", swatch: ["#66cc8a", "#2a323c", "#ffffff"], dark: false },
  { id: "corporate", label: "Corporate", swatch: ["#4b6bfb", "#1c293d", "#ffffff"], dark: false },
  { id: "synthwave", label: "Synthwave", swatch: ["#e779c1", "#25094a", "#1a103d"], dark: true },
  { id: "retro", label: "Retro", swatch: ["#ef9995", "#291354", "#f4d07d"], dark: false },
  { id: "cyberpunk", label: "Cyberpunk", swatch: ["#ff7597", "#8718d7", "#fef7c0"], dark: false },
  { id: "valentine", label: "Valentine", swatch: ["#e96d7f", "#9b346f", "#f2d5df"], dark: false },
  { id: "halloween", label: "Halloween", swatch: ["#a9157e", "#8b16d7", "#212121"], dark: true },
  { id: "garden", label: "Garden", swatch: ["#51934b", "#273c33", "#ffffff"], dark: false },
  { id: "forest", label: "Forest", swatch: ["#10b981", "#1d2b23", "#171d1a"], dark: true },
  { id: "aqua", label: "Aqua", swatch: ["#09ecf3", "#1cd8c2", "#3d4452"], dark: true },
  { id: "lofi", label: "Lofi", swatch: ["#cd9a70", "#443637", "#ffffff"], dark: false },
  { id: "pastel", label: "Pastel", swatch: ["#d6bcfa", "#f0f1fa", "#ffffff"], dark: false },
  { id: "fantasy", label: "Fantasy", swatch: ["#7c3aed", "#1b1b32", "#0e0e1a"], dark: true },
  { id: "wireframe", label: "Wireframe", swatch: ["#b8b8b8", "#1b1b1b", "#ffffff"], dark: false },
  { id: "black", label: "Black", swatch: ["#ffffff", "#1f1f1f", "#000000"], dark: true },
  { id: "luxury", label: "Luxury", swatch: ["#ff9f6e", "#1f2937", "#0d0d15"], dark: true },
  { id: "dracula", label: "Dracula", swatch: ["#bd93f9", "#282a36", "#191a21"], dark: true },
  { id: "cmyk", label: "CMYK", swatch: ["#3ec7e6", "#c511b8", "#ffffff"], dark: false },
  { id: "autumn", label: "Autumn", swatch: ["#dc5050", "#ea9b24", "#f2e6dc"], dark: false },
  { id: "business", label: "Business", swatch: ["#1fd1ef", "#2a5e8f", "#0f172a"], dark: true },
  { id: "acid", label: "Acid", swatch: ["#ff0091", "#5a2ee5", "#0d0d0d"], dark: true },
  { id: "lemonade", label: "Lemonade", swatch: ["#fcd34d", "#a3e635", "#ffffff"], dark: false },
  { id: "night", label: "Night", swatch: ["#38bdf8", "#1e3a5f", "#0f172a"], dark: true },
  { id: "coffee", label: "Coffee", swatch: ["#db924c", "#a9815c", "#1e1a16"], dark: true },
  { id: "winter", label: "Winter", swatch: ["#15803d", "#1e3a8a", "#ffffff"], dark: false },
  { id: "dim", label: "Dim", swatch: ["#748afd", "#384765", "#2a2e39"], dark: true },
  { id: "nord", label: "Nord", swatch: ["#5e81ac", "#88c0d0", "#2e3440"], dark: true },
  { id: "sunset", label: "Sunset", swatch: ["#ff4059", "#ff7f4d", "#2b1c50"], dark: true },
];

export const DEFAULT_THEME = "dracula";