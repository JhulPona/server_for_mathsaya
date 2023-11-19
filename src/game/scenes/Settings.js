// Settings.js
import Phaser from "phaser";
import Cookies from "js-cookie";
import skyBackground from "../assets/images/sky.png";
import settingField from "../assets/images/bground.png";
import longGrassBackground from "../assets/images/longGrass.png";
import backButton from "../assets/images/back.png";
import prevButton from "../assets/images/prev.png";
import nextButton from "../assets/images/next.png";
import soundOffLogo from "../assets/images/soundoff.png";
import soundOnLogo from "../assets/images/soundon.png";
import audioOnLogo from "../assets/images/audioon.png";
import audioOffLogo from "../assets/images/audiooff.png";
import signOutLogo from "../assets/images/signout.png";

import settingsBG from "../assets/audios/settingsBG.mp3";
import backSound from "../assets/audios/voice_lines/back.mp3";
import settings_selected_audio from "../assets/audios/voice_lines/settings_selected_audio.mp3";
import settings_selected_sound from "../assets/audios/voice_lines/settings_selected_sound.mp3";
import settings_selected_signout from "../assets/audios/voice_lines/settings_selected_signout.mp3";
import settings_audio_off from "../assets/audios/voice_lines/settings_audio_off.mp3";
import settings_audio_on from "../assets/audios/voice_lines/settings_audio_on.mp3";
import settings_sound_off from "../assets/audios/voice_lines/settings_sound_off.mp3";
import settings_sound_on from "../assets/audios/voice_lines/settings_sound_on.mp3";

export default class Settings extends Phaser.Scene {
  constructor() {
    super({ key: "Settings" });
    this.selectedButton = null;
  }

  preload() {
    this.load.image("sky", skyBackground);
    this.load.image("settingField", settingField);
    this.load.image("longGrass", longGrassBackground);
    this.load.image("backButton", backButton);
    this.load.image("prevButton", prevButton);
    this.load.image("nextButton", nextButton);
    this.load.image("soundOffLogo", soundOffLogo);
    this.load.image("soundOnLogo", soundOnLogo);
    this.load.image("audioOnLogo", audioOnLogo);
    this.load.image("audioOffLogo", audioOffLogo);
    this.load.image("signOutLogo", signOutLogo);
    this.load.audio("settingsBG", settingsBG);
    this.load.audio("backSound", backSound);
    this.load.audio("selected_audio", settings_selected_audio);
    this.load.audio("selected_sound", settings_selected_sound);
    this.load.audio("selected_signout", settings_selected_signout);
    this.load.audio("audio_off", settings_audio_off);
    this.load.audio("audio_on", settings_audio_on);
    this.load.audio("sound_off", settings_sound_off);
    this.load.audio("sound_on", settings_sound_on);
  }

  async create() {
    this.soundManager = this.sound.add("settingsBG", {
      loop: true,
      volume: 0.5,
    });

    const soundState = sessionStorage.getItem("soundState");
    this.soundManager.stop();
    if (soundState === "On") {
      this.soundManager.play();
    }

    this.backSound = this.sound.add("backSound");
    this.selected_audio = this.sound.add("selected_audio");
    this.selected_sound = this.sound.add("selected_sound");
    this.selected_signout = this.sound.add("selected_signout");
    this.audio_off = this.sound.add("audio_off");
    this.audio_on = this.sound.add("audio_on");
    this.sound_off = this.sound.add("sound_off");
    this.sound_on = this.sound.add("sound_on");

    this.createBackgroundLayers();
    this.displayBackButton();
    this.displaySceneTitle();
    this.createSoundButton(soundState);
    this.createAudioButton();
    this.createSignOutButton();
    this.load.start();
  }

  update() {
    this.scrollBackgroundLayers(); // Update the position of background layers
  }

  displaySceneTitle() {
    const centerX = this.game.config.width / 2;
    const titleText = this.add.text(centerX, 50, "Mga Settings", {
      fontFamily: "Comic Sans MS",
      fontSize: "36px",
      fill: "#ffffff",
      backgroundColor: "#333333",
      padding: { left: 15, right: 15, top: 10, bottom: 10 },
    });
    titleText.setOrigin(0.5, 0);
  }

  displayBackButton() {
    const backButton = this.add
      .image(50, 50, "backButton")
      .setOrigin(0, 0)
      .setScale(0.2);
    backButton.setInteractive();

    backButton.on("pointerover", () => {
      if (sessionStorage.getItem("audioState") === "On") {
        this.backSound.play();
      }
    });

    backButton.on("pointerout", () => {
      this.backSound.stop();
    });

    backButton.on("pointerdown", () => {
      this.soundManager.stop();
      backButton.setScale(0.25);
      this.cameras.main.fadeOut(500);
      this.cameras.main.on("camerafadeoutcomplete", () => {
        this.scene.start("PlayGame");
      });
    });
    backButton.on("pointerup", () => {
      backButton.setScale(0.2);
    });
  }

