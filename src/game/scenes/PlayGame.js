// PlayGame.js
import Phaser from "phaser";
import axios from "axios";
import Cookies from "js-cookie";

import skyBackground from "../assets/images/sky.png";
import mountainBackground from "../assets/images/mountain.png";
import longGrassBackground from "../assets/images/longGrass.png";
import profileButton from "../assets/images/profile.png";
import playButton from "../assets/images/play.png";
import settingLogo from "../assets/images/settings.png";

import playgame_clicked_play from "../assets/audios/voice_lines/playgame_clicked_play.mp3";
import playgame_clicked_profile from "../assets/audios/voice_lines/playgame_clicked_profile.mp3";
import playgame_clicked_settings from "../assets/audios/voice_lines/playgame_clicked_settings.mp3";
import playgame_select_play from "../assets/audios/voice_lines/playgame_select_play.mp3";
import playgame_select_profile from "../assets/audios/voice_lines/playgame_select_profile.mp3";
import playgame_select_settings from "../assets/audios/voice_lines/playgame_select_settings.mp3";
import fullscreen from "../assets/audios/voice_lines/fullscreen.mp3";
import unfullscreen from "../assets/audios/voice_lines/unfullscreen.mp3";
import playGameBG from "../assets/audios/playgameBG.mp3";
import clickSound from "../assets/audios/click_sound.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

