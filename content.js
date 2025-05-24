// YouTube Pause Auto-Hide: Make controls auto-hide on pause like on play

(function() {
    let hideTimeout = null;
    let lastVideo = null;

    console.log("YouTube Pause Auto-Hide loaded");
  
    function injectCSS() {
      if (document.getElementById('ypah-style')) return;
      const style = document.createElement('style');
      style.id = 'ypah-style';
      style.textContent = `
        .ypah-hide {
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          transition: opacity 0s !important;
        }
      `;
      document.head.appendChild(style);
    }

    function hideControls() {
      const controls = document.querySelector('.ytp-chrome-bottom');
      const gradient = document.querySelector('.ytp-gradient-bottom');
      if (controls) controls.classList.add('ypah-hide');
      if (gradient) gradient.classList.add('ypah-hide');
    }

    function showControls() {
      const controls = document.querySelector('.ytp-chrome-bottom');
      const gradient = document.querySelector('.ytp-gradient-bottom');
      if (controls) controls.classList.remove('ypah-hide');
      if (gradient) gradient.classList.remove('ypah-hide');
    }
  
    function setup(video) {
      if (!video) return;
      if (lastVideo === video) return; // Already set up

      lastVideo = video;
      injectCSS();

      // Get the main player area
      const player = document.querySelector('.html5-video-player');
      if (!player) return;

      // Remove any previous listeners
      player.removeEventListener('mouseenter', showControls);
      player.removeEventListener('mouseleave', hideControls);

      // Add listeners for instant show/hide
      player.addEventListener('mouseenter', showControls);
      player.addEventListener('mouseleave', hideControls);

      // Initial state: hide if mouse is not over player
      if (!player.matches(':hover')) {
        hideControls();
      } else {
        showControls();
      }
    }
  
    // YouTube is SPA, so watch for navigation
    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      if (video) setup(video);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Initial setup
    setup(document.querySelector('video'));
  })();