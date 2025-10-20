// Content script

const PLAYER_ID = "movie_player";
const STYLE_ELEMENT_ID = "yt-hide-control-on-pause";
const STYLE_ELEMENT_CONTENT = "yt-hide-control-on-pause-css";
const BOTTOM_CTRL_CLASS = ".ytp-chrome-bottom";
const BOTTOM_GRADIENT_CLASS = ".ytp-gradient-bottom";
const FULL_SCREEN_TOP_CTRL_CLASS = ".ytp-chrome-top";
const FULL_SCREEN_TOP_GRADIENT_CLASS = ".ytp-gradient-top";

let bottomCtrl;
let bottomGradient;
let fullScreenTopCtrl;
let fullScreenTopGradient;

/**
 * Injects a CSS style element
 */
function injectCSS() {
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `
        .${STYLE_ELEMENT_CONTENT} {
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          transition: opacity 0s !important;
        }
      `;
  document.head.appendChild(style);
}

/**
 * Event listener callback, hides controls and vignette overlay
 */
function hideControls() {
  bottomCtrl.classList.add(STYLE_ELEMENT_CONTENT);
  bottomGradient.classList.add(STYLE_ELEMENT_CONTENT);
  fullScreenTopCtrl.classList.add(STYLE_ELEMENT_CONTENT);
  fullScreenTopGradient.classList.add(STYLE_ELEMENT_CONTENT);
}

/**
 * Event listener callback, shows controls and vignette overlay
 */
function showControls() {
  bottomCtrl.classList.remove(STYLE_ELEMENT_CONTENT);
  bottomGradient.classList.remove(STYLE_ELEMENT_CONTENT);
  fullScreenTopCtrl.classList.remove(STYLE_ELEMENT_CONTENT);
  fullScreenTopGradient.classList.remove(STYLE_ELEMENT_CONTENT);
}

/**
 * Registers event listeners for mouse enter and mouse leave events on the video player
 */
function setupEventListeners(player) {
  console.debug("[YT Hide Control On Pause - Extension] setupEventListeners()");

  injectCSS();

  bottomCtrl = document.querySelector(BOTTOM_CTRL_CLASS);
  bottomGradient = document.querySelector(BOTTOM_GRADIENT_CLASS);
  if (!bottomCtrl || !bottomGradient) {
    console.error(
      "[YT Hide Control On Pause - Extension] Failed to find bottom control and gradient element"
    );
    return;
  }

  fullScreenTopCtrl = document.querySelector(FULL_SCREEN_TOP_CTRL_CLASS);
  fullScreenTopGradient = document.querySelector(
    FULL_SCREEN_TOP_GRADIENT_CLASS
  );
  if (!fullScreenTopCtrl || !fullScreenTopGradient) {
    console.warn(
      "[YT Hide Control On Pause - Extension] Failed to find fullscreen top gradient element"
    );
  }

  player.addEventListener("mouseenter", showControls);
  player.addEventListener("mouseleave", hideControls);

  // Initial state: hide if mouse is not over player
  if (!player.matches(":hover")) {
    hideControls();
  } else {
    showControls();
  }
}

function main() {
  const player = document.getElementById(PLAYER_ID);
  if (player) {
    setupEventListeners(player);
  } else {
    // wait for the player element to be available
    const observer = new MutationObserver((mutations, obs) => {
      console.debug("[YT Hide Control On Pause - Extension] MutationObserver");
      const player = document.getElementById(PLAYER_ID);
      if (player) {
        obs.disconnect();
        setupEventListeners(player);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

main();
