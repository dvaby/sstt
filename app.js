/* ==========================================================================
   KONFIGURASI MUDAH UNTUK KAMU EDIT SENDIRI (FOTO, VIDEO & TEKS 6 MOMEN)
   --------------------------------------------------------------------------
   1. Taruh foto (.jpg/.png) atau video pendek (.mp4/.webm) di folder "images/":
      Contoh: foto1.jpg, foto2.mp4, foto3.jpg, dst.
      (Cukup tulis nama filenya pada bagian `image:` di bawah ini)
   2. Ubah judul, tanggal, dan cerita di tiap momen sesuai kenangan kalian.
========================================================================== */
const SECRET_CODE = "060307";

const MEMORIES_DATA = [
  {
    tag: "Chapter 01",
    title: "Awal Kita Bertemu ✨",
    date: "Jujur ga ekspek yeah ketemu disini",
    image: "images/foto1.jpg",
    story: "jujur ini bukan pertama kita ketemu tapi FOTO PERTAMA KITAAA AMBILL XIXIXIXI ternyata sekarang jadi pacarkuu yeahh",
    tilt: "-2deg",
    fallbackEmoji: "🌸"
  },
  {
    tag: "Chapter 02",
    title: "Konser Dewa💜",
    date: "INII PASS KITAA KONSERR PERTAMA KALII",
    image: "images/foto2.jpg",
    story: "walaupun kamu gatau lagi dewa kamu tetep masih mau nontonnnn rispekkkkkk.",
    tilt: "1.8deg",
    fallbackEmoji: "🏋️‍♀️"
  },
  {
    tag: "Chapter 03",
    title: "INII PERTAMA KALII KITAA TOURINGGGG 🧸",
    date: "Jujurrr seruu banget apalagii samaa kamuuuu",
    image: "images/foto3.jpg",
    story: "jujur pas kita ke gunung ini dadakan banget yeah tapi gapap touringg bossqueee.",
    tilt: "-1.8deg",
    fallbackEmoji: "📸"
  },
  {
    tag: "Chapter 04",
    title: "Coffee Shop Bareng ☕🍑",
    date: "Cerita Panjang & Tawa Kita",
    image: "images/foto4.mp4",
    story: "Duduk berdua, ngopi santai, cerita tentang banyak hal sampai lupa waktu. Momen-momen kecil kayak gini yang selalu bikin aku kangen.",
    tilt: "-1.5deg",
    fallbackEmoji: "🧋"
  },
  {
    tag: "Chapter 05",
    title: "Berenang Bareng 🏊‍♀️💦",
    date: "Seru-Seruan Tanpa Beban",
    image: "images/foto5.mp4",
    story: "Salah satu hari paling seru bareng kamu! Ketawa bareng, main air di pantaiiiii, dan lihat kamu senengg neglihatt pantaii jadii tambah jaknfjebhfojsfn.",
    tilt: "2deg",
    fallbackEmoji: "🌊"
  },
  {
    tag: "Chapter 06",
    title: "Terus Melangkah Bersama 💖",
    date: "inii pass saat kepantaii",
    image: "images/foto6.jpg",
    story: "Makasih udah bertahan, berjuang, dan tetap semangat sejauh ini, Vhenix. Masih banyak banget mimpi dan tempat seru yang mau aku tuju bareng kamu.",
    tilt: "1.5deg",
    fallbackEmoji: "🌈"
  }
];

