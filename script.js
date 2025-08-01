document.addEventListener("DOMContentLoaded", () => {
  const tasks = {
    "Caveman Times": "Teaching cavemen how to moonwalk",
    "Ancient Egypt": "Stealing Cleopatra’s eyeliner",
    "Modern era": "Inventing sarcasm",
    "4200 AD": "Selling NFTs to aliens",
    "Medieval Times": "Helping a knight write a love poem"
  };

  const videoMap = {
    "Caveman Times": "videos/cavedance.mp4",
    "Ancient Egypt": "videos/egypt.mp4"
  };

  const backgroundMap = {
    "Modern era": "images/greece-bg.jpg",
    "4200 AD": "images/future-bg.jpg",
    "Medieval Times": "images/castle-bg.jpg"
  };

  const teleportBtn = document.getElementById("teleportBtn");
  const eraDropdown = document.getElementById("eraDropdown");
  const mainUI = document.getElementById("mainUI");
  const eraScene = document.getElementById("eraScene");
  const bgVideo = document.getElementById("bgVideo");
  const taskText = document.getElementById("taskText");
  const taskBox = document.getElementById("taskBox");
  const backBtn = document.getElementById("backBtn");
  const overlay = document.getElementById("overlay");
  const travelLog = document.getElementById("travelLogList");

  // Add to travel log
  function addToLog(era, task) {
    const li = document.createElement("li");
    li.textContent = `🕒 ${era}: ${task}`;  // ✅ Fixed: backticks
    travelLog.appendChild(li);
  }

  // Reset scene
  function resetScene() {
    bgVideo.pause();
    bgVideo.src = "";
    bgVideo.load();
    bgVideo.style.display = "none";
    taskBox.style.display = "none";
    backBtn.style.display = "none";
    overlay.classList.remove("show");
    eraScene.style.backgroundImage = "";
    eraScene.style.background = "";
    eraScene.classList.remove("fullscreen-mode");

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.warn("Exit fullscreen failed:", e));
    }
  }

  // Show overlay
  function showOverlay(era) {
    const task = tasks[era] || "Doing something absurd...";
    taskText.textContent = `🎯 ${task}`;  // ✅ Fixed: backticks
    taskBox.style.display = "block";
    backBtn.style.display = "inline-block";
    overlay.classList.add("show");
    addToLog(era, task);
  }

  // Enter fullscreen
  function enterFullscreen() {
    if (!document.fullscreenElement) {
      eraScene.requestFullscreen().then(() => {
        eraScene.classList.add("fullscreen-mode");
      }).catch(err => {
        console.warn("Fullscreen request denied:", err);
        eraScene.classList.add("fullscreen-mode");
      });
    }
  }

  // Teleport
  async function teleport() {
    const era = eraDropdown.value;
    if (!era) {
      alert("Please select an era.");
      return;
    }

    mainUI.style.display = "none";
    eraScene.style.display = "block";
    resetScene();

    if (videoMap[era]) {
      bgVideo.src = videoMap[era];
      bgVideo.style.display = "block";
      bgVideo.muted = true;
      bgVideo.playsInline = true;
      bgVideo.load();

      bgVideo.addEventListener("loadeddata", async () => {
        try {
          await bgVideo.play();
          console.log("🎥 Video autoplay started:", era);
          enterFullscreen();
        } catch (err) {
          console.warn("🔇 Autoplay failed:", err);
          enterFullscreen();
          showOverlay(era);
        }
      }, { once: true });

      bgVideo.addEventListener("ended", () => {
        showOverlay(era);
      }, { once: true });

      bgVideo.addEventListener("error", () => {
        console.error("❌ Video failed to load:", videoMap[era]);
        eraScene.style.background = "#000";
        enterFullscreen();
        showOverlay(era);
      });
    } else {
      if (backgroundMap[era]) {
        eraScene.style.backgroundImage = `url('${backgroundMap[era]}')`;  // ✅ Fixed
        eraScene.style.backgroundSize = "cover";
        eraScene.style.backgroundPosition = "center";
      } else {
        eraScene.style.background = "#000";
      }
      enterFullscreen();
      showOverlay(era);
    }
  }

  // Go back
  function goBack() {
    resetScene();
    eraScene.style.display = "none";
    mainUI.style.display = "block";
  }

  // Event Listeners
  teleportBtn.addEventListener("click", teleport);
  backBtn.addEventListener("click", goBack);

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      eraScene.classList.remove("fullscreen-mode");
    }
  });
});