(() => {
  /* ========== CUSTOM CURSOR ========== */
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    let mouseX = 0,
      mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      cursor.style.left = `${mouseX - 10}px`;
      cursor.style.top = `${mouseY - 10}px`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover states
    document
      .querySelectorAll("a, button, .skill-card, .project-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("hover")
        );
      });
  }

  /* ========== THREE.JS BACKGROUND ========== */
  function initThree() {
    const container = document.getElementById("three-container");
    if (!container || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Store animation frame ID for cleanup
    let animationId;

    // Particle geometry
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
      vertices.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 2,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 500;

    function animate() {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    window.addEventListener("beforeunload", () => {
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    });
  }
  initThree();

  /* ========== SECTION REVEAL ON SCROLL ========== */
  const sections = document.querySelectorAll(".section");
  function revealSections() {
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight - 100) {
        section.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", revealSections);
  revealSections();

  /* ========== SCROLL PROGRESS BAR ========== */
  const scrollProgress = document.querySelector(".scroll-progress");
  if (scrollProgress) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    });
  }

  /* ========== MATRIX RAIN EFFECT ========== */
  const matrixCanvas = document.querySelector(".matrix-bg");
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext("2d");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    let columns = Math.floor(matrixCanvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function resizeCanvas() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      columns = Math.floor(matrixCanvas.width / fontSize);
      drops = Array(columns).fill(1);
    }
    resizeCanvas();

    function drawMatrix() {
      ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#00ff88";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (
          drops[i] * fontSize > matrixCanvas.height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    window.addEventListener("resize", resizeCanvas);
  }

  /* ========== FLOATING PARTICLES ========== */
  const particlesDiv = document.querySelector(".particles");
  if (particlesDiv) {
    for (let i = 0; i < 80; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
      particlesDiv.appendChild(particle);
    }
  }

  /* ========== TERMINAL EASTER EGG ========== */
  const terminalOutput = document.getElementById("terminal-output");
  const terminalForm = document.getElementById("terminal-form");
  const terminalInput = document.getElementById("terminal-input");
  const history = [];

  function printTerminal(text, color = "#cccccc") {
    terminalOutput.innerHTML += `<div style='color:${color}'>${text}</div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleCommand(cmd) {
    const command = cmd.trim().toLowerCase();
    switch (command) {
      case "help":
        printTerminal(
          'Available commands: <span style="color:#00ff88">help</span>, <span style="color:#00ff88">skills</span>, <span style="color:#00ff88">contact</span>, <span style="color:#00ff88">clear</span>, <span style="color:#00ff88">sudo hire_francis</span>'
        );
        break;
      case "skills":
        printTerminal(
          "Skills: Frontend (React, Vue, Next.js, Three.js), Backend (Node.js, Python, GraphQL), AI (TensorFlow, LLMs), Blockchain (Solidity, Web3.js), Cloud (AWS, Docker), Creative Tech (AR/VR, Motion Graphics)"
        );
        break;
      case "contact":
        printTerminal(
          'Contact: <span style="color:#00ff88">francismule300@gmail.com</span> | <span style="color:#00ff88">@francismule-dev</span> (LinkedIn) | <span style="color:#00ff88">@francmul</span> (GitHub) | <span style="color:#00ff88">@francmul</span> (Twitter)'
        );
        break;
      case "clear":
        terminalOutput.innerHTML = "";
        break;
      case "sudo hire_francis":
        printTerminal(
          '<span style="color:#00ff88">Access Granted: Let’s build something extraordinary 🚀.</span>'
        );
        break;
      case "":
        break;
      default:
        printTerminal(
          `Command not found: <span style='color:#ff0080'>${cmd}</span>`
        );
    }
  }

  if (terminalForm && terminalInput && terminalOutput) {
    terminalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = terminalInput.value;
      printTerminal(
        `<span style='color:#00ff88'>francismule300@gmail.com:~$</span> ${value}`
      );
      handleCommand(value);
      history.push(value);
      terminalInput.value = "";
    });

    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && history.length > 0) {
        terminalInput.value = history[history.length - 1];
      }
    });

    // Autofocus input when clicking anywhere in the terminal area
    const terminalContent = terminalForm.parentElement;
    if (terminalContent) {
      terminalContent.addEventListener("click", () => {
        terminalInput.focus();
      });
    }

    // Boot message
    printTerminal(
      'Type <span style="color:#00ff88">help</span> for a list of commands.'
    );
  }

  /* ========== MOBILE NAVIGATION (needs cleanup) ========== */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      navToggle.classList.toggle("active");
    });

    // Close menu on link click
    navMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
      })
    );
  }

  /* ========== MOBILE NAV HAMBURGER LOGIC ========== */
  const navHamburger = document.getElementById("nav-hamburger");
  const navMobileOverlay = document.getElementById("nav-mobile-overlay");
  if (navHamburger && navMobileOverlay) {
    navHamburger.addEventListener("click", () => {
      navMobileOverlay.classList.toggle("active");
      navHamburger.classList.toggle("active");
    });
    navMobileOverlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMobileOverlay.classList.remove("active");
        navHamburger.classList.remove("active");
      });
    });
    document.addEventListener("click", (e) => {
      if (
        navMobileOverlay.classList.contains("active") &&
        !navMobileOverlay.contains(e.target) &&
        e.target !== navHamburger
      ) {
        navMobileOverlay.classList.remove("active");
        navHamburger.classList.remove("active");
      }
    });
  }
})();