/* ==========================================================================
   HELPER: PLACEHOLDER POLAROID OTOMATIS JIKA FOTO BELUM DIISI
========================================================================== */
function buildCuteFallbackDataUri(label, emoji) {
  const safeLabel = String(label || "Foto Kita").replace(/[<>&"']/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffd8be"/>
          <stop offset="55%" stop-color="#ffe8f0"/>
          <stop offset="100%" stop-color="#dfd0ff"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#g)"/>
      <circle cx="110" cy="90" r="48" fill="#ffffff" opacity="0.45"/>
      <circle cx="500" cy="360" r="64" fill="#ffffff" opacity="0.4"/>
      <text x="300" y="205" font-size="76" text-anchor="middle">${emoji || "💖"}</text>
      <text x="300" y="275" font-family="sans-serif" font-size="24" font-weight="700" fill="#4a3763" text-anchor="middle">${safeLabel}</text>
      <text x="300" y="312" font-family="sans-serif" font-size="16" fill="#76638f" text-anchor="middle">Taruh foto/video kalian di folder images/</text>
    </svg>
  `;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}

function isVideoFile(src) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(String(src || ""));
}

let wasMusicPausedByVideo = false;

function pauseAllPolaroidVideos(exceptVideo = null) {
  document.querySelectorAll(".polaroid-video").forEach((vid) => {
    if (vid !== exceptVideo) {
      vid.muted = true;
      const btn = vid.parentElement?.querySelector(".video-sound-btn");
      if (btn) {
        btn.textContent = "🔇";
        btn.classList.remove("unmuted");
      }
    }
  });
}

function resumeMusicIfPausedByVideo() {
  if (wasMusicPausedByVideo && isMusicPlaying) {
    wasMusicPausedByVideo = false;
    if (useCustomAudio) {
      customBgm.play().catch(() => startSynthMusic());
    } else {
      startSynthMusic();
    }
  }
}

/* ==========================================================================
   1. SISTEM PARTIKEL LEDAKAN LOVE & SPARKLES (OPTIMIZED 60 FPS)
========================================================================== */
const canvas = document.getElementById("loveCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
let particles = [];
let animFrameId = null;

const MAX_PARTICLES = 130;
const LOVE_SYMBOLS = ["❤", "💖", "💜", "💕", "✨", "🌸"];

// Pre-render setiap simbol ke offscreen canvas sekali saja (jauh lebih ringan dari fillText)
const SPRITE_SIZE = 64;
const SYMBOL_SPRITES = LOVE_SYMBOLS.map((symbol) => {
  const offscreen = document.createElement("canvas");
  offscreen.width = SPRITE_SIZE;
  offscreen.height = SPRITE_SIZE;
  const oCtx = offscreen.getContext("2d");
  oCtx.font = `44px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  oCtx.textAlign = "center";
  oCtx.textBaseline = "middle";
  oCtx.fillText(symbol, SPRITE_SIZE / 2, SPRITE_SIZE / 2 + 2);
  return offscreen;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawnLoveBurst(originX, originY, count = 55) {
  const scaledCount = Math.min(count, 60);

  if (particles.length + scaledCount > MAX_PARTICLES) {
    particles.splice(0, particles.length + scaledCount - MAX_PARTICLES);
  }

  for (let i = 0; i < scaledCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3.2 + Math.random() * 10.5;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.6,
      gravity: 0.18 + Math.random() * 0.08,
      drag: 0.96,
      size: 18 + Math.random() * 18,
      rotation: (Math.random() - 0.5) * 0.7,
      vRot: (Math.random() - 0.5) * 0.07,
      alpha: 1,
      decay: 0.016 + Math.random() * 0.01,
      sprite: SYMBOL_SPRITES[Math.floor(Math.random() * SYMBOL_SPRITES.length)]
    });
  }

  if (!animFrameId) {
    animFrameId = requestAnimationFrame(animateParticles);
  }
}

function triggerMassiveLoveExplosion() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  spawnLoveBurst(w * 0.5, h * 0.48, 55);
  setTimeout(() => spawnLoveBurst(w * 0.25, h * 0.35, 35), 160);
  setTimeout(() => spawnLoveBurst(w * 0.75, h * 0.35, 35), 300);
}

function animateParticles() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vRot;
    p.alpha -= p.decay;

    if (p.alpha <= 0.02 || p.y > canvas.height + 40) {
      particles.splice(i, 1);
      continue;
    }

    const cos = Math.cos(p.rotation);
    const sin = Math.sin(p.rotation);
    const half = p.size * 0.5;

    ctx.globalAlpha = p.alpha;
    ctx.setTransform(cos, sin, -sin, cos, p.x, p.y);
    ctx.drawImage(p.sprite, -half, -half, p.size, p.size);
  }

  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(animateParticles);
  } else {
    animFrameId = null;
  }
}

/* ==========================================================================
   2. MUSIK LATAR ROMANTIS (CUSTOM MP3 ATAU SYNTHESIZED MUSIC BOX)
========================================================================== */
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");
const customBgm = document.getElementById("customBgm");