  createSoundButton(soundState) {
    const { width, height } = this.game.config;
    let initialTextureKey = "soundOnLogo";
    if (soundState === "Off") {
      initialTextureKey = "soundOffLogo";
    }
    const soundButton = this.add
      .image(width / 4, height / 2 + 50, initialTextureKey)
      .setInteractive();
    soundButton.setScale(0.5);
    soundButton.on("pointerdown", () => {
      if (this.selectedButton === soundButton) {
        this.toggleSoundState();
      } else {
        if (this.selectedButton) {
          this.selectedButton.clearTint();
        }
        const audioState = sessionStorage.getItem("audioState"); // Get the current audio state
        if (audioState === "On") {
          this.selected_sound.play();
        }
        this.selectedButton = soundButton;
        soundButton.setTint(0xff0000);
      }
    });
  }

  toggleSoundState() {
    const soundButton = this.selectedButton;
    if (soundButton) {
      const isSoundOn = soundButton.texture.key === "soundOnLogo";
      if (isSoundOn) {
        this.soundManager.stop();
        if (sessionStorage.getItem("audioState") === "On") {
          this.sound_off.play();
        }
        soundButton.setTexture("soundOffLogo");
        sessionStorage.setItem("soundState", "Off");
      } else {
        this.soundManager.play();
        if (sessionStorage.getItem("audioState") === "On") {
          this.sound_on.play();
        }
        soundButton.setTexture("soundOnLogo");
        sessionStorage.setItem("soundState", "On");
      }
    }
  }

  createAudioButton() {
    const { width, height } = this.game.config;
    let initialTextureKey = "audioOnLogo";
    const audioState = sessionStorage.getItem("audioState");
    if (audioState === "Off") {
      initialTextureKey = "audioOffLogo";
    }
    const audioButton = this.add
      .image(width / 2, height / 2 + 50, initialTextureKey)
      .setInteractive();
    audioButton.setScale(0.5);
    audioButton.on("pointerdown", () => {
      if (this.selectedButton === audioButton) {
        this.toggleAudioState();
      } else {
        if (this.selectedButton) {
          this.selectedButton.clearTint();
        }
        const audioState = sessionStorage.getItem("audioState");
        if (audioState === "On") {
          this.selected_audio.play();
        }
        this.selectedButton = audioButton;
        audioButton.setTint(0xff0000);
      }
    });
  }

  toggleAudioState() {
    const audioButton = this.selectedButton;
    if (audioButton) {
      const isAudioOn = audioButton.texture.key === "audioOnLogo";
      if (isAudioOn) {
        if (sessionStorage.getItem("audioState") === "On") {
          this.audio_off.play();
        }
        audioButton.setTexture("audioOffLogo");
        sessionStorage.setItem("audioState", "Off");
      } else {
        if (sessionStorage.getItem("audioState") === "On") {
          this.audio_on.play();
        }
        audioButton.setTexture("audioOnLogo");
        sessionStorage.setItem("audioState", "On");
      }
    }
  }

  createSignOutButton() {
    const { width, height } = this.game.config;
    const signOutButton = this.add
      .image((width / 4) * 3, height / 2 + 50, "signOutLogo")
      .setInteractive();
    signOutButton.setScale(0.5);
    signOutButton.on("pointerdown", () => {
      if (this.selectedButton === signOutButton) {
        this.confirmSignOut();
      } else {
        if (this.selectedButton) {
          this.selectedButton.clearTint();
        }
        const audioState = sessionStorage.getItem("audioState");
        if (audioState === "On") {
          this.selected_signout.play();
        }
        this.selectedButton = signOutButton;
        signOutButton.setTint(0xff0000);
      }
    });
  }

  confirmSignOut() {
    const confirmed = window.confirm("Gusto ba nimo mo sign-out?");

    if (confirmed) {
      window.confirm("Sige, bye!");
      Cookies.remove("studentProfile");
      Cookies.remove("teacherId");
      window.location.href = "/";
    }
  }

  createBackgroundLayers() {
    const { width, height } = this.game.config;

    // Create the 1st layer - Sky background
    this.sky1 = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.sky2 = this.add.image(width, 0, "sky").setOrigin(0, 0);
    this.sky1.displayWidth = width;
    this.sky1.displayHeight = height;
    this.sky2.displayWidth = width;
    this.sky2.displayHeight = height;

    // Create the 2nd layer - Moving settingField
    this.mountain1 = this.add.image(0, height, "settingField").setOrigin(0, 1);
    this.mountain2 = this.add
      .image(width, height, "settingField")
      .setOrigin(0, 1);
    this.mountain1.displayWidth = width;
    this.mountain1.displayHeight = height / 2;
    this.mountain2.displayWidth = width;
    this.mountain2.displayHeight = height / 2;

    this.scrollBackgrounds = [
      { image: this.sky1, speed: 1 },
      { image: this.sky2, speed: 1 },
      { image: this.mountain1, speed: 0.1 },
      { image: this.mountain2, speed: 0.1 },
    ];
  }

  scrollBackgroundLayers() {
    this.scrollBackgrounds.forEach((bg) => {
      bg.image.x -= bg.speed;
      if (bg.image.x <= -this.game.config.width) {
        bg.image.x = this.game.config.width;
      }
    });
  }
}
