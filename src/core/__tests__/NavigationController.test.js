// NavigationController Unit Tests
// 🎯 Analogia: Testando o "Piloto" do slider
// Verifica se a navegação funciona corretamente

import { NavigationController } from '../NavigationController';

describe('NavigationController', () => {
  let controller;
  let mockTransitionManager;
  let mockConfig;

  // Setup executado ANTES de cada teste
  beforeEach(() => {
    // Cria mocks (objetos falsos) para as dependências
    mockTransitionManager = {
      startTransition: jest.fn(), // Função mock que podemos espionar
    };

    mockConfig = {
      images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
      autoplay: false,
      autoplayDelay: 3000,
    };

    // Cria o controller com os mocks
    controller = new NavigationController(mockTransitionManager, mockConfig);
  });

  // Cleanup executado DEPOIS de cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 TESTES DE INICIALIZAÇÃO
  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(controller.currentIndex).toBe(0);
      expect(controller.isTransitioning).toBe(false);
      expect(controller.progress).toBe(0);
    });

    it('should store config correctly', () => {
      expect(controller.config.images).toHaveLength(4);
      expect(controller.config.autoplay).toBe(false);
    });
  });

  // 🧪 TESTES DE NAVEGAÇÃO FORWARD
  describe('next()', () => {
    it('should increment slide index', () => {
      expect(controller.currentIndex).toBe(0);

      controller.next();

      expect(controller.currentIndex).toBe(1);
    });

    it('should wrap to first slide after last', () => {
      controller.currentIndex = 3; // Último slide

      controller.next();

      expect(controller.currentIndex).toBe(0);
    });

    it('should call transition manager', () => {
      controller.next();

      expect(mockTransitionManager.startTransition).toHaveBeenCalled();
    });

    it('should not navigate if already transitioning', () => {
      controller.isTransitioning = true;
      const initialIndex = controller.currentIndex;

      controller.next();

      expect(controller.currentIndex).toBe(initialIndex);
      expect(mockTransitionManager.startTransition).not.toHaveBeenCalled();
    });
  });

  // 🧪 TESTES DE NAVEGAÇÃO BACKWARD
  describe('previous()', () => {
    it('should decrement slide index', () => {
      controller.currentIndex = 2;

      controller.previous();

      expect(controller.currentIndex).toBe(1);
    });

    it('should wrap to last slide before first', () => {
      controller.currentIndex = 0;

      controller.previous();

      expect(controller.currentIndex).toBe(3); // Último slide
    });

    it('should call transition manager', () => {
      controller.previous();

      expect(mockTransitionManager.startTransition).toHaveBeenCalled();
    });
  });

  // 🧪 TESTES DE NAVEGAÇÃO DIRETA
  describe('goTo(index)', () => {
    it('should navigate to specific index', () => {
      controller.goTo(2);

      expect(controller.currentIndex).toBe(2);
    });

    it('should handle negative indices', () => {
      controller.goTo(-1);

      // Deve ir para o último slide
      expect(controller.currentIndex).toBe(3);
    });

    it('should handle indices out of bounds', () => {
      controller.goTo(10);

      // Deve fazer wrap
      expect(controller.currentIndex).toBe(2); // 10 % 4 = 2
    });
  });

  // 🧪 TESTES DE AUTOPLAY
  describe('Autoplay', () => {
    beforeEach(() => {
      jest.useFakeTimers(); // Usa timers fake do Jest
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start autoplay when enabled', () => {
      const autoplayConfig = { ...mockConfig, autoplay: true };
      const autoplayController = new NavigationController(mockTransitionManager, autoplayConfig);

      const initialIndex = autoplayController.currentIndex;

      // Avança o tempo
      jest.advanceTimersByTime(3000);

      // Deve ter avançado para o próximo slide
      expect(autoplayController.currentIndex).toBe(initialIndex + 1);
    });

    it('should stop autoplay when user interacts', () => {
      const autoplayConfig = { ...mockConfig, autoplay: true };
      const autoplayController = new NavigationController(mockTransitionManager, autoplayConfig);

      autoplayController.stopAutoplay();

      const { currentIndex } = autoplayController;
      jest.advanceTimersByTime(5000);

      // Não deve ter avançado
      expect(autoplayController.currentIndex).toBe(currentIndex);
    });
  });

  // 🧪 TESTES DE EDGE CASES
  describe('Edge Cases', () => {
    it('should handle empty images array', () => {
      const emptyConfig = { ...mockConfig, images: [] };
      const emptyController = new NavigationController(mockTransitionManager, emptyConfig);

      expect(() => emptyController.next()).not.toThrow();
    });

    it('should handle single image', () => {
      const singleConfig = { ...mockConfig, images: ['img1.jpg'] };
      const singleController = new NavigationController(mockTransitionManager, singleConfig);

      singleController.next();

      // Deve ficar no mesmo índice
      expect(singleController.currentIndex).toBe(0);
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
*/