let isMusicPlaying = false;
let useCustomAudio = false;
let audioCtx = null;
let melodyTimer = null;
let noteStep = 0;

// Melodi kotak musik lembut (nada-nada hangat & manis)
const MUSIC_BOX_NOTES = [
  523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 659.25, 587.33,
  698.46, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33, 493.88,
  523.25, 659.25, 783.99, 987.77, 1046.50, 1174.66, 1046.50, 783.99,
  698.46, 659.25, 587.33, 523.25, 587.33, 659.25, 523.25, 0
];

function playMusicBoxTone(freq) {
  if (!freq || !audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const subOsc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  subOsc.type = "triangle";
  subOsc.frequency.setValueAtTime(freq * 2, now);

  const subGain = audioCtx.createGain();
  subGain.gain.setValueAtTime(0.015, now);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.075, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

  osc.connect(gain);
  subOsc.connect(subGain);
  subGain.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  subOsc.start(now);
  osc.stop(now + 1.2);
  subOsc.stop(now + 0.8);
}

function startSynthMusic() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  if (melodyTimer) clearInterval(melodyTimer);
  melodyTimer = setInterval(() => {
    if (!isMusicPlaying) return;
    const freq = MUSIC_BOX_NOTES[noteStep % MUSIC_BOX_NOTES.length];
    playMusicBoxTone(freq);
    noteStep++;
  }, 460);
}

function stopSynthMusic() {
  if (melodyTimer) {
    clearInterval(melodyTimer);
    melodyTimer = null;
  }
}

async function startBackgroundMusic() {
  musicToggle.classList.remove("hidden");
  isMusicPlaying = true;
  updateMusicButtonUI();

  // Coba putar music.mp3 terlebih dahulu jika pengguna menaruh file tersebut
  try {
    customBgm.volume = 0.55;
    await customBgm.play();
    useCustomAudio = true;
  } catch (_) {
    useCustomAudio = false;
    startSynthMusic();
  }
}

function updateMusicButtonUI() {
  if (isMusicPlaying) {
    musicToggle.classList.remove("paused");
    musicIcon.textContent = "🎵";
    musicLabel.textContent = "Lagu Kita: ON";
  } else {
    musicToggle.classList.add("paused");
    musicIcon.textContent = "🔇";
    musicLabel.textContent = "Lagu Kita: OFF";
  }
}

musicToggle.addEventListener("click", () => {
  isMusicPlaying = !isMusicPlaying;
  if (isMusicPlaying) {
    pauseAllPolaroidVideos();
    wasMusicPausedByVideo = false;
    if (useCustomAudio) {
      customBgm.play().catch(() => startSynthMusic());
    } else {
      startSynthMusic();
    }
  } else {
    wasMusicPausedByVideo = false;
    if (useCustomAudio) customBgm.pause();
    stopSynthMusic();
  }
  updateMusicButtonUI();
});

/* ==========================================================================
   3. SCREEN 1: PASSCODE GATE (060307)
========================================================================== */
const screenPasscode = document.getElementById("screenPasscode");
const screenWelcome = document.getElementById("screenWelcome");
const screenRecap = document.getElementById("screenRecap");

const passcodeCard = document.getElementById("passcodeCard");
const passcodeHint = document.getElementById("passcodeHint");
const mascotFace = document.getElementById("mascotFace");
const heartDots = Array.from(document.querySelectorAll(".heart-dot"));

let currentPin = "";
let isUnlocking = false;

const WRONG_PIN_MESSAGES = [
  "Eits salah sayang~ Coba inget-inget lagi 🙈",
  "Hayo masa lupa kode rahasia kita sih~ 😜",
  "Clue-nya 6 angka spesial kita berdua lho 💜",
  "Dikit lagi bener! Coba pelan-pelan ya cintaku 🍑"
];
let wrongCount = 0;

function updatePinDisplay() {
  heartDots.forEach((dot, idx) => {
    if (idx < currentPin.length) {
      dot.classList.add("filled");
      dot.textContent = "♥";
    } else {
      dot.classList.remove("filled");
      dot.textContent = "♡";
    }
  });
}

function handleDigitInput(digit) {
  if (isUnlocking || currentPin.length >= 6) return;
  currentPin += digit;
  updatePinDisplay();

  if (currentPin.length === 6) {
    verifyPasscode();
  }
}

function verifyPasscode() {
  if (currentPin === SECRET_CODE) {
    isUnlocking = true;
    mascotFace.classList.add("happy");
    passcodeHint.classList.remove("error-text");
    passcodeHint.textContent = "Yeay bener!! Membuka dunia kecil kita... 💖";

    // Ledakan love + mulai musik latar
    triggerMassiveLoveExplosion();
    startBackgroundMusic();

    setTimeout(() => {
      switchScreen(screenPasscode, screenWelcome);
      spawnLoveBurst(window.innerWidth * 0.5, window.innerHeight * 0.42, 45);
    }, 950);
  } else {
    passcodeCard.classList.remove("shake");
    void passcodeCard.offsetWidth; // trigger reflow
    passcodeCard.classList.add("shake");

    passcodeHint.classList.add("error-text");
    passcodeHint.textContent = WRONG_PIN_MESSAGES[wrongCount % WRONG_PIN_MESSAGES.length];
    wrongCount++;

    setTimeout(() => {
      currentPin = "";
      updatePinDisplay();
    }, 420);
  }
}

document.querySelectorAll(".key-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    const action = btn.dataset.action;

    if (key !== undefined) {
      handleDigitInput(key);
    } else if (action === "clear") {
      currentPin = "";
      updatePinDisplay();
    } else if (action === "back") {
      currentPin = currentPin.slice(0, -1);
      updatePinDisplay();
    }
  });
});

// Dukungan keyboard fisik jika dibuka di laptop
window.addEventListener("keydown", (e) => {
  if (!screenPasscode.classList.contains("screen-active")) return;
  if (/^[0-9]$/.test(e.key)) {
    handleDigitInput(e.key);
  } else if (e.key === "Backspace") {
    currentPin = currentPin.slice(0, -1);
    updatePinDisplay();
  } else if (e.key === "Escape") {
    currentPin = "";
    updatePinDisplay();
  }
});

