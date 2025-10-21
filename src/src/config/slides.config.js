/**
 * Configuração dos slides
 * Centralizando dados para facilitar manutenção
 */

export const SLIDES_CONFIG = [
  {
    id: "ethereal-glow",
    title: "Ethereal Glow",
    media: "https://assets.codepen.io/7558/orange-portrait-001.jpg",
    description: "Uma luz etérea que ilumina a alma",
    metadata: {
      author: "Unknown",
      category: "portrait",
      tags: ["ethereal", "glow", "light"],
    },
  },
  {
    id: "rose-mirage",
    title: "Rose Mirage",
    media: "https://assets.codepen.io/7558/orange-portrait-002.jpg",
    description: "Miragem rosa no horizonte dos sonhos",
    metadata: {
      author: "Unknown",
      category: "portrait",
      tags: ["rose", "mirage", "dream"],
    },
  },
  {
    id: "velvet-mystique",
    title: "Velvet Mystique",
    media: "https://assets.codepen.io/7558/orange-portrait-003.jpg",
    description: "Mistério envolvido em veludo",
    metadata: {
      author: "Unknown",
      category: "portrait",
      tags: ["velvet", "mystique", "mystery"],
    },
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    media: "https://assets.codepen.io/7558/orange-portrait-004.jpg",
    description: "O momento dourado do dia",
    metadata: {
      author: "Unknown",
      category: "portrait",
      tags: ["golden", "hour", "sunset"],
    },
  },
  {
    id: "midnight-dreams",
    title: "Midnight Dreams",
    media: "https://assets.codepen.io/7558/orange-portrait-005.jpg",
    description: "Sonhos que dançam na meia-noite",
    metadata: {
      author: "Unknown",
      category: "portrait",
      tags: ["midnight", "dreams", "night"],
    },
  },
  {
    id: "silver-light",
    title: "Silver Light",
    media: "https://assets.codepen.io/7558/orange-portrait-006.jpg",
    description: "Luz prateada que guia o caminho",
    metadata: {
      author: "Unknown",
      category: "portrait",
      tags: ["silver", "light", "guidance"],
    },
  },
];

export const SLIDE_BEHAVIOR = {
  autoPlay: true,
  loop: true,
  pauseOnHover: false,
  pauseOnFocus: true,
  keyboardNavigation: true,
  touchNavigation: true,
  mouseNavigation: true,
};

export const PRELOAD_CONFIG = {
  strategy: "eager",
  concurrent: 3,
  retryAttempts: 3,
  retryDelay: 1000,
};
