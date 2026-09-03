export interface ModelPrice {
  model: string;
  inputPer1M: number; // USD
  cachedInputPer1M: number | null;
  outputPer1M: number; // USD
  notes?: string;
}

export const models: ModelPrice[] = [
  { model: "deepseek-v4-flash", inputPer1M: 0.44, cachedInputPer1M: 0.014, outputPer1M: 1.32 },
  { model: "deepseek-v4-pro", inputPer1M: 1.32, cachedInputPer1M: 0.044, outputPer1M: 3.96 },
  { model: "gemma4", inputPer1M: 0.14, cachedInputPer1M: 0.05, outputPer1M: 0.4 },
  { model: "glm-5.3", inputPer1M: 1.4, cachedInputPer1M: 0.26, outputPer1M: 4.4 },
  { model: "glm-5.3-flash", inputPer1M: 0.15, cachedInputPer1M: 0.03, outputPer1M: 0.5 },
  { model: "glm-5.2", inputPer1M: 1.4, cachedInputPer1M: 0.26, outputPer1M: 4.4 },
  { model: "glm-5.1", inputPer1M: 1.0, cachedInputPer1M: 0.2, outputPer1M: 3.2 },
  { model: "gpt-oss:120b", inputPer1M: 0.15, cachedInputPer1M: 0.014, outputPer1M: 0.6 },
  { model: "gpt-oss:20b", inputPer1M: 0.07, cachedInputPer1M: 0.035, outputPer1M: 0.3 },
  { model: "kimi-k3", inputPer1M: 3.0, cachedInputPer1M: 0.3, outputPer1M: 15.0 },
  { model: "kimi-k2.7-code", inputPer1M: 0.95, cachedInputPer1M: 0.19, outputPer1M: 4.0 },
  { model: "kimi-k2.6", inputPer1M: 0.95, cachedInputPer1M: 0.16, outputPer1M: 4.0 },
  { model: "minimax-m3", inputPer1M: 0.6, cachedInputPer1M: 0.12, outputPer1M: 2.4 },
  { model: "minimax-m2.7", inputPer1M: 0.3, cachedInputPer1M: 0.06, outputPer1M: 1.2 },
  { model: "mistral-large-3", inputPer1M: 0.5, cachedInputPer1M: 0.5, outputPer1M: 1.5 },
  { model: "nemotron-3-nano", inputPer1M: 0.06, cachedInputPer1M: 0.06, outputPer1M: 0.24 },
  { model: "nemotron-3-super", inputPer1M: 0.015, cachedInputPer1M: 0.015, outputPer1M: 0.6 },
  { model: "nemotron-3-ultra", inputPer1M: 0.1, cachedInputPer1M: 0.1, outputPer1M: 3.0 },
  { model: "qwen3.5:397b", inputPer1M: 0.6, cachedInputPer1M: 0.6, outputPer1M: 3.6 },
];