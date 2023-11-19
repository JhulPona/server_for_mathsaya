// YunitsChoices.js
import Phaser from "phaser";
import axios from "axios";
import Cookies from "js-cookie";
import skyBackground from "../assets/images/sky.png";
import mountainBackground from "../assets/images/mountain.png";
import longGrassBackground from "../assets/images/longGrass.png";
import backButton from "../assets/images/back.png";
import prevButton from "../assets/images/prev.png";
import nextButton from "../assets/images/next.png";
import finger_arrow from "../assets/images/finger_arrow.png";

import bgMusic from "../assets/audios/background_music.ogg";
import backSound from "../assets/audios/voice_lines/back.mp3";
import yunitschoices_clicked from "../assets/audios/voice_lines/yunitschoices_clicked.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

let currentPage = 1;
const itemsPerPage = 2;
let startIndex = 0;
let endIndex = itemsPerPage;

// Function to fetch Yunits data
async function fetchYunits() {
  const teacherId = Cookies.get("teacherId");
  if (teacherId) {
    try {
      const response = await axios.get(
        `${serverUrl}/yunits/yunits/${teacherId}`
      );
      const yunits = response.data;
      const yunitThumbnailMapping = {};
      const yunitIdMapping = {};

      yunits.forEach((yunit) => {
        yunitThumbnailMapping[yunit.yunitTitle] =
          `${serverUrl}/uploads/yunits/` + yunit.yunitThumbnail;
        yunitIdMapping[yunit.yunitTitle] = yunit.yunitId;
      });
      return { yunitThumbnailMapping, yunitIdMapping };
    } catch (error) {
      console.error("Error fetching Yunits:", error);
    }
  }
}

export default class YunitsChoices extends Phaser.Scene {
  constructor() {
    super({ key: "YunitsChoices" });
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
    this.load.audio("yunitschoices_clicked", yunitschoices_clicked);
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

    this.backSound = this.sound.add("backSound");
    this.yunitschoices_clicked = this.sound.add("yunitschoices_clicked");

    this.createBackgroundLayers();
    const { yunitThumbnailMapping, yunitIdMapping } = await fetchYunits();
    for (const yunitTitle in yunitThumbnailMapping) {
      const thumbnailUrl = yunitThumbnailMapping[yunitTitle];
      this.load.image(`yunit_${yunitTitle}`, thumbnailUrl);
    }
    this.displayBackButton(audioState);
    this.displaySceneTitle();
    this.load.on("complete", () => {
      this.createYunitChoices(
        yunitThumbnailMapping,
        yunitIdMapping,
        audioState
      );
    });
    this.load.start();
  }

  displaySceneTitle() {
    const centerX = this.game.config.width / 2;
    const titleText = this.add.text(centerX, 50, "Mga Yunit", {
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
      if (audioState === "On") {
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

  update() {
    this.scrollBackgrounds.forEach((bg) => {
      bg.image.x -= bg.speed;
      if (bg.image.x <= -this.game.config.width) {
        bg.image.x = this.game.config.width;
      }
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

  createYunitChoices(yunitThumbnailMapping, yunitIdMapping, audioState) {
    const sortedYunits = Object.entries(yunitThumbnailMapping)
      .map(([yunitTitle, thumbnailUrl]) => {
        return { yunitTitle, thumbnailUrl };
      })
      .sort((a, b) => a.yunitTitle.localeCompare(b.yunitTitle));

    // Calculate the visible Yunits based on the current page
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + itemsPerPage, sortedYunits.length);

    const spacing = this.game.config.height / (endIndex - startIndex + 1) + 30;
    const imageSize = 250;

    for (let i = startIndex; i < endIndex; i++) {
      const yunit = sortedYunits[i];
      const y = (i - startIndex + 1) * spacing;
      const x = this.game.config.width / 2;

      const image = this.add.image(x, y, `yunit_${yunit.yunitTitle}`);
      image.setScale(imageSize / image.width, imageSize / image.height);

      const titleLabel = this.add.text(
        x + imageSize / 2 + 10,
        y,
        yunit.yunitTitle,
        {
          fontFamily: "Comic Sans MS",
          fontSize: "20px",
          fill: "#ffffff",
          backgroundColor: "#333333",
        }
      );
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
          responsiveVoice.speak(yunit.yunitTitle, "Filipino Female");
        }
      });

      // Add a pointerout event listener to stop speaking when the mouse leaves the thumbnail
      image.on("pointerout", () => {
        fingerArrow.setVisible(false);
        responsiveVoice.cancel();
      });

      image.on("pointerdown", () => {
        if (this.selectedButton === image) {
          this.selectedButton.clearTint();
          image.setDepth(5);
          const yunitId = yunitIdMapping[yunit.yunitTitle];
          this.tweens.add({
            targets: image,
            angle: 360,
            scaleX: 4,
            scaleY: 4,
            duration: 500,
            onComplete: () => {
              responsiveVoice.cancel();
              this.soundManager.stop();
              if (audioState === "On") {
                this.yunitschoices_clicked.play();
              }
              sessionStorage.setItem("selectedYunitId", yunitId);
              console.log(`Clicked on Yunit ${yunit.yunitTitle}`);
              this.cameras.main.fadeOut(500);
              this.cameras.main.on("camerafadeoutcomplete", () => {
                this.scene.start("LessonsChoices");
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

    if (endIndex < sortedYunits.length) {
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
