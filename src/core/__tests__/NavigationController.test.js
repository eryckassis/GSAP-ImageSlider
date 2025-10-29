// NavigationController Unit Tests
// 🎯 Analogia: Testando o "Piloto" do slider
// Verifica se a navegação funciona corretamente

import { NavigationController } from '../NavigationController';

// Mock das configurações
jest.mock('../../config/slide.config', () => ({
  SLIDER_CONFIG: {
    autoSlide: true,
    autoSlideDelay: 3000,
    settings: {
      autoSlideSpeed: 3000, // ← IMPORTANTE: mock completo do config
    },
  },
  SLIDES_DATA: [
    { id: 1, image: 'img1.jpg', title: 'Slide 1' },
    { id: 2, image: 'img2.jpg', title: 'Slide 2' },
    { id: 3, image: 'img3.jpg', title: 'Slide 3' },
    { id: 4, image: 'img4.jpg', title: 'Slide 4' },
  ],
}));

describe('NavigationController', () => {
  let controller;
  let mockTextureLoader;
  let mockTransitionManager;

  // Setup executado ANTES de cada teste
  beforeEach(() => {
    // Cria mocks (objetos falsos) para as dependências
    mockTextureLoader = {
      isLoaded: true,
      loadTexture: jest.fn().mockResolvedValue({}),
      getTexture: jest.fn().mockReturnValue({ id: 1, texture: {} }), // ← Mock de getTexture
    };

    mockTransitionManager = {
      inProgress: false,
      startTransition: jest.fn().mockResolvedValue(),
      transition: jest.fn().mockImplementation((current, target, callback) => {
        // Simula transição e chama callback
        if (callback) {
          callback();
        }
        return Promise.resolve();
      }),
    };

    // Cria o controller com os mocks NA ORDEM CORRETA
    controller = new NavigationController(mockTextureLoader, mockTransitionManager);
  });

  // Cleanup executado DEPOIS de cada teste
  afterEach(() => {
    jest.clearAllMocks();
    controller.stop(); // Para timers
  });

  // 🧪 TESTES DE INICIALIZAÇÃO
  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(controller.currentIndex).toBe(0);
      expect(controller.enabled).toBe(false);
      expect(controller.slides).toHaveLength(4);
    });

    it('should store slides correctly', () => {
      expect(controller.slides[0].id).toBe(1);
      expect(controller.slides[0].image).toBe('img1.jpg');
    });

    it('should have valid dependencies', () => {
      expect(controller.textureLoader).toBe(mockTextureLoader);
      expect(controller.transitionManager).toBe(mockTransitionManager);
    });
  });

  // 🧪 TESTES DE START/STOP
  describe('start() and stop()', () => {
    it('should enable controller when started', () => {
      controller.start();
      expect(controller.enabled).toBe(true);
    });

    it('should not start if textures not loaded', () => {
      mockTextureLoader.isLoaded = false;
      controller.start();
      expect(controller.enabled).toBe(false);
    });

    it('should disable controller when stopped', () => {
      controller.start();
      controller.stop();
      expect(controller.enabled).toBe(false);
    });
  });

  // 🧪 TESTES DE NAVEGAÇÃO
  describe('navigateTo()', () => {
    beforeEach(() => {
      controller.enabled = true; // Habilita navegação
    });

    it('should navigate to specific slide', async () => {
      expect(controller.currentIndex).toBe(0);

      await controller.navigateTo(2);

      expect(controller.currentIndex).toBe(2);
    });

    it('should not navigate if disabled', async () => {
      controller.enabled = false;
      const initialIndex = controller.currentIndex;

      await controller.navigateTo(1);

      expect(controller.currentIndex).toBe(initialIndex);
    });

    it('should not navigate if transition in progress', async () => {
      mockTransitionManager.inProgress = true;
      const initialIndex = controller.currentIndex;

      await controller.navigateTo(1);

      expect(controller.currentIndex).toBe(initialIndex);
    });

    it('should not navigate to same slide', async () => {
      controller.currentIndex = 2;

      await controller.navigateTo(2);

      expect(mockTransitionManager.startTransition).not.toHaveBeenCalled();
    });

    it('should call transition manager on valid navigation', async () => {
      await controller.navigateTo(1);

      expect(mockTransitionManager.transition).toHaveBeenCalled();
    });
  });

  // 🧪 TESTES DE EDGE CASES
  describe('Edge Cases', () => {
    it('should handle navigation to out of bounds index', async () => {
      controller.enabled = true;

      // Tentar navegar para índice inválido não deve quebrar
      await expect(controller.navigateTo(99)).resolves.not.toThrow();
    });

    it('should handle negative index', async () => {
      controller.enabled = true;

      await expect(controller.navigateTo(-1)).resolves.not.toThrow();
    });
  });
});

/*
🎯 ESTRUTURA DE UM TESTE:

describe('Nome do módulo', () => {
  
  describe('Nome da funcionalidade', () => {
    
    it('should [comportamento esperado]', () => {
      // Arrange (preparar)
      const input = 'valor';
      
      // Act (agir)
      const result = funcao(input);
      
      // Assert (verificar)
      expect(result).toBe('esperado');
    });
    
  });
  
});

📚 MATCHERS ÚTEIS:
- toBe() - comparação estrita (===)
- toEqual() - comparação profunda de objetos
- toHaveLength() - verifica tamanho de array
- toHaveBeenCalled() - verifica se mock foi chamado
- toThrow() - verifica se lançou erro
- toBeTruthy() / toBeFalsy() - verifica boolean
- resolves / rejects - para Promises
*/
