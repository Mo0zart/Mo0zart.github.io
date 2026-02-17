/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Universal Loader
   */
  async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    const promises = Array.from(includes).map(async (el) => {
      const file = el.getAttribute('data-include');
      try {
        const response = await fetch(file);
        if (response.ok) {
          const content = await response.text();
          // Create a wrapper to parse the HTML and get siblings
          const wrapper = document.createElement('div');
          wrapper.innerHTML = content;

          // Replace the placeholder with the content siblings
          el.replaceWith(...wrapper.childNodes);
        } else {
          console.error(`Failed to load ${file}: ${response.statusText}`);
        }
      } catch (err) {
        console.error(`Error loading ${file}:`, err);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Initialize all modules
   */
  function initModules() {
    /**
     * Header toggle
     */
    const headerToggleBtn = document.querySelector('.header-toggle');
    if (headerToggleBtn) {
      function headerToggle() {
        document.querySelector('#header').classList.toggle('header-show');
        headerToggleBtn.classList.toggle('bi-list');
        headerToggleBtn.classList.toggle('bi-x');
      }
      headerToggleBtn.addEventListener('click', headerToggle);

      /**
       * Hide mobile nav on same-page/hash links
       */
      document.querySelectorAll('#navmenu a').forEach(navmenu => {
        navmenu.addEventListener('click', () => {
          if (document.querySelector('.header-show')) {
            headerToggle();
          }
        });
      });
    }

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      preloader.remove();
    }

    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector('.scroll-top');
    function toggleScrollTop() {
      if (scrollTop) {
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
          mainContainer.scrollTop > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
      }
    }

    if (scrollTop) {
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
          mainContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
      window.addEventListener('load', toggleScrollTop);
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.addEventListener('scroll', toggleScrollTop);
      }
    }

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
      }
    }
    aosInit();

    /**
     * Init typed.js
     */
    const selectTyped = document.querySelector('.typed');
    if (selectTyped && typeof Typed !== 'undefined') {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 1500
      });
    }

    /**
     * Hero Details Reveal
     */
    const heroDetails = document.querySelector('.hero-details');
    if (heroDetails) {
      setTimeout(() => {
        heroDetails.classList.add('show');
      }, 2000);
    }

    /**
     * Hero Interactive Particle Effect (Three.js)
     */
    /**
     * Interactive Particle Effect (Three.js) - Reusable
     */
    function initParticles(canvasId, containerSelector) {
      const canvas = document.querySelector(canvasId);
      if (!canvas) {
        // console.warn(`${canvasId} not found`);
        return;
      }
      if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded.');
        return;
      }

      const container = document.querySelector(containerSelector);
      if (!container) return; // Should exist if canvas exists usually

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Match scene setup
      const scene = new THREE.Scene();
      // Adjust camera distance based on container size? For now, keep it generic.
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 2000);
      camera.position.z = 500;

      const particlesCount = 300; // Slightly fewer for potential multiple instances
      const positions = new Float32Array(particlesCount * 3);
      const velocities = new Float32Array(particlesCount * 3);
      const originalPositions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1500;
        positions[i + 1] = (Math.random() - 0.5) * 1500;
        positions[i + 2] = (Math.random() - 0.5) * 1500;

        originalPositions[i] = positions[i];
        originalPositions[i + 1] = positions[i + 1];
        originalPositions[i + 2] = positions[i + 2];

        velocities[i] = (Math.random() - 0.5) * 0.05;
        velocities[i + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i + 2] = (Math.random() - 0.5) * 0.05;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Glow Texture
      const getGlowTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(124, 58, 237, 1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

      const material = new THREE.PointsMaterial({
        color: 0x7c3aed,
        size: 7.0,
        map: getGlowTexture(),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Blur Fog
      const blurGeo = new THREE.PlaneGeometry(2000, 2000);
      const blurCanvas = document.createElement('canvas');
      blurCanvas.width = 128; blurCanvas.height = 128;
      const ctx = blurCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(124, 58, 237, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const blurTex = new THREE.CanvasTexture(blurCanvas);
      const blurMat = new THREE.MeshBasicMaterial({
        map: blurTex, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending
      });
      const blurMesh = new THREE.Mesh(blurGeo, blurMat);
      blurMesh.position.z = 100;
      scene.add(blurMesh);

      // Mouse
      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      });

      function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width && height) {
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }

      window.addEventListener('resize', resize);
      // Create a ResizeObserver to handle container size changes cleanly
      const resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(container);

      // Initial resize
      setTimeout(resize, 100);

      function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.08;
        targetY += (mouseY - targetY) * 0.08;

        const pos = geometry.attributes.position.array;
        const time = Date.now() * 0.0005;

        // Blur movement
        blurMesh.position.x = Math.sin(time) * 200;
        blurMesh.position.y = Math.cos(time * 0.8) * 150;

        for (let i = 0; i < particlesCount; i++) {
          const i3 = i * 3;
          // Float
          pos[i3] += velocities[i3] * 0.15;
          pos[i3 + 1] += velocities[i3 + 1] * 0.15;

          // Mouse Repulsion
          const dx = pos[i3] - (targetX * 500);
          const dy = pos[i3 + 1] - (targetY * 400);
          const distSq = dx * dx + dy * dy;
          const limit = 250 * 250;

          if (distSq < limit) {
            const dist = Math.sqrt(distSq);
            const force = (250 - dist) / 250;
            pos[i3] += dx * force * 0.15;
            pos[i3 + 1] += dy * force * 0.15;
          }

          // Return force
          pos[i3] += (originalPositions[i3] - pos[i3]) * 0.003;
          pos[i3 + 1] += (originalPositions[i3 + 1] - pos[i3 + 1]) * 0.003;
        }

        geometry.attributes.position.needsUpdate = true;
        points.rotation.y += 0.0002;
        points.rotation.x += 0.0001;

        renderer.render(scene, camera);
      }

      animate();
    }

    // Init Hero and Resume Particles
    initParticles('#hero-canvas', '#hero');
    initParticles('#resume-canvas', '#resume');

    /**
     * Initiate Pure Counter
     */
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }

    /**
     * Animate the skills items on reveal
     */
    let skillsAnimation = document.querySelectorAll('.skills-animation');
    skillsAnimation.forEach((item) => {
      if (typeof Waypoint !== 'undefined') {
        new Waypoint({
          element: item,
          offset: '80%',
          handler: function (direction) {
            let progress = item.querySelectorAll('.progress .progress-bar');
            progress.forEach(el => {
              el.style.width = el.getAttribute('aria-valuenow') + '%';
            });
          }
        });
      }
    });

    /**
     * Initiate glightbox
     */
    if (typeof GLightbox !== 'undefined') {
      const glightbox = GLightbox({
        selector: '.glightbox'
      });
    }

    /**
     * Init isotope layout and filters
     */
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      if (typeof Isotope === 'undefined') return;

      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      const container = isotopeItem.querySelector('.isotope-container');
      if (container && typeof imagesLoaded !== 'undefined') {
        imagesLoaded(container, function () {
          initIsotope = new Isotope(container, {
            itemSelector: '.isotope-item',
            layoutMode: 'fitRows',
            filter: filter,
            sortBy: sort
          });
        });
      }

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
        filters.addEventListener('click', function () {
          const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
          if (activeFilter) activeFilter.classList.remove('filter-active');
          this.classList.add('filter-active');
          if (initIsotope) {
            initIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
          }
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        }, false);
      });
    });

    /**
     * Init swiper sliders
     */
    function initSwiper() {
      if (typeof Swiper === 'undefined') return;

      // 1. First, initialize all potential thumbnail swipers
      document.querySelectorAll(".init-swiper-thumbs").forEach(function (thumbsElement) {
        try {
          const configScript = thumbsElement.querySelector(".swiper-config");
          if (configScript) {
            let config = JSON.parse(configScript.innerHTML.trim());
            new Swiper(thumbsElement, config);
          }
        } catch (e) {
          console.warn('Failed to init thumbnail swiper:', e);
        }
      });

      // 2. Then, initialize main swipers
      document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
        try {
          const configScript = swiperElement.querySelector(".swiper-config");
          if (configScript) {
            let config = JSON.parse(configScript.innerHTML.trim());

            // Check for thumbnails
            const thumbsSelector = swiperElement.getAttribute('data-thumbs');
            if (thumbsSelector) {
              const thumbsElement = document.querySelector(thumbsSelector);
              if (thumbsElement && thumbsElement.swiper) {
                config.thumbs = { swiper: thumbsElement.swiper };
              }
            }

            // Video playback logic (only if the slider has videos)
            config.on = {
              slideChange: function () {
                const sendCommand = (iframe, command) => {
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(JSON.stringify({
                      event: 'command', func: command, args: []
                    }), '*');
                  }
                };

                // Pause videos in all slides
                this.slides.forEach(slide => {
                  const iframe = slide.querySelector('iframe.scroll-video');
                  if (iframe) sendCommand(iframe, 'pauseVideo');
                });

                // Play video in active slide
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                  const activeIframe = activeSlide.querySelector('iframe.scroll-video');
                  if (activeIframe) sendCommand(activeIframe, 'playVideo');
                }
              }
            };

            new Swiper(swiperElement, config);
          }
        } catch (e) {
          console.warn('Failed to init main swiper:', e);
        }
      });
    }
    initSwiper();

    /**
     * Page Switcher Logic
     */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navmenu a');

    const pages = {
      '#hero': ['#hero'],
      '#resume': ['#resume'],
      '#portfolio': ['#portfolio'],
      '#blades-of-babel': ['#blades-of-babel-section'],
      '#luna': ['#luna-section'],
      '#scool': ['#scool'],
      '#for-the-unmasked': ['#for-the-unmasked-section'],
      '#services': ['#services', '#testimonials'],
      '#contact': ['#contact']
    };

    function switchPage(hash) {
      const targetId = hash || '#hero';
      let activePageId = '#hero';

      for (const pageId in pages) {
        if (pageId === targetId || pages[pageId].includes(targetId)) {
          activePageId = pageId;
          break;
        }
      }

      sections.forEach(section => {
        section.classList.remove('section-active');
      });

      const sectionsToShow = pages[activePageId] || [activePageId];
      sectionsToShow.forEach(id => {
        const el = document.querySelector(id);
        if (el) el.classList.add('section-active');
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const parentLi = link.closest('li');
        const dropdownUl = parentLi ? parentLi.querySelector('ul') : null;

        // Highlight active page
        if (link.hash === activePageId) {
          link.classList.add('active');
          // If we are on a project page, ensure the parent dropdown is open
          if (activePageId.startsWith('#blades-of-babel') || activePageId.startsWith('#luna') || activePageId.startsWith('#scool') || activePageId.startsWith('#for-the-unmasked')) {
            const dropdownParent = document.querySelector('.navmenu .dropdown');
            if (dropdownParent) {
              dropdownParent.classList.add('active');
              const subUl = dropdownParent.querySelector('ul');
              if (subUl) subUl.classList.add('dropdown-active');
            }
          }
        }

        // Highlight parent Portfolio if it's a project sub-page
        if ((activePageId.startsWith('#blades-of-babel') || activePageId.startsWith('#luna') || activePageId.startsWith('#scool') || activePageId.startsWith('#for-the-unmasked')) && link.hash.includes('#portfolio')) {
          link.classList.add('active');
        }
      });

      const mainContainer = document.querySelector('main');
      if (mainContainer) mainContainer.scrollTop = 0;

      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }

      // Refresh Isotope and Swiper layouts
      setTimeout(() => {
        if (typeof Isotope !== 'undefined') {
          document.querySelectorAll('.isotope-layout .isotope-container').forEach(container => {
            const iso = Isotope.data(container);
            if (iso) {
              iso.layout();
            }
          });
        }

        if (typeof Swiper !== 'undefined') {
          document.querySelectorAll('.init-swiper').forEach(swiperElement => {
            if (swiperElement.swiper) {
              swiperElement.swiper.update();
            }
          });
        }

        // Handle videos after page switch
        handleScrollVideos();
      }, 100);

      if (window.location.hash !== targetId) {
        history.pushState(null, null, targetId);
      }
    }

    /**
     * Scroll-to-Play Video Logic (YouTube & Native)
     */
    const handleScrollVideos = () => {
      // 1. Handle Native HTML5 Videos
      const nativeVideos = document.querySelectorAll('video.scroll-video');
      const nativeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => { });
          } else {
            entry.target.pause();
          }
        });
      }, { threshold: 0.1 });
      nativeVideos.forEach(v => nativeObserver.observe(v));

      // 2. Handle YouTube IFrames (using postMessage API)
      const ytIframes = document.querySelectorAll('iframe.scroll-video');
      const ytObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const iframe = entry.target;
          const command = entry.isIntersecting ? 'playVideo' : 'pauseVideo';
          iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: command,
            args: []
          }), '*');
        });
      }, { threshold: 0.2 });
      ytIframes.forEach(f => ytObserver.observe(f));
    };

    // Initialize for currently loaded sections
    handleScrollVideos();

    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        // Only prevent default if we're on the main page (SPA mode)
        const isHomePage = window.location.pathname.endsWith('index.html') ||
          window.location.pathname === '/' ||
          window.location.pathname.endsWith('/') ||
          !window.location.pathname.includes('.html');

        if (this.hash && (document.querySelector(this.hash) || pages[this.hash])) {
          if (isHomePage) {
            e.preventDefault();
            switchPage(this.hash);
            if (document.querySelector('.header-show')) {
              const headerToggleBtn = document.querySelector('.header-toggle');
              if (headerToggleBtn) headerToggleBtn.click();
            }
          }
        }
      });
    });

    window.addEventListener('hashchange', () => {
      switchPage(window.location.hash);
    });

    // Initial switch
    switchPage(window.location.hash);
  }

  /**
   * Hero Button Particle Effect
   */
  function initHeroButtonParticles() {
    const btn = document.querySelector('.btn-hero');
    if (!btn) return;

    let particleInterval;

    function createParticle() {
      const particle = document.createElement('span');
      particle.classList.add('btn-particle');

      const size = Math.random() * 4 + 2; // 2px to 6px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random start position within the button
      const rect = btn.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Calculate random direction (flying out)
      // We want them to generally fly up and out or in random directions
      const tx = (Math.random() - 0.5) * 100; // -50px to 50px horizontal
      const ty = (Math.random() - 1) * 100;   // -100px to 0px vertical (mostly up)

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      // Random color (White or Light Purple)
      const colors = ['rgba(255, 255, 255, 0.8)', 'rgba(200, 160, 255, 0.8)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      btn.appendChild(particle);

      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }

    btn.addEventListener('mouseenter', () => {
      // Create particles rapidly
      particleInterval = setInterval(createParticle, 50);
    });

    btn.addEventListener('mouseleave', () => {
      clearInterval(particleInterval);
      // Clean up any remaining particles after a delay? 
      // No, let them finish their animation.
    });
  }

  // Load everything then initialize
  window.addEventListener('DOMContentLoaded', async () => {
    await loadIncludes();
    initModules();
    // Add particle effect to hero button after modules (and DOM content) are ready
    initHeroButtonParticles();
  });

})();