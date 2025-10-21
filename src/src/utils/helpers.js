export const Easing = {
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  smoothstep: (edge0, edge1, x) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  },
};

export const ColorUtils = {
  hexToRgb: (hex) => {
    if (hex.startsWith("#")) {
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ];
    }
    const match = hex.match(/\d+/g);
    return match
      ? [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])]
      : [255, 255, 255];
  },

  interpolateColor: (color1, color2, t, opacity = 1) => {
    const rgb1 = ColorUtils.hexToRgb(color1);
    const rgb2 = ColorUtils.hexToRgb(color2);
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
};

export const DOMUtils = {
  createElement: (tag, className = "", innerHTML = "") => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  addEventListeners: (element, events) => {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  },

  removeEventListeners: (element, events) => {
    Object.entries(events).forEach(([event, handler]) => {
      element.removeEventListener(event, handler);
    });
  },

  setStyles: (element, styles) => {
    Object.assign(element.style, styles);
  },

  toggleClass: (element, className, condition) => {
    element.classList.toggle(className, condition);
  },
};

export const ArrayUtils = {
  getNext: (array, currentIndex) => (currentIndex + 1) % array.length,

  getPrevious: (array, currentIndex) =>
    (currentIndex - 1 + array.length) % array.length,

  isValidIndex: (array, index) => index >= 0 && index < array.length,

  shuffle: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

export const PerformanceUtils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  requestIdleCallback: (callback) => {
    if (window.requestIdleCallback) {
      return window.requestIdleCallback(callback);
    }
    return setTimeout(callback, 16);
  },
};

export const ValidationUtils = {
  isNumber: (value) => typeof value === "number" && !isNaN(value),

  isPositiveNumber: (value) => ValidationUtils.isNumber(value) && value > 0,

  isInRange: (value, min, max) =>
    ValidationUtils.isNumber(value) && value >= min && value <= max,

  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
};

export const FormatUtils = {
  padNumber: (num, length = 2) => String(num).padStart(length, "0"),

  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),

  kebabCase: (str) => str.toLowerCase().replace(/\s+/g, "-"),

  camelCase: (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
};

export const DeviceUtils = {
  isMobile: () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),

  isTablet: () => /iPad|Android|Tablet/i.test(navigator.userAgent),

  isTouchDevice: () => "ontouchstart" in window || navigator.maxTouchPoints > 0,

  getViewportSize: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }),

  getPixelRatio: () => Math.min(window.devicePixelRatio || 1, 2),
};
