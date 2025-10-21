export const TIMING = {
  DEFAULT_TRANSITION_DURATION: 2.5,
  DEFAULT_AUTO_SLIDE_SPEED: 5000,
  PROGRESS_UPDATE_INTERVAL: 50,
  LOADING_DURATION: 3000,
  TIMER_DELAY: 100,
  FADE_DURATION: 300,
  END_TRANSITION_THRESHOLD: 0.95,
  END_TRANSITION_DURATION: 0.05,
};

export const EFFECTS_TYPES = {
  GLASS: 0,
  FROST: 1,
  RIPPLE: 2,
  PLASMA: 3,
  TIMESHIFT: 4,
};

export const EFFECT_NAMES = {
  GLASS: "glass",
  FROST: "frost",
  RIPPLE: "ripple",
  PLASMA: "plasma",
  TIMESHIFT: "timeshift",
};

export const INTERACTION = {
  MIN_SWIPE_DISTANCE: 50,
  TOUCH_THRESHOLD: 10,
};

export const RENDERING = {
  MAX_PIXEL_RATIO: 2,
  GEOMETRY_SIZE: 2,
  CAMERA_BOUNDS: { left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1 },
};

export const LOADING = {
  CANVAS_SIZE: 300,
  DOT_RINGS: [
    { radius: 20, count: 8 },
    { radius: 35, count: 12 },
    { radius: 50, count: 16 },
    { radius: 65, count: 20 },
    { radius: 80, count: 24 },
  ],
  COLORS: {
    PRIMARY: "#ffffff",
    ACCENT: "#dddddd",
  },
};

export const SELECTORS = {
  SLIDER_WRAPPER: ".slider-wrapper",
  WEBGL_CANVAS: ".webgl-canvas",
  SLIDE_NUMBER: "#slideNumber",
  SLIDE_TOTAL: "#slideTotal",
  SLIDES_NAV: "#slidesNav",
  SLIDE_NAV_ITEM: ".slide-nav-item",
  SLIDE_PROGRESS_FILL: ".slide-progress-fill",
  TWEAKPANE: ".tp-dfwv",
};

export const CSS_CLASSES = {
  LOADED: "loaded",
  ACTIVE: "active",
  SLIDE_NAV_ITEM: "slide-nav-item",
  SLIDE_PROGRESS_LINE: "slide-progress-line",
  SLIDE_PROGRESS_FILL: "slide-progress-fill",
  SLIDE_NAV_TITLE: "slide-nav-title",
};

export const EVENTS = {
  SLIDE_CHANGE: "slideChange",
  EFFECT_CHANGE: "effectChange",
  PRESET_CHANGE: "presetChange",
  TIMER_START: "timerStart",
  TIMER_STOP: "timerStop",
  TEXTURE_LOADED: "textureLoaded",
  ALL_TEXTURES_LOADED: "allTexturesLoaded",
  TRANSITION_START: "transitionStart",
  TRANSITION_COMPLETE: "transitionComplete",
  LOADING_COMPLETE: "loadingComplete",
};

export const VALIDATION = {
  MIN_SLIDES: 2,
  MAX_SLIDES: 20,
  TEXTURE_TIMEOUT: 10000,
};
