// Profile.js
import Phaser from "phaser";
import axios from "axios";
import Cookies from "js-cookie";
import skyBackground from "../assets/images/sky.png";
import settingField from "../assets/images/bground.png";
import longGrassBackground from "../assets/images/longGrass.png";
import backButton from "../assets/images/back.png";

import settingsBG from "../assets/audios/settingsBG.mp3";
import backSound from "../assets/audios/voice_lines/back.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

export default class Profile extends Phaser.Scene {
  constructor() {
    super({ key: "Profile" });
    this.selectedButton = null;
  }

  preload() {
    this.load.image("sky", skyBackground);
    this.load.image("settingField", settingField);
    this.load.image("longGrass", longGrassBackground);
    this.load.image("backButton", backButton);
    this.load.audio("settingsBG", settingsBG);
    this.load.audio("backSound", backSound);
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

    this.createBackgroundLayers();
    this.displayBackButton();
    this.displaySceneTitle();

    // Fetch student profile information
    const studentProfile = Cookies.get("studentProfile");
    const studentProfileId = JSON.parse(studentProfile).id;
    try {
      const response = await fetch(
        `${serverUrl}/sprofile/student-profile/${studentProfileId}`
      );
      const studentProfileData = await response.json();

      // Display student name and firstLoginDate in a container
      this.displayStudentInfo(studentProfileData);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }

    this.load.start();
  }

  displayStudentInfo(studentProfileData) {
    const { student, studentProfile } = studentProfileData;

    const containerWidth = 300; // Width of the infoContainer
    const containerX = (this.game.config.width - containerWidth) / 2; // Calculate x position for centering

    const infoContainer = this.add.container(containerX, 130); // Adjusted positioning

    const background = this.add.graphics();
    background.fillStyle(0xbfdbfe, 0.7);
    background.fillRect(0, 0, containerWidth, 80);
    infoContainer.add(background);

    const studentName = this.add.text(
      containerWidth / 2, // Centering the text horizontally within the container
      20, // Adjust vertical position as needed
      `${student.firstname} ${student.lastname}`,
      {
        fontFamily: "Comic Sans MS",
        fontSize: "24px",
        fill: "#000000",
        align: "center", // Center align the text
      }
    );
    studentName.setOrigin(0.5); // Set the origin to the center
    infoContainer.add(studentName);

    const loginDate = new Date(studentProfile.firstLoginDate).toLocaleString();
    const firstLogin = this.add.text(
      containerWidth / 2, // Centering the text horizontally within the container
      50, // Adjust vertical position as needed
      `First Login: ${loginDate}`,
      {
        fontFamily: "Comic Sans MS",
        fontSize: "16px",
        fill: "#000000",
        align: "center", // Center align the text
      }
    );
    firstLogin.setOrigin(0.5); // Set the origin to the center
    infoContainer.add(firstLogin);

    const exercisesContainer = this.createSubContainer(
      20,
      230,
      "Rekord sa mga Ehersisyo",
      0x00ff00,
      0.7,
      0x000000
    );
    const lessonsContainer = this.createSubContainer(
      360,
      230,
      "Rekord sa mga Leksyon",
      0xffff00,
      0.7,
      0x333333
    );
    const unitsContainer = this.createSubContainer(
      700,
      230,
      "Rekord sa mga Yunit",
      0xff0000,
      0.7,
      0xcccccc
    );

    const completedExercisesList = this.createCompletedListContainer(
      20,
      300,
      studentProfileData.completedExercises,
      0x00ff00,
      0.7,
      0x000000
    );

    const completedLessonsList = this.createCompletedListContainer(
      360,
      300,
      studentProfileData.completedLessons,
      0xffff00,
      0.7,
      0x333333
    );

    const completedUnitsList = this.createCompletedListContainer(
      700,
      300,
      studentProfileData.completedUnits,
      0xff0000,
      0.7,
      0xcccccc
    );
  }

  createSubContainer(x, y, text, bgColor, alpha, darkColor) {
    const containerWidth = 300; // Width of the subContainer
    const containerHeight = 50; // Height of the subContainer
    const subContainer = this.add.container(x, y);

    const background = this.add.graphics();
    background.fillStyle(bgColor, alpha);
    background.fillRect(0, 0, containerWidth, containerHeight);
    subContainer.add(background);

    const containerText = this.add.text(
      containerWidth / 2,
      containerHeight / 2,
      text,
      {
        fontFamily: "Comic Sans MS",
        fontSize: "24px",
        fill: "#" + darkColor.toString(16), // Using the hex representation
        align: "center",
      }
    );
    containerText.setOrigin(0.5);
    subContainer.add(containerText);

    return subContainer;
  }

  createCompletedListContainer(x, y, data, bgColor, alpha, darkColor) {
    const containerWidth = 300; // Width of the list container
    const containerHeight = 450; // Height of the list container
    const listContainer = this.add.container(x, y);

    const background = this.add.graphics();
    background.fillStyle(bgColor, alpha);
    background.fillRect(0, 0, containerWidth, containerHeight);
    listContainer.add(background);

    // Display the list of completed exercises, lessons, or units
    data.forEach((item, index) => {
      const itemTitle = item.Exercise
        ? item.Exercise.exerciseTitle
        : item.Lesson
        ? item.Lesson.lessonTitle
        : item.Yunit
        ? item.Yunit.yunitTitle
        : "";

      const stars = item.starRating;

      const listItemTitle = this.add.text(
        containerWidth / 2,
        20 + index * 60, // Adjust vertical position for each item and leave space for stars
        itemTitle,
        {
          fontFamily: "Comic Sans MS",
          fontSize: "20px",
          fill: "#" + darkColor.toString(16),
          align: "center",
        }
      );
      listItemTitle.setOrigin(0.5);
      listContainer.add(listItemTitle);

      const listItemStars = this.add.text(
        containerWidth / 2,
        40 + index * 60, // Position for stars below the title
        `Na kolektang Bituon: ${stars} ⭐`,
        {
          fontFamily: "Comic Sans MS",
          fontSize: "16px",
          fill: "#" + darkColor.toString(16),
          align: "center",
        }
      );
      listItemStars.setOrigin(0.5);
      listContainer.add(listItemStars);
    });

    return listContainer;
  }

  update() {
    this.scrollBackgroundLayers();
  }

  displaySceneTitle() {
    const centerX = this.game.config.width / 2;
    const titleText = this.add.text(centerX, 50, "Imohang Profile", {
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