async function fetchStudentProfile() {
  const studentProfile = Cookies.get("studentProfile");
  if (studentProfile) {
    const studentProfileId = JSON.parse(studentProfile).id;
    try {
      const response = await axios.get(
        `${serverUrl}/sprofile/student-profile/${studentProfileId}`
      );
      const studentData = response.data;
      const teacherId = studentData.studentProfile.teacherId;
      Cookies.set("teacherId", teacherId);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  } else {
    console.error("Student profile not found in cookies.");
  }
}

export default class PlayGame extends Phaser.Scene {
  constructor() {
    super({ key: "PlayGame" });
    this.selectedButton = null;
    this.fullScreenButton = null;
  }

  preload() {
    this.load.image("sky", skyBackground);
    this.load.image("mountain", mountainBackground);
    this.load.image("longGrass", longGrassBackground);
    this.load.image("profileButton", profileButton);
    this.load.image("playButton", playButton);
    this.load.image("settingLogo", settingLogo);

    this.load.audio("playGameBG", playGameBG);
    this.load.audio("clickSound", clickSound);
    this.load.audio("fullscreen", fullscreen);
    this.load.audio("unfullscreen", unfullscreen);
    this.load.audio("clicked_play", playgame_clicked_play);
    this.load.audio("clicked_profile", playgame_clicked_profile);
    this.load.audio("clicked_settings", playgame_clicked_settings);
    this.load.audio("select_play", playgame_select_play);
    this.load.audio("select_profile", playgame_select_profile);
    this.load.audio("select_settings", playgame_select_settings);
  }

  async create() {
    this.soundManager = this.sound.add("playGameBG", {
      loop: true,
      volume: 0.3,
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

    this.fullscreen = this.sound.add("fullscreen");
    this.unfullscreen = this.sound.add("unfullscreen");
    this.clicked_play = this.sound.add("clicked_play");
    this.clicked_profile = this.sound.add("clicked_profile");
    this.clicked_settings = this.sound.add("clicked_settings");
    this.select_play = this.sound.add("select_play");
    this.select_profile = this.sound.add("select_profile");
    this.select_settings = this.sound.add("select_settings");

    this.createBackgroundLayers();
    this.displayTitle();
    this.createProfileButton(audioState);
    this.createPlayButton(audioState);
    this.createSettingsButton(audioState);

    await fetchStudentProfile();

    const fscreen = sessionStorage.getItem("fscreen");
    const isFullScreen = fscreen === "true";

    this.createFullScreenButton(isFullScreen, audioState);
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

    // Create the 1st layer - Sky background
    const sky1 = this.add.image(0, 0, "sky").setOrigin(0, 0);
    const sky2 = this.add.image(width, 0, "sky").setOrigin(0, 0);
    sky1.displayWidth = width;
    sky1.displayHeight = height;
    sky2.displayWidth = width;
    sky2.displayHeight = height;
    this.add.existing(sky1);
    this.add.existing(sky2);

    // Create the 2nd layer - Moving mountain
    const mountain1 = this.add.image(0, height, "mountain").setOrigin(0, 1);
    const mountain2 = this.add.image(width, height, "mountain").setOrigin(0, 1);
    mountain1.displayWidth = width;
    mountain1.displayHeight = height / 2;
    mountain2.displayWidth = width;
    mountain2.displayHeight = height / 2;
    this.add.existing(mountain1);
    this.add.existing(mountain2);

    // Create the 3rd layer - Moving grass
    const longGrass1 = this.add
      .image(width, height, "longGrass")
      .setOrigin(0, 1);
    const longGrass2 = this.add.image(0, height, "longGrass").setOrigin(0, 1);
    longGrass1.displayWidth = width;
    longGrass1.displayHeight = (3 / 4) * height;
    longGrass2.displayWidth = width;
    longGrass2.displayHeight = (3 / 4) * height;
    this.add.existing(longGrass1);
    this.add.existing(longGrass2);

    this.scrollBackgrounds = [
      { image: sky1, speed: 1 },
      { image: sky2, speed: 1 },
      { image: mountain1, speed: 0.1 },
      { image: mountain2, speed: 0.1 },
      { image: longGrass1, speed: 0.5 },
      { image: longGrass2, speed: 0.5 },
    ];
  }

  displayTitle() {
    const centerX = this.game.config.width / 2;
    const titleText = this.add.text(centerX, 50, "MathSaya", {
      fontFamily: "Impact",
      fontSize: "200px",
      fill: "#333333",
      padding: { x: 20, y: 10 },
    });
    titleText.setOrigin(0.5, 0);
  }

  createProfileButton(audioState) {
    const { width, height } = this.game.config;

    const profileButton = this.add
      .image(width / 4, height / 2 + 100, "profileButton")
      .setInteractive();

    profileButton.setScale(1.5);

    profileButton.on("pointerdown", () => {
      if (this.selectedButton === profileButton) {
        this.rotateProfileButton({ profileButton, audioState });
      } else {
        if (this.selectedButton) {
          this.selectedButton.clearTint();
        }
        if (audioState === "On") {
          this.select_profile.play();
        }
        this.selectedButton = profileButton;
        profileButton.setTint(0xff0000);
      }
    });
  }

  rotateProfileButton({ profileButton, audioState }) {
    this.tweens.add({
      targets: profileButton,
      duration: 300,
      angle: 360,
      onComplete: () => {
        this.tweens.add({
          targets: profileButton,
          angle: 360,
          duration: 300,
          onComplete: () => {
            this.soundManager.stop();
            if (audioState === "On") {
              this.clicked_profile.play();
            }
            this.cameras.main.fadeOut(500);
            this.cameras.main.on("camerafadeoutcomplete", () => {
              this.scene.start("Profile");
            });
          },
        });
      },
    });
  }

  createPlayButton(audioState) {
    const { width, height } = this.game.config;

    const playButton = this.add
      .image(width / 2, height / 2 + 100, "playButton")
      .setInteractive();

    playButton.setScale(1.5);

    playButton.on("pointerdown", () => {
      sessionStorage.removeItem("selectedYunitId");
      sessionStorage.removeItem("selectedLessonId");
      sessionStorage.removeItem("selectedExerciseId");
      if (this.selectedButton === playButton) {
        this.rotatePlayButton({ playButton, audioState });
      } else {
        if (this.selectedButton) {
          this.selectedButton.clearTint();
        }
        if (audioState === "On") {
          this.select_play.play();
        }
        this.selectedButton = playButton;
        playButton.setTint(0xff0000);
      }
    });
  }

  rotatePlayButton({ playButton, audioState }) {
    this.tweens.add({
      targets: playButton,
      duration: 300,
      angle: 360,
      onComplete: () => {
        this.tweens.add({
          targets: playButton,
          angle: 360,
          duration: 300,
          onComplete: () => {
            this.soundManager.stop();
            if (audioState === "On") {
              this.clicked_play.play();
            }
            this.cameras.main.fadeOut(500);
            this.cameras.main.on("camerafadeoutcomplete", () => {
              this.scene.start("YunitsChoices");
            });
          },
        });
      },
    });
  }

  createSettingsButton(audioState) {
    const { width, height } = this.game.config;

    const settingsButton = this.add
      .image((width / 4) * 3, height / 2 + 100, "settingLogo")
      .setInteractive();

    settingsButton.setScale(0.8);

    settingsButton.on("pointerdown", () => {
      if (this.selectedButton === settingsButton) {
        this.rotateSettingsButton({ settingsButton, audioState });
      } else {
        if (this.selectedButton) {
          this.selectedButton.clearTint();
        }
        if (audioState === "On") {
          this.select_settings.play();
        }
        this.selectedButton = settingsButton;
        settingsButton.setTint(0xff0000);
      }
    });
  }

  rotateSettingsButton({ settingsButton, audioState }) {
    this.tweens.add({
      targets: settingsButton,
      duration: 300,
      angle: 360,
      onComplete: () => {
        this.tweens.add({
          targets: settingsButton,
          angle: 360,
          duration: 500,
          onComplete: () => {
            this.soundManager.stop();
            if (audioState === "On") {
              this.clicked_settings.play();
            }
            this.cameras.main.fadeOut(500);
            this.cameras.main.on("camerafadeoutcomplete", () => {
              this.scene.start("Settings");
            });
          },
        });
      },
    });
  }

  createFullScreenButton(isFullScreen, audioState) {
    const { width, height } = this.game.config;

    // Create the button with the appropriate label based on isFullScreen
    this.fullScreenButton = this.add.text(
      width - 100,
      height - 100,
      `[ ${isFullScreen ? "1" : "0"} ]`,
      {
        fontFamily: "Arial",
        fontSize: "50px",
        fontStyle: "bold",
        fill: "#000",
      }
    );

    this.fullScreenButton.setInteractive();

    this.fullScreenButton.on("pointerover", () => {
      if (audioState === "On") {
        if (isFullScreen) {
          this.unfullscreen.play();
        } else {
          this.fullscreen.play();
        }
      }
    });

    this.fullScreenButton.on("pointerdown", () => {
      if (isFullScreen) {
        // Exit full screen
        this.scale.stopFullscreen();
        isFullScreen = false;
        sessionStorage.setItem("fscreen", false);
      } else {
        // Enter full screen
        this.scale.startFullscreen();
        isFullScreen = true;
        sessionStorage.setItem("fscreen", true);

        // Check if the orientation needs to be adjusted
        if (window.screen.orientation) {
          // Lock the screen orientation to landscape
          window.screen.orientation.lock("landscape").catch((error) => {
            console.error("Error locking screen orientation:", error);
          });
        }
      }

      // Update the button label
      this.fullScreenButton.setText(`[ ${isFullScreen ? "1" : "0"} ]`);
    });
  }
}
