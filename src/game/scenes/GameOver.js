// GameOver.js
import Phaser from "phaser";
import axios from "axios";
import Cookies from "js-cookie";

import skyBackground from "../assets/images/sky.png";
import mountainBackground from "../assets/images/mountain.png";
import longGrassBackground from "../assets/images/longGrass.png";
import balloons from "../assets/images/balloons.png";

import settingsBG from "../assets/audios/settingsBG.mp3";
import questionsanswering_congrats from "../assets/audios/voice_lines/questionsanswering_congrats.mp3";
import lessonschoices_clicked from "../assets/audios/voice_lines/lessonschoices_clicked.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

function dataYunit(selectedYunitId, userScore, studentProfileId) {
  const completionDataYunit = {
    yunitId: selectedYunitId,
    starRating: userScore,
    studentProfileId,
  };

  return axios.post(
    `${serverUrl}/sprofile/add-completed-yunit`,
    completionDataYunit
  );
}

function dataLesson(selectedLessonId, userScore, studentProfileId) {
  const completionDataLesson = {
    lessonId: selectedLessonId,
    starRating: userScore,
    studentProfileId,
  };

  return axios.post(
    `${serverUrl}/sprofile/add-completed-lesson`,
    completionDataLesson
  );
}

function dataExercise(selectedExerciseId, userScore, studentProfileId) {
  const completionDataExercise = {
    exerciseId: selectedExerciseId,
    starRating: userScore,
    studentProfileId,
  };

  return axios.post(
    `${serverUrl}/sprofile/add-completed-exercise`,
    completionDataExercise
  );
}

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload() {
    this.load.image("sky", skyBackground);
    this.load.image("mountain", mountainBackground);
    this.load.image("longGrass", longGrassBackground);
    this.load.image("balloons", balloons);

    this.load.audio("settingsBG", settingsBG);
    this.load.audio("congrats", questionsanswering_congrats);
    this.load.audio("lessonschoices_clicked", lessonschoices_clicked);
  }

  create() {
    this.soundManager = this.sound.add("settingsBG", {
      loop: true,
      volume: 0.5,
    });

    const soundState = sessionStorage.getItem("soundState");
    this.soundManager.stop();
    if (soundState === "On") {
      this.soundManager.play();
    }

    const audioState = sessionStorage.getItem("audioState");

    this.congrats = this.sound.add("congrats");
    this.lessonschoices_clicked = this.sound.add("lessonschoices_clicked");

    if (audioState === "On") {
      this.congrats.play();
    }

    this.createBackgroundLayers();
    this.createGameOverScreen(audioState);
    this.completeExercise();
  }

  completeExercise() {
    const userScore = this.registry.get("score");
    const selectedExerciseId = sessionStorage.getItem("selectedExerciseId");
    const selectedLessonId = sessionStorage.getItem("selectedLessonId");
    const selectedYunitId = sessionStorage.getItem("selectedYunitId");
    const studentProfile = Cookies.get("studentProfile");
    const studentProfileId = JSON.parse(studentProfile).id;

    dataExercise(selectedExerciseId, userScore, studentProfileId)
      .then(() => {
        return dataLesson(selectedLessonId, userScore, studentProfileId);
      })
      .then(() => {
        return dataYunit(selectedYunitId, userScore, studentProfileId);
      });
  }

  createBackgroundLayers() {
    const { width, height } = this.game.config;

    const sky1 = this.add.image(0, 0, "sky").setOrigin(0, 0);
    const sky2 = this.add.image(width, 0, "sky").setOrigin(0, 0);
    sky1.displayWidth = width;
    sky1.displayHeight = height;
    sky2.displayWidth = width;
    sky2.displayHeight = height;
    this.add.existing(sky1);
    this.add.existing(sky2);

    const mountain1 = this.add.image(0, height, "mountain").setOrigin(0, 1);
    const mountain2 = this.add.image(width, height, "mountain").setOrigin(0, 1);
    mountain1.displayWidth = width;
    mountain1.displayHeight = height / 2;
    mountain2.displayWidth = width;
    mountain2.displayHeight = height / 2;
    this.add.existing(mountain1);
    this.add.existing(mountain2);

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

    const scrollSpeeds = {
      sky: 1,
      mountain: 0.1,
      longGrass: 0.5,
    };

    this.scrollBackgrounds = [
      { image: sky1, speed: scrollSpeeds.sky },
      { image: sky2, speed: scrollSpeeds.sky },
      { image: mountain1, speed: scrollSpeeds.mountain },
      { image: mountain2, speed: scrollSpeeds.mountain },
      { image: longGrass1, speed: scrollSpeeds.longGrass },
      { image: longGrass2, speed: scrollSpeeds.longGrass },
    ];
  }

  createGameOverScreen(audioState) {
    const { width, height } = this.game.config;

    const container = this.add.container(width / 2, height / 2);
    const containerWidth = width / 2;
    const containerHeight = height / 2;
    const background = this.add.graphics();
    background.fillStyle(0x87ceeb, 1);
    background.fillRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      containerHeight
    );

    const congratulationsText = this.add.text(
      0,
      -containerHeight / 4,
      "Congrats, amigo!",
      {
        fontFamily: "Comic Sans MS",
        fontSize: "50px",
        fill: "#000",
        wordWrap: { width: containerWidth - 20, useAdvancedWrap: true },
      }
    );
    congratulationsText.setOrigin(0.5, 0.5);

    const userScore = this.registry.get("score");

    const scoreText = this.add.text(
      0,
      0,
      "Mga Nakolektang bituon: " + userScore + " ⭐",
      {
        fontFamily: "Comic Sans MS",
        fontSize: "24px",
        fill: "#000",
        wordWrap: { width: containerWidth - 20, useAdvancedWrap: true },
      }
    );
    scoreText.setOrigin(0.5, 0.5);

    const returnButton = this.add.text(
      0,
      containerHeight / 4,
      "E-klik diri para makabalik sa pilianan!",
      {
        fontFamily: "Arial",
        fontSize: "24px",
        fill: "#000",
        backgroundColor: "#87ceeb",
        padding: { x: 10, y: 5 },
        wordWrap: { width: containerWidth - 20, useAdvancedWrap: true },
      }
    );
    this.tweens.add({
      targets: returnButton,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Create Graphics object for drawing lines
    const graphics = this.add.graphics();
    returnButton.on("pointerover", () => {
      // Draw red lines on button corners when hovered
      const rect = returnButton.getBounds();
      const { x, y, width, height } = rect;
      const lineThickness = 2;
      const lineColor = 0xff0000;

      graphics.lineStyle(lineThickness, lineColor);

      // Draw lines on the four corners
      graphics.beginPath();
      graphics.moveTo(x, y);
      graphics.lineTo(x + 10, y);
      graphics.moveTo(x, y);
      graphics.lineTo(x, y + 10);

      graphics.moveTo(x + width, y);
      graphics.lineTo(x + width - 10, y);
      graphics.moveTo(x + width, y);
      graphics.lineTo(x + width, y + 10);

      graphics.moveTo(x, y + height);
      graphics.lineTo(x + 10, y + height);
      graphics.moveTo(x, y + height);
      graphics.lineTo(x, y + height - 10);

      graphics.moveTo(x + width, y + height);
      graphics.lineTo(x + width - 10, y + height);
      graphics.moveTo(x + width, y + height);
      graphics.lineTo(x + width, y + height - 10);

      graphics.strokePath();
    });

    returnButton.on("pointerout", () => {
      // Clear the lines when the button is not hovered
      graphics.clear();
    });

    returnButton.setOrigin(0.5, 0.5);
    returnButton.setInteractive();

    returnButton.on("pointerdown", () => {
      sessionStorage.removeItem("selectedExerciseId");
      if (audioState === "On") {
        this.lessonschoices_clicked.play();
      }
      this.tweens.add({
        targets: returnButton,
        scaleX: 0.9,
        scaleY: 0.9,
        ease: "Bounce.easeOut",
        duration: 200,
        yoyo: true,
        onComplete: () => {
          this.soundManager.stop();
          this.cameras.main.fadeOut(500);
          this.cameras.main.on("camerafadeoutcomplete", () => {
            this.scene.start("ExercisesChoices");
          });
        },
      });
    });

    container.add([background, congratulationsText, scoreText, returnButton]);
    this.add.existing(container);
  }

  update() {
    this.scrollBackgroundLayers();
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
