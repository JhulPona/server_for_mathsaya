import Phaser from "phaser";
import axios from "axios";
import skyBackground from "../assets/images/sky.png";
import mountainBackground from "../assets/images/mountain.png";
import longGrassBackground from "../assets/images/longGrass.png";
import backButton from "../assets/images/back.png";
import prevButton from "../assets/images/prev.png";
import nextButton from "../assets/images/next.png";
import finger_arrow from "../assets/images/finger_arrow.png";

import bgMusic from "../assets/audios/background_music.ogg";
import backSound from "../assets/audios/voice_lines/back.mp3";
import lessonschoices_clicked from "../assets/audios/voice_lines/lessonschoices_clicked.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

let currentPage = 1;
const itemsPerPage = 2;
let startIndex = 0;
let endIndex = itemsPerPage;

// Function to fetch Lessons data
async function fetchLessons() {
  const LessonThumbnailMapping = {};
  const lessonIdMapping = {};
  const selectedYunitId = sessionStorage.getItem("selectedYunitId");
  if (selectedYunitId) {
    try {
      const response = await axios.get(
        `${serverUrl}/lessons/lessons/${selectedYunitId}`
      );
      const lessons = response.data;

      lessons.forEach((lesson) => {
        LessonThumbnailMapping[lesson.lessonTitle] =
          `${serverUrl}/uploads/lessons/` + lesson.lessonThumbnail;
        lessonIdMapping[lesson.lessonTitle] = lesson.lessonId;
      });
      return { LessonThumbnailMapping, lessonIdMapping };
    } catch (error) {
      console.error("Error fetching Lessons:", error);
    }
  }
}

export default class LessonsChoices extends Phaser.Scene {
  constructor() {
    super({ key: "LessonsChoices" });
    this.selectedButton = null;
  }

  preload() {
    this.load.image("sky", skyBackground);
    this.load.image("mountain", mountainBackground);
    this.load.image("longGrass", longGrassBackground);
    this.load.image("backButton", backButton);
    this.load.image("prevButton", prevButton);
    this.load.image("nextButton", nextButton);
    this.load.image("finger_arrow", finger_arrow);

    this.load.audio("bgMusic", bgMusic);
    this.load.audio("backSound", backSound);
    this.load.audio("lessonschoices_clicked", lessonschoices_clicked);
  }

  async create() {
    this.soundManager = this.sound.add("bgMusic", {
      loop: true,
      volume: 0.1,
    });

    const soundState = sessionStorage.getItem("soundState");
    this.soundManager.stop();
    if (soundState === "On") {
      this.soundManager.play();
    }

    const audioState = sessionStorage.getItem("audioState");

    this.backButton = this.sound.add("backSound");
    this.lessonschoices_clicked = this.sound.add("lessonschoices_clicked");

    this.createBackgroundLayers();

    const { LessonThumbnailMapping, lessonIdMapping } = await fetchLessons();
    console.log("LessonThumbnailMapping:", LessonThumbnailMapping);
    console.log("lessonIdMapping:", lessonIdMapping);

    for (const lessonTitle in LessonThumbnailMapping) {
      const thumbnailUrl = LessonThumbnailMapping[lessonTitle];
      this.load.image(`yunit_${lessonTitle}`, thumbnailUrl);
    }

    this.displayBackButton(audioState);
    this.displaySceneTitle();
    this.load.on("complete", () => {
      this.createLessonImages(
        LessonThumbnailMapping,
        lessonIdMapping,
        audioState
      );
    });
    this.load.start();
  }

  displaySceneTitle() {
    const centerX = this.game.config.width / 2;
    const titleText = this.add.text(centerX, 50, "Mga Leksyon", {
      fontFamily: "Comic Sans MS",
      fontSize: "36px",
      fill: "#ffffff",
      backgroundColor: "#333333",
      padding: { left: 15, right: 15, top: 10, bottom: 10 },
    });
    titleText.setOrigin(0.5, 0);
  }

  displayBackButton(audioState) {
    const backButton = this.add
      .image(50, 50, "backButton")
      .setOrigin(0, 0)
      .setScale(0.2);
    backButton.setInteractive();

    backButton.on("pointerover", () => {
      if (sessionStorage.getItem("audioState") === "On") {
        if (audioState === "On") {
          this.backButton.play();
        }
      }
    });

    backButton.on("pointerout", () => {
      this.backButton.stop();
    });

    backButton.on("pointerdown", () => {
      this.soundManager.stop();
      sessionStorage.removeItem("selectedYunitId");
      backButton.setScale(0.25);
      this.cameras.main.fadeOut(500);
      this.cameras.main.on("camerafadeoutcomplete", () => {
        this.scene.start("YunitsChoices");
      });
    });
    backButton.on("pointerup", () => {
      backButton.setScale(0.2);
    });
  }

  update() {
    this.scrollBackgroundLayers();
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

    // Create the 2nd layer - Moving mountain
    this.mountain1 = this.add.image(0, height, "mountain").setOrigin(0, 1);
    this.mountain2 = this.add.image(width, height, "mountain").setOrigin(0, 1);
    this.mountain1.displayWidth = width;
    this.mountain1.displayHeight = height / 2;
    this.mountain2.displayWidth = width;
    this.mountain2.displayHeight = height / 2;

    // Create the 3rd layer - Moving grass
    this.longGrass1 = this.add
      .image(width, height, "longGrass")
      .setOrigin(0, 1);
    this.longGrass2 = this.add.image(0, height, "longGrass").setOrigin(0, 1);
    this.longGrass1.displayWidth = width;
    this.longGrass1.displayHeight = (3 / 4) * height;
    this.longGrass2.displayWidth = width;
    this.longGrass2.displayHeight = (3 / 4) * height;

    this.scrollBackgrounds = [
      { image: this.sky1, speed: 1 },
      { image: this.sky2, speed: 1 },
      { image: this.mountain1, speed: 0.1 },
      { image: this.mountain2, speed: 0.1 },
      { image: this.longGrass1, speed: 0.5 },
      { image: this.longGrass2, speed: 0.5 },
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

  createLessonImages(LessonThumbnailMapping, lessonIdMapping, audioState) {
    const sortedLessons = Object.entries(LessonThumbnailMapping)
      .map(([lessonTitle, thumbnailUrl]) => {
        return { lessonTitle, thumbnailUrl };
      })
      .sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle));

    // Calculate the visible lessons based on the current page
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + itemsPerPage, sortedLessons.length);

    const spacing = this.game.config.height / (endIndex - startIndex + 1) + 30;
    const imageSize = 250;

    this.children.removeAll();

    // Recreate background layers
    this.createBackgroundLayers();

    // Display other elements (back button, scene title, etc.)
    this.displayBackButton(audioState);
    this.displaySceneTitle();

    for (let i = startIndex; i < endIndex; i++) {
      const lesson = sortedLessons[i];
      const { lessonTitle, thumbnailUrl } = lesson;
      const y = (i - startIndex + 1) * spacing;
      const x = this.game.config.width / 2;

      const image = this.add.image(x, y, `yunit_${lessonTitle}`);
      image.setScale(imageSize / image.width, imageSize / image.height);

      const titleLabel = this.add.text(x + imageSize / 2 + 10, y, lessonTitle, {
        fontFamily: "Comic Sans MS",
        fontSize: "20px",
        fill: "#ffffff",
        backgroundColor: "#333333",
      });
      titleLabel.setOrigin(0, 0.5);

      // Create finger_arrow
      const fingerArrow = this.add.image(
        x - imageSize / 2 - 20,
        y,
        "finger_arrow"
      );
      fingerArrow.setScale(0.5); // Adjust the scale as needed

      // Initially, hide the finger_arrow
      fingerArrow.setVisible(false);

      image.setInteractive();

      image.on("pointerover", () => {
        fingerArrow.setVisible(true);
        if (audioState === "On") {
          responsiveVoice.speak(lesson.lessonTitle, "Filipino Female");
        }
      });

      image.on("pointerout", () => {
        fingerArrow.setVisible(false);

        responsiveVoice.cancel();
      });

      image.on("pointerdown", () => {
        if (this.selectedButton === image) {
          this.selectedButton.clearTint();
          image.setDepth(5);
          const lessonId = lessonIdMapping[lessonTitle];
          this.tweens.add({
            targets: image,
            angle: 360,
            scaleX: 4,
            scaleY: 4,
            duration: 500,
            onComplete: () => {
              this.soundManager.stop();
              if (audioState === "On") {
                this.lessonschoices_clicked.play();
              }
              sessionStorage.setItem("selectedLessonId", lessonId);
              console.log(`Clicked on Lesson ${lessonTitle}`);
              this.cameras.main.fadeOut(500);
              this.cameras.main.on("camerafadeoutcomplete", () => {
                this.scene.start("VideoScene");
                this.scene.start("ExercisesChoices");
              });
            },
          });
        } else {
          if (this.selectedButton) {
            this.selectedButton.clearTint();
          }
          this.selectedButton = image;
          image.setTint(0xff0000);
        }
      });
    }

    // Add pagination buttons
    if (currentPage > 1) {
      const prevButton = this.add
        .image(50, this.game.config.height - 50, "prevButton")
        .setInteractive()
        .setScale(0.2);
      prevButton.on("pointerdown", () => {
        currentPage--;
        this.soundManager.stop();
        this.scene.restart();
      });
    }

    if (endIndex < sortedLessons.length) {
      const nextButton = this.add
        .image(
          this.game.config.width - 100,
          this.game.config.height - 50,
          "nextButton"
        )
        .setInteractive()
        .setScale(0.2);
      nextButton.on("pointerdown", () => {
        currentPage++;
        this.soundManager.stop();
        this.scene.restart();
      });
    }
  }
}
