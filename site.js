const icons = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="m22 6-10 7L2 6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/></svg>',
  database: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h8l-1 8 11-14h-8l1-6Z"/></svg>'
};

document.querySelectorAll("[data-icon]").forEach((el) => {
  const name = el.getAttribute("data-icon");
  if (icons[name]) el.innerHTML = icons[name] + el.innerHTML;
});

const menuButton = document.querySelector("[data-menu]");
if (menuButton) {
  menuButton.innerHTML = icons.menu;
  menuButton.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", document.body.classList.contains("menu-open"));
  });
}

function updateScrolledState() {
  document.body.classList.toggle("has-scrolled", window.scrollY > 240);
}
updateScrolledState();
window.addEventListener("scroll", updateScrolledState, { passive: true });

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("menu-open"));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

document.querySelectorAll(".plan-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.getAttribute("data-count"));
  let started = false;
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    const start = performance.now();
    const duration = 900;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    obs.disconnect();
  });
  obs.observe(el);
});

const form = document.querySelector("[data-contact-form]");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const button = form.querySelector("button[type='submit']");
    const data = Object.fromEntries(new FormData(form));
    status.textContent = "Sending request...";
    status.className = "form-status";
    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      status.textContent = "Thanks. Your request was submitted to Orbit AI.";
      status.className = "form-status success";
    } catch (error) {
      status.textContent = "Something went wrong. Please try again or contact Orbit AI directly.";
      status.className = "form-status error";
    } finally {
      button.disabled = false;
    }
  });
}

const canvas = document.querySelector(".mesh-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const points = [];
  let width;
  let height;
  let frame;

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    points.length = 0;
    const total = Math.min(80, Math.max(34, Math.floor(window.innerWidth / 18)));
    for (let i = 0; i < total; i += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32 * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.32 * window.devicePixelRatio
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    points.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(7, 92, 255, 0.28)";
      ctx.fill();
      for (let j = index + 1; j < points.length; j += 1) {
        const other = points[j];
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 * window.devicePixelRatio) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(19, 200, 255, ${0.16 - dist / (150 * window.devicePixelRatio) * 0.12})`;
          ctx.lineWidth = 1 * window.devicePixelRatio;
          ctx.stroke();
        }
      }
    });
    frame = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(frame);
    resize();
    draw();
  });
}
