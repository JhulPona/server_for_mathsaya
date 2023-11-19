// TestScreen.js
import Phaser from "phaser";
import clearBackground from "../assets/images/gradient.jpg";
import mountainBackground from "../assets/images/mountain.png";
import longGrassBackground from "../assets/images/longGrass.png";
import profileButton from "../assets/images/profile.png";
import playButton from "../assets/images/play.png";
import settingLogo from "../assets/images/settings.png";

import testscreen_loop from "../assets/audios/voice_lines/testscreen_loop.mp3";
import testscreen_wlcm_sa_ms from "../assets/audios/voice_lines/testscreen_wlcm_sa_ms.mp3";
import playGameBG from "../assets/audios/playgameBG.mp3";
import clickSound from "../assets/audios/click_sound.mp3";

export default class TestScreen extends Phaser.Scene {
  constructor() {
    super({ key: "TestScreen" });
    this.selectedButton = null;
  }

  preload() {
    this.load.image("clearBG", clearBackground);
    this.load.image("mountain", mountainBackground);
    this.load.image("longGrass", longGrassBackground);
    this.load.image("profileButton", profileButton);
    this.load.image("playButton", playButton);
    this.load.image("settingLogo", settingLogo);
    this.load.audio("playGameBG", playGameBG);
    this.load.audio("clickSound", clickSound);
    this.load.audio("testscreen_loop", testscreen_loop);
    this.load.audio("testscreen_wlcm_sa_ms", testscreen_wlcm_sa_ms);
  }

  async create() {
    sessionStorage.setItem("audioState", "On");
    sessionStorage.setItem("soundState", "On");

    this.soundManager = this.sound.add("playGameBG", {
      loop: true,
      volume: 0.1,
    });

    this.audioManager = this.sound.add("clickSound", {
      loop: false,
      volume: 0.3,
    });

    const soundState = sessionStorage.getItem("soundState");
    this.soundManager.stop();
    if (soundState === "On") {
      this.soundManager.play();
    }

    const audioState = sessionStorage.getItem("audioState");

    this.testscreen_loop = this.sound.add("testscreen_loop");
    this.testscreen_wlcm_sa_ms = this.sound.add("testscreen_wlcm_sa_ms");

    this.createBackgroundLayers();
    this.displayNumbers(audioState);
    this.createStartButton(audioState);

    this.intervalId = setInterval(() => {
      if (audioState === "On") {
        this.testscreen_loop.play();
      }
    }, 10000);
  }

  update() {
    // Update the position of background layers to achieve the scrolling effect
    this.scrollBackgrounds.forEach((bg) => {
      bg.image.x -= bg.speed;
      if (bg.image.x <= -this.game.config.width) {
        bg.image.x = this.game.config.width;
      }
    });
  }

  createBackgroundLayers() {
    const { width, height } = this.game.config;

    // Create the 1st layer - clearBG background
    const clearBG1 = this.add.image(0, 0, "clearBG").setOrigin(0, 0);
    const clearBG2 = this.add.image(width, 0, "clearBG").setOrigin(0, 0);
    clearBG1.displayWidth = width;
    clearBG1.displayHeight = height;
    clearBG2.displayWidth = width;
    clearBG2.displayHeight = height;
    this.add.existing(clearBG1);
    this.add.existing(clearBG2);

    this.scrollBackgrounds = [
      { image: clearBG1, speed: 0.5 },
      { image: clearBG2, speed: 0.5 },
    ];
  }

  displayNumbers(audioState) {
    const { width, height } = this.game.config;
    const numberSpacing = 70;
    const startX = width / 2 - (5 * numberSpacing) / 2 - 150;
    const startY = height / 2 - (10 * numberSpacing) / 2 + 30;

    const numberBoxes = [];

    for (let i = 1; i <= 100; i++) {
      const numberBox = this.add.rectangle(
        startX + ((i - 1) % 10) * numberSpacing,
        startY + Math.floor((i - 1) / 10) * numberSpacing,
        numberSpacing,
        numberSpacing,
        0xffffff
      );

      numberBox.setInteractive();
      numberBoxes.push(numberBox);

      const numberText = this.add.text(numberBox.x, numberBox.y, i, {
        fontFamily: "Arial",
        fontSize: "40px",
        fill: "#000",
      });
      numberText.setOrigin(0.5);

      numberText.setInteractive();

      numberBox.on("pointerover", () => {
        // numberText.setAlpha(0.8);
        numberText.setFill("#ff0000");
      });

      numberBox.on("pointerout", () => {
        // numberText.setAlpha(1);
        numberText.setFill("#000000");
      });

      numberText.on("pointerdown", () => {
        // Change fill to red when clicked
        numberBox.setFillStyle(0xff0000);
        numberBoxes.forEach((box) => {
          if (box !== numberBox) {
            box.setFillStyle(0xffffff); // Reset other boxes to normal fill
          }
        });
        clearInterval(this.intervalId);

        if (audioState === "On") {
          if (i.toString() !== "100") {
            responsiveVoice.speak(
              i.toString(),
              "Spanish Latin American Female"
            );
          } else if (i.toString() === "100") {
            responsiveVoice.speak("Isa ka gatus.", "Filipino Female");
          }
        }
      });
    }
  }

  createStartButton(audioState) {
    const { width, height } = this.game.config;
    const startButton = this.add.text(width - 180, height - 80, "LAKTAWI", {
      fontFamily: "Comic Sans MS",
      fontSize: "26px",
      fill: "#000",
      padding: { x: 20, y: 10 },
    });

    startButton.setInteractive();
    startButton.on("pointerover", () => {
      startButton.setStyle({ fill: "#fff", backgroundColor: "#ff0000" });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ fill: "#000", backgroundColor: "transparent" });
    });

    startButton.on("pointerdown", () => {
      clearInterval(this.intervalId);
      this.soundManager.stop();
      if (audioState === "On") {
        this.testscreen_wlcm_sa_ms.play();
      }
      sessionStorage.setItem("fscreen", true);
      this.scale.startFullscreen();
      if (window.screen.orientation) {
        // Lock the screen orientation to landscape
        window.screen.orientation.lock("landscape").catch((error) => {
          console.error("Error locking screen orientation:", error);
        });
      }
      this.scene.start("PlayGame");
    });
  }
}