function switchScreen(fromEl, toEl) {
  fromEl.classList.remove("screen-active");
  fromEl.classList.add("screen-hidden");
  fromEl.setAttribute("aria-hidden", "true");

  toEl.classList.remove("screen-hidden");
  toEl.classList.add("screen-active");
  toEl.setAttribute("aria-hidden", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   4. SCREEN 2: TUMPUKAN POLAROID BACKGROUND + TOMBOL KELUAR KABUR
========================================================================== */
const polaroidPileBg = document.getElementById("polaroidPileBg");

const PILE_POSITIONS = [
  { top: "4%", left: "-4%", rot: "-14deg" },
  { top: "6%", right: "-3%", rot: "12deg" },
  { top: "34%", left: "-6%", rot: "9deg" },
  { top: "36%", right: "-5%", rot: "-11deg" },
  { bottom: "4%", left: "2%", rot: "-8deg" },
  { bottom: "3%", right: "2%", rot: "14deg" }
];

function renderBackgroundPolaroidPile() {
  polaroidPileBg.innerHTML = "";
  MEMORIES_DATA.forEach((item, idx) => {
    const pos = PILE_POSITIONS[idx % PILE_POSITIONS.length];
    const card = document.createElement("div");
    card.className = "bg-polaroid";
    if (pos.top) card.style.top = pos.top;
    if (pos.bottom) card.style.bottom = pos.bottom;
    if (pos.left) card.style.left = pos.left;
    if (pos.right) card.style.right = pos.right;
    card.style.transform = `rotate(${pos.rot})`;

    const mediaSrc = item.media || item.image;
    let mediaEl;
    if (isVideoFile(mediaSrc)) {
      mediaEl = document.createElement("video");
      mediaEl.src = mediaSrc;
      mediaEl.autoplay = true;
      mediaEl.loop = true;
      mediaEl.muted = true;
      mediaEl.playsInline = true;
      mediaEl.preload = "metadata";
      mediaEl.onerror = () => {
        const fallbackImg = document.createElement("img");
        fallbackImg.src = buildCuteFallbackDataUri(item.title, item.fallbackEmoji);
        fallbackImg.alt = item.title;
        mediaEl.replaceWith(fallbackImg);
      };
    } else {
      mediaEl = document.createElement("img");
      mediaEl.src = mediaSrc;
      mediaEl.alt = item.title;
      mediaEl.onerror = () => {
        mediaEl.onerror = null;
        mediaEl.src = buildCuteFallbackDataUri(item.title, item.fallbackEmoji);
      };
    }

    const caption = document.createElement("span");
    caption.textContent = item.title;

    card.appendChild(mediaEl);
    card.appendChild(caption);
    polaroidPileBg.appendChild(card);
  });
}

const choiceStage = document.getElementById("choiceStage");
const btnEnter = document.getElementById("btnEnter");
const btnRunaway = document.getElementById("btnRunaway");
const runawaySpeech = document.getElementById("runawaySpeech");

const RUNAWAY_PROMPTS = [
  "Eits yakin kamu mau keluar? 🥺",
  "Yakin kamu? Gak kangen aku emangnya? 😜",
  "Hayo mau ke mana~ gak bisa keluar lho! 🏃💨",
  "Beneran yakin mau pencet keluar? Aku sedih lho 🥹",
  "Ups meleset! Pencet tombol Masuk aja sayang 💕",
  "Tombol keluarnya lagi mogok khusus buat Vhenix 🤭",
  "Yakin? Padahal di dalam ada kenangan kita lho ✨",
  "Wleee gak kena! Coba lagi kalau bisa 😝",
  "Udah deh nyerah aja, pencet Masuk ya cintaku 💖"
];

let escapeCount = 0;
let enterScale = 1;

function moveRunawayButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Pindahkan tombol Keluar keluar dari kartu agar bebas lari ke seluruh layar
  if (btnRunaway.parentElement !== screenWelcome) {
    const initialRect = btnRunaway.getBoundingClientRect();
    screenWelcome.appendChild(btnRunaway);
    btnRunaway.style.position = "fixed";
    btnRunaway.style.left = `${initialRect.left}px`;
    btnRunaway.style.top = `${initialRect.top}px`;
    void btnRunaway.offsetWidth;
  }

  const enterRect = btnEnter.getBoundingClientRect();
  const exitRect = btnRunaway.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const padX = 18;
  const padTop = 68; // Sisakan ruang untuk tombol musik di pojok kanan atas
  const padBottom = 24;
  const maxLeft = Math.max(padX, vw - exitRect.width - padX);
  const maxTop = Math.max(padTop, vh - exitRect.height - padBottom);

  // Cari posisi acak di layar yang tidak menabrak tombol Masuk
  let nextLeft = padX;
  let nextTop = padTop;
  for (let attempt = 0; attempt < 25; attempt++) {
    const candidateLeft = padX + Math.random() * (maxLeft - padX);
    const candidateTop = padTop + Math.random() * (maxTop - padTop);

    const overlapsEnter = !(
      candidateLeft + exitRect.width < enterRect.left - 14 ||
      candidateLeft > enterRect.right + 14 ||
      candidateTop + exitRect.height < enterRect.top - 14 ||
      candidateTop > enterRect.bottom + 14
    );

    nextLeft = candidateLeft;
    nextTop = candidateTop;
    if (!overlapsEnter) break;
  }

  btnRunaway.style.left = `${nextLeft}px`;
  btnRunaway.style.top = `${nextTop}px`;
  btnRunaway.style.transform = `rotate(${(Math.random() - 0.5) * 18}deg)`;

  // Update teks lucu & perbesar tombol Masuk perlahan
  runawaySpeech.textContent = RUNAWAY_PROMPTS[escapeCount % RUNAWAY_PROMPTS.length];
  runawaySpeech.classList.remove("excited");
  void runawaySpeech.offsetWidth;
  runawaySpeech.classList.add("excited");

  escapeCount++;
  enterScale = Math.min(1.28, 1 + escapeCount * 0.045);
  btnEnter.style.transform = `scale(${enterScale.toFixed(2)})`;
}

btnRunaway.addEventListener("pointerdown", moveRunawayButton);
btnRunaway.addEventListener("mouseenter", moveRunawayButton);
btnRunaway.addEventListener("click", moveRunawayButton);

btnEnter.addEventListener("click", (e) => {
  spawnLoveBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 70);
  setTimeout(() => {
    switchScreen(screenWelcome, screenRecap);
    showSingleMemoryStage(0);
  }, 320);
});

