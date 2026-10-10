const wishCard = document.getElementById("wishCard");
const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("musicToggle");
const nextButtons = document.querySelectorAll(".next-btn");
const sections = document.querySelectorAll(".section");
const polaroids = document.querySelectorAll(".polaroid");
const heartBalloon = document.getElementById("heartBalloon");
const finalMemory = document.getElementById("finalMemory");
const finalSlideBtn = document.getElementById("finalSlideBtn");
const proposalBox = document.getElementById("proposalBox");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const addressReveal = document.getElementById("addressReveal");
const noFeedback = document.getElementById("noFeedback");
let mobileNoLockUntil = 0;

let musicStarted = false;

function updateMusicToggleLabel() {
  if (!musicToggle || !bgm) {
    return;
  }

  if (bgm.muted) {
    musicToggle.textContent = "🔇";
    musicToggle.setAttribute("aria-label", "Unmute background music");
    musicToggle.setAttribute("title", "Unmute music");
  } else {
    musicToggle.textContent = "🔊";
    musicToggle.setAttribute("aria-label", "Mute background music");
    musicToggle.setAttribute("title", "Mute music");
  }
}

function showMusicToggle() {
  if (!musicToggle) {
    return;
  }

  musicToggle.classList.add("show");
}

function startMusic() {
  if (musicStarted || !bgm) {
    return;
  }

  bgm.volume = 0.30;
  bgm
    .play()
    .then(() => {
      musicStarted = true;
      showMusicToggle();
      updateMusicToggleLabel();
    })
    .catch(() => {
      // Some browsers block autoplay until interaction; next click will retry.
    });
}

function bootstrapMusicOnFirstInteraction() {
  const tryStart = () => {
    startMusic();
    if (musicStarted) {
      document.removeEventListener("pointerdown", tryStart);
      document.removeEventListener("keydown", tryStart);
    }
  };

  document.addEventListener("pointerdown", tryStart);
  document.addEventListener("keydown", tryStart);
}

bootstrapMusicOnFirstInteraction();

if (musicToggle && bgm) {
  musicToggle.addEventListener("click", () => {
    bgm.muted = !bgm.muted;
    updateMusicToggleLabel();
  });
}

function goToSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });
}

if (wishCard) {
  const openCard = () => {
    wishCard.classList.add("open");
    startMusic();
  };

  wishCard.addEventListener("click", openCard);
  wishCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCard();
    }
  });
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startMusic();
    const nextId = button.dataset.next;
    if (nextId) {
      goToSection(nextId);
    }
  });
});

polaroids.forEach((photoCard) => {
  photoCard.addEventListener("click", () => {
    photoCard.classList.toggle("flipped");
  });
});

if (heartBalloon && finalMemory) {
  heartBalloon.addEventListener("click", () => {
    heartBalloon.classList.remove("lift");
    // Force a reflow so the lift animation can replay on repeated taps.
    void heartBalloon.offsetWidth;
    heartBalloon.classList.add("lift");
    heartBalloon.classList.add("vanish");
    heartBalloon.setAttribute("aria-hidden", "true");
    finalMemory.classList.add("show");
    if (finalSlideBtn) {
      finalSlideBtn.classList.remove("hidden");
    }
    startMusic();
  });
}

function moveNoButton() {
  if (!proposalBox || !noBtn) {
    return;
  }

  const boxRect = proposalBox.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxLeft = Math.max(0, boxRect.width - btnRect.width - 8);
  const maxTop = Math.max(0, boxRect.height - btnRect.height - 8);

  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;

  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
}

function isMobileLikeDevice() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function showNoFeedback() {
  if (!noFeedback) {
    return;
  }

  const messages = ["Nice try", "Wrong answer", "Think again", "Nope, not happening", "Oye.. Yes click chei vachu kada!", "Not in the option"];
  const pick = messages[Math.floor(Math.random() * messages.length)];
  noFeedback.textContent = pick;
  noFeedback.classList.remove("show");
  void noFeedback.offsetWidth;
  noFeedback.classList.add("show");
}

function triggerMobileNoEffect() {
  const now = Date.now();
  if (now < mobileNoLockUntil) {
    return;
  }

  mobileNoLockUntil = now + 1300;

  if (noBtn) {
    noBtn.classList.remove("gravity-hit");
    void noBtn.offsetWidth;
    noBtn.classList.add("gravity-hit");
  }

  window.setTimeout(() => {
    showNoFeedback();
  }, 980);
}

if (noBtn) {
  noBtn.tabIndex = -1;
  noBtn.addEventListener("mouseenter", () => {
    if (!isMobileLikeDevice()) {
      moveNoButton();
    }
  });
  noBtn.addEventListener("focus", () => {
    if (!isMobileLikeDevice()) {
      moveNoButton();
    }
  });
  noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMobileLikeDevice()) {
      triggerMobileNoEffect();
      return;
    }

    moveNoButton();
  });
  noBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    event.stopPropagation();
    triggerMobileNoEffect();
  });
}

if (yesBtn && addressReveal) {
  yesBtn.addEventListener("click", () => {
    addressReveal.classList.add("show");
    yesBtn.textContent = "See You There";
    if (noFeedback) {
      noFeedback.classList.remove("show");
      noFeedback.textContent = "";
    }
    if (noBtn) {
      noBtn.classList.add("hidden");
      noBtn.disabled = true;
    }
  });
}
