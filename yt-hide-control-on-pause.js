// Content script

(function () {
  const STYLE_ELEMENT_ID = "yt-hide-control-on-pause";
  const STYLE_ELEMENT_CONTENT = "yt-hide-control-on-pause-hide";
  const CTRL_CLASS_ID = ".ytp-chrome-bottom";
  const GRADIENT_CLASS_ID = ".ytp-gradient-bottom";

  // Injects a style element for the plugin's hide class
  function injectCSS() {
    if (document.getElementById(STYLE_ELEMENT_ID)) return;
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

  // Hides controls and vignette overlay
  function hideControls() {
    const controls = document.querySelector(CTRL_CLASS_ID);
    const gradient = document.querySelector(GRADIENT_CLASS_ID);
    if (controls) controls.classList.add(STYLE_ELEMENT_CONTENT);
    if (gradient) gradient.classList.add(STYLE_ELEMENT_CONTENT);
  }

  // Shows controls and vignette overlay
  function showControls() {
    const controls = document.querySelector(CTRL_CLASS_ID);
    const gradient = document.querySelector(GRADIENT_CLASS_ID);
    if (controls) controls.classList.remove(STYLE_ELEMENT_CONTENT);
    if (gradient) gradient.classList.remove(STYLE_ELEMENT_CONTENT);
  }

  /**
   * Sets up the hover show/hide logic for the video controls and vignette.
   * @param {HTMLVideoElement} video - The video element to attach logic to.
   */
  function setup(video) {
    if (!video) return;
    injectCSS();

    // Get the main player area
    const player = document.querySelector(".html5-video-player");
    if (!player) return;

    // Remove any previous listeners (defensive)
    player.removeEventListener("mouseenter", showControls);
    player.removeEventListener("mouseleave", hideControls);

    // Add listeners for instant show/hide
    player.addEventListener("mouseenter", showControls);
    player.addEventListener("mouseleave", hideControls);

    // Initial state: hide if mouse is not over player
    if (!player.matches(":hover")) {
      hideControls();
    } else {
      showControls();
    }
  }

  // YouTube is a SPA, so watch for navigation and dynamic video loads
  const observer = new MutationObserver(() => {
    const video = document.querySelector("video");
    if (video) setup(video);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial setup
  setup(document.querySelector("video"));
})();