/* ==========================================================================
   5. SCREEN 3: SATU PER SATU DULU -> GABUNGKAN SEMUA 6 POLAROID DI AKHIR
========================================================================== */
const recapBadge = document.getElementById("recapBadge");
const recapTitle = document.getElementById("recapTitle");
const recapSubtitle = document.getElementById("recapSubtitle");

const singleMemoryStage = document.getElementById("singleMemoryStage");
const stepCounterText = document.getElementById("stepCounterText");
const stepDots = document.getElementById("stepDots");
const singleCardSlot = document.getElementById("singleCardSlot");
const btnPrevMemory = document.getElementById("btnPrevMemory");
const btnNextMemory = document.getElementById("btnNextMemory");

const combinedScrapbookStage = document.getElementById("combinedScrapbookStage");
const memoriesFeed = document.getElementById("memoriesFeed");

let currentMemoryIndex = 0;
const lovedMemoryIndices = new Set();

function createPolaroidCardElement(item, index, isReveal = false) {
  const article = document.createElement("article");
  article.className = isReveal ? "polaroid-card reveal-item" : "polaroid-card";
  if (lovedMemoryIndices.has(index)) {
    article.classList.add("loved");
  }
  article.style.setProperty("--tilt", item.tilt || "-1.5deg");

  const mediaSrc = item.media || item.image;
  const isVideo = isVideoFile(mediaSrc);

  article.innerHTML = `
    <div class="polaroid-tape" aria-hidden="true"></div>
    <div class="polaroid-photo-wrap">
      ${
        isVideo
          ? `<video class="polaroid-video" src="${mediaSrc}" autoplay loop muted playsinline preload="metadata"></video>
             <button type="button" class="video-sound-btn" aria-label="Nyalakan atau matikan suara video">🔇</button>`
          : `<img src="${mediaSrc}" alt="${item.title}" loading="lazy" />`
      }
      <span class="memory-number-badge">${item.tag || "Momen #" + (index + 1)}</span>
      <span class="tap-heart-badge" aria-hidden="true">${lovedMemoryIndices.has(index) ? "💖" : "🤍"}</span>
    </div>
    <div class="polaroid-caption-area">
      <h3 class="polaroid-handwriting">${item.title}</h3>
      <span class="polaroid-date">${item.date}</span>
      <p class="polaroid-story">${item.story}</p>
    </div>
  `;

  if (isVideo) {
    const videoEl = article.querySelector("video");
    const soundBtn = article.querySelector(".video-sound-btn");

    videoEl.onerror = () => {
      const fallbackImg = document.createElement("img");
      fallbackImg.src = buildCuteFallbackDataUri(item.title, item.fallbackEmoji);
      fallbackImg.alt = item.title;
      videoEl.replaceWith(fallbackImg);
      soundBtn?.remove();
    };

    soundBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willUnmute = videoEl.muted;
      pauseAllPolaroidVideos(videoEl);
      videoEl.muted = !willUnmute;
      videoEl.play().catch(() => {});

      if (willUnmute) {
        soundBtn.textContent = "🔊";
        soundBtn.classList.add("unmuted");
        if (isMusicPlaying) {
          wasMusicPausedByVideo = true;
          if (useCustomAudio) customBgm.pause();
          stopSynthMusic();
        }
      } else {
        soundBtn.textContent = "🔇";
        soundBtn.classList.remove("unmuted");
        resumeMusicIfPausedByVideo();
      }
    });
  } else {
    const imgEl = article.querySelector("img");
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = buildCuteFallbackDataUri(item.title, item.fallbackEmoji);
    };
  }

  article.addEventListener("click", (e) => {
    lovedMemoryIndices.add(index);
    article.classList.add("loved");
    const badge = article.querySelector(".tap-heart-badge");
    if (badge) badge.textContent = "💖";
    spawnLoveBurst(e.clientX, e.clientY, 26);
  });

  return article;
}

function renderStepDots() {
  stepDots.innerHTML = "";
  MEMORIES_DATA.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "step-dot";
    if (idx === currentMemoryIndex) dot.classList.add("active");
    else if (idx < currentMemoryIndex) dot.classList.add("done");
    dot.setAttribute("aria-label", `Lihat kenangan ${idx + 1}`);
    dot.addEventListener("click", () => {
      renderSingleMemory(idx);
    });
    stepDots.appendChild(dot);
  });
}

