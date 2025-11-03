lucide.createIcons();

// Sticky header on scroll
const header = document.getElementById("header");
window.onscroll = function () {
  if (window.pageYOffset > 50) {
    header.classList.add("glass-effect", "shadow-lg");
  } else {
    header.classList.remove("glass-effect", "shadow-lg");
  }
};

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

const toggleMenu = () => {
  mobileMenu.classList.toggle("hidden");
};

mobileMenuButton.addEventListener("click", toggleMenu);
mobileLinks.forEach((link) => {
  link.addEventListener("click", toggleMenu);
});

// Typing Effect
document.addEventListener("DOMContentLoaded", function () {
  var options = {
    strings: [
      "Frontend Developer",
      "Tech Enthusiast",
      "AI/ML Explorer",
      "Creative Coder",
    ],
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 1500,
    loop: true,
  };
  // Ensure the element exists before initializing
  if (document.getElementById("typing-effect")) {
    var typed = new Typed("#typing-effect", options);
  }
});

// Contact Form Handler
const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-button");
const formResult = document.getElementById("form-result");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // --- IMPORTANT ---
  // Replace "YOUR_ACCESS_KEY_HERE" with your actual key from Web3Forms.
  const accessKey = "here";
  if (accessKey === "YOUR_ACCESS_KEY_HERE") {
    formResult.innerText =
      "Please replace YOUR_ACCESS_KEY_HERE in the script.";
    formResult.classList.add("text-red-400");
    return;
  }

  const formData = new FormData(contactForm);
  formData.append("access_key", accessKey);

  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  const originalButtonText = submitButton.innerText;
  submitButton.innerText = "Sending...";
  submitButton.disabled = true;
  formResult.innerText = "";
  formResult.classList.remove("text-green-400", "text-red-400");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    });
    const result = await response.json();

    if (result.success) {
      formResult.innerText = "Message sent successfully!";
      formResult.classList.add("text-green-400");
      contactForm.reset();
    } else {
      formResult.innerText = result.message || "An error occurred.";
      formResult.classList.add("text-red-400");
    }
  } catch (error) {
    formResult.innerText = "Oops! Something went wrong.";
    formResult.classList.add("text-red-400");
  } finally {
    submitButton.innerText = originalButtonText;
    submitButton.disabled = false;
  }
});

// Particle Animation
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particlesArray;

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setupCanvas();

const mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10)
        this.x += 3;
      if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10)
        this.y += 3;
      if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  // Use fewer particles on smaller screens
  let numberOfParticles = (canvas.height * canvas.width) / (window.innerWidth < 768 ? 20000 : 9000);
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (innerWidth - size * 2) + size;
    let y = Math.random() * (innerHeight - size * 2) + size;
    let directionX = Math.random() * 0.4 - 0.2;
    let directionY = Math.random() * 0.4 - 0.2;
    let color = "rgba(156, 163, 175, 0.8)";
    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
        Math.pow(particlesArray[a].y - particlesArray[b].y, 2);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        ctx.strokeStyle = `rgba(107, 114, 128, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

window.addEventListener("resize", () => {
  setupCanvas();
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  init();
});

window.addEventListener("mouseout", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);
revealElements.forEach((elem) => revealObserver.observe(elem));

// Tabs Logic
const tabs = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".skills-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabTarget = tab.getAttribute("data-tab");
    tabs.forEach((item) => item.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`${tabTarget}-panel`).classList.add("active");
  });
});

