// Jest Setup
// 🎯 Analogia: O "Setup do Laboratório" - executado ANTES de cada teste
// Aqui você pode adicionar configurações globais, polyfills, etc.

// Configurações globais do DOM
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do HTMLCanvasElement se necessário
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    createImageData: jest.fn(),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
  }));
}

// Aumenta timeout para testes assíncronos se necessário
jest.setTimeout(10000);

/*
💡 DICA:
Este arquivo é executado uma vez antes de todos os testes.
Use para:
- Configurar mocks globais
- Adicionar matchers customizados
- Configurar bibliotecas de teste
- Adicionar polyfills
*/