function renderSingleMemory(index) {
  pauseAllPolaroidVideos();
  resumeMusicIfPausedByVideo();

  currentMemoryIndex = Math.max(0, Math.min(MEMORIES_DATA.length - 1, index));
  const total = MEMORIES_DATA.length;
  const item = MEMORIES_DATA[currentMemoryIndex];

  stepCounterText.textContent = `Kenangan ${currentMemoryIndex + 1} dari ${total}`;
  renderStepDots();

  singleCardSlot.innerHTML = "";
  singleCardSlot.appendChild(createPolaroidCardElement(item, currentMemoryIndex, false));

  btnPrevMemory.disabled = currentMemoryIndex === 0;
  if (currentMemoryIndex === total - 1) {
    btnNextMemory.textContent = "Gabungin Semua Kenangan ✨💖";
  } else {
    btnNextMemory.textContent = "Lanjut Kenangan Berikutnya →";
  }
}

function showSingleMemoryStage(startIndex = 0) {
  combinedScrapbookStage.classList.add("stage-hidden");
  singleMemoryStage.classList.remove("stage-hidden");

  recapBadge.textContent = "Step by Step Memories 📖";
  recapTitle.textContent = "Cerita Perjalanan Kita ✨";
  recapSubtitle.textContent = "Baca pelan-pelan satu per satu ya sayang — tap fotonya buat kasih love! 💕";

  renderSingleMemory(startIndex);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCombinedScrapbookStage() {
  pauseAllPolaroidVideos();
  resumeMusicIfPausedByVideo();

  singleMemoryStage.classList.add("stage-hidden");
  combinedScrapbookStage.classList.remove("stage-hidden");

  recapBadge.textContent = "Our Complete Scrapbook 📖";
  recapTitle.textContent = "Seberapa Jauh Kita Melangkah Bersama ✨";
  recapSubtitle.textContent = "Semua potongan kenangan kita jadi satu — makasih udah sejauh ini bareng aku 💖";

  renderPolaroidMemories();
  observeRevealItems();
  triggerMassiveLoveExplosion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

btnPrevMemory.addEventListener("click", () => {
  if (currentMemoryIndex > 0) {
    renderSingleMemory(currentMemoryIndex - 1);
  }
});

btnNextMemory.addEventListener("click", (e) => {
  if (currentMemoryIndex < MEMORIES_DATA.length - 1) {
    spawnLoveBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 22);
    renderSingleMemory(currentMemoryIndex + 1);
  } else {
    showCombinedScrapbookStage();
  }
});

function renderPolaroidMemories() {
  memoriesFeed.innerHTML = "";
  MEMORIES_DATA.forEach((item, index) => {
    memoriesFeed.appendChild(createPolaroidCardElement(item, index, true));
  });
}

function observeRevealItems() {
  const items = document.querySelectorAll(".reveal-item");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  items.forEach((el) => observer.observe(el));
}

document.getElementById("btnMoreLove").addEventListener("click", (e) => {
  spawnLoveBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 95);
});

document.getElementById("btnBackToSingle").addEventListener("click", () => {
  showSingleMemoryStage(0);
});

document.getElementById("btnReplay").addEventListener("click", () => {
  currentPin = "";
  isUnlocking = false;
  escapeCount = 0;
  enterScale = 1;
  currentMemoryIndex = 0;
  lovedMemoryIndices.clear();
  updatePinDisplay();
  mascotFace.classList.remove("happy");
  passcodeHint.classList.remove("error-text");
  passcodeHint.textContent = "Clue: 6 angka spesial yang selalu kamu inget 💌";

  if (btnRunaway.parentElement !== choiceStage) {
    choiceStage.appendChild(btnRunaway);
  }
  btnRunaway.style.position = "relative";
  btnRunaway.style.left = "auto";
  btnRunaway.style.top = "auto";
  btnRunaway.style.transform = "none";
  btnEnter.style.transform = "scale(1)";
  runawaySpeech.textContent = "Pilih tombolnya pelan-pelan ya~ 🥺";
  runawaySpeech.classList.remove("excited");

  switchScreen(screenRecap, screenPasscode);
});

// Inisialisasi awal
renderBackgroundPolaroidPile();
renderPolaroidMemories();
