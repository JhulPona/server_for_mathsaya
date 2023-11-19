// ExercisesChoices.js
import Phaser from "phaser";
import Cookies from "js-cookie";
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
import exerciseschoices_clicked from "../assets/audios/voice_lines/exerciseschoices_clicked.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

let currentPage = 1;
const itemsPerPage = 3;
let startIndex = 0;
let endIndex = itemsPerPage;
let exercises = []; // Store fetched exercises
let completedExercises = [];

// Function to fetch Exercises data
async function fetchExercises() {
  const selectedLessonId = sessionStorage.getItem("selectedLessonId");
  if (selectedLessonId) {
    try {
      const response = await axios.get(
        `${serverUrl}/exercises/exercises/${selectedLessonId}`
      );
      exercises = response.data;
      return exercises;
    } catch (error) {
      console.error("Error fetching Exercises:", error);
    }
  }
}

async function fetchStudentProfile() {
  const studentProfile = Cookies.get("studentProfile");
  const studentProfileId = JSON.parse(studentProfile).id;
  try {
    const response = await fetch(
      `${serverUrl}/sprofile/student-profile/${studentProfileId}`
    );
    const studentProfileData = await response.json();
    completedExercises = studentProfileData.completedExercises;
    console.log("Completed Exercises: ", completedExercises);
  } catch (error) {
    console.error("Error fetching student profile:", error);
  }
}

export default class ExercisesChoices extends Phaser.Scene {
  constructor() {
    super({ key: "ExercisesChoices" });
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
    this.load.audio("exerciseschoices_clicked", exerciseschoices_clicked);
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
    this.exerciseschoices_clicked = this.sound.add("exerciseschoices_clicked");

    this.createBackgroundLayers();
    await fetchStudentProfile();

    await fetchExercises();
    this.displayBackButton(audioState);
    this.displaySceneTitle();
    this.displayExercises(currentPage, audioState);
    this.load.start();
  }

  displaySceneTitle() {
    const centerX = this.game.config.width / 2;
    const titleText = this.add.text(centerX, 50, "Mga Ehersisyo", {
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
      sessionStorage.removeItem("selectedLessonId");
      backButton.setScale(0.25); // Increase the scale slightly
      this.cameras.main.fadeOut(500);
      this.cameras.main.on("camerafadeoutcomplete", () => {
        this.scene.start("LessonsChoices");
      });
    });
    backButton.on("pointerup", () => {
      backButton.setScale(0.2);
    });
  }

  update() {
    this.scrollBackgroundLayers(); // Update the position of background layers
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

  displayExercises(page, audioState) {
    // Sort the exercises by exerciseTitle
    exercises.sort((a, b) => a.exerciseTitle.localeCompare(b.exerciseTitle));
    // Calculate the visible exercises based on the current page
    startIndex = (page - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + itemsPerPage, exercises.length);

    const spacing = this.game.config.height / (endIndex - startIndex + 1) + 30;

    for (let i = startIndex; i < endIndex; i++) {
      const exercise = exercises[i];
      const { exerciseTitle, exercise_description } = exercise;
      const y = (i - startIndex + 1) * spacing;
      const x = this.game.config.width / 2;

      const isCompleted = completedExercises.some(
        (completedExercise) =>
          completedExercise.exerciseId === exercise.exerciseId
      );

      // Create a text label for Exercise title and description
      const exerciseLabel = this.add.text(
        x,
        y,
        isCompleted
          ? `${exerciseTitle}\n---------------------\n${exercise_description}\n< < < < < < < < < o > > > > > > > > >\nHUMANA NIMO UG TUBAG\n Bituon: ${
              completedExercises.find(
                (completedExercise) =>
                  completedExercise.exerciseId === exercise.exerciseId
              ).starRating
            } ⭐`
          : `${exerciseTitle}\n---------------------\n${exercise_description}`,
        {
          fontFamily: "Comic Sans MS",
          fontSize: "24px",
          align: "center",
          wordWrap: { width: 500, useAdvancedWrap: true },
        }
      );

      exerciseLabel.setOrigin(0.5, 0.5);

      // Create finger_arrow
      const fingerArrow = this.add.image(
        x - exerciseLabel.width / 2 - 20,
        y + 50,
        "finger_arrow"
      );
      fingerArrow.setScale(0.5); // Adjust the scale as needed

      // Initially, hide the finger_arrow
      fingerArrow.setVisible(false);

      if (isCompleted) {
        // Style for completed exercises
        exerciseLabel.setFill("#bad533"); // White text
        exerciseLabel.setBackgroundColor("#4d4423"); // Black background
      } else {
        // Style for incomplete exercises
        exerciseLabel.setFill("#4d4423"); // Black text
        exerciseLabel.setBackgroundColor("#bad533"); // Green background
      }

      // Additional styling for both completed and incomplete exercises
      exerciseLabel.setPadding(10);

      // Make each exercise entry clickable
      exerciseLabel.setInteractive();

      exerciseLabel.on("pointerover", () => {
        fingerArrow.setVisible(true);
        const { exerciseTitle, exercise_description } = exercise;
        const textToSpeak = `${exerciseTitle}. ${exercise_description}`;
        if (audioState === "On") {
          responsiveVoice.speak(textToSpeak, "Filipino Female");
        }
      });

      // Add a pointerout event listener to stop speaking when the mouse leaves the thumbnail
      exerciseLabel.on("pointerout", () => {
        fingerArrow.setVisible(false);
        responsiveVoice.cancel();
      });

      exerciseLabel.on("pointerdown", () => {
        if (this.selectedButton === exerciseLabel) {
          this.selectedButton.clearTint();
          exerciseLabel.setDepth(5);
          if (!isCompleted) {
            const selectedExercise = exercises[i];
            const { exerciseId, exerciseTitle } = selectedExercise;
            this.tweens.add({
              targets: exerciseLabel,
              angle: 360,
              scaleX: 40,
              scaleY: 40,
              duration: 500,
              onComplete: () => {
                responsiveVoice.cancel();
                this.soundManager.stop();
                if (audioState === "On") {
                  this.exerciseschoices_clicked.play();
                }
                sessionStorage.setItem("selectedExerciseId", exerciseId);
                console.log(`Clicked on Exercise ${exerciseTitle}`);
                this.cameras.main.fadeOut(500);
                this.cameras.main.on("camerafadeoutcomplete", () => {
                  this.scene.start("QuestionsAnswering");
                });
              },
            });
          } else {
            if (audioState === "On") {
              responsiveVoice.speak(
                "Humana na nimo nig tubag!",
                "Filipino Female"
              );
            }
          }
        } else {
          if (this.selectedButton) {
            this.selectedButton.clearTint();
          }
          this.selectedButton = exerciseLabel;
          exerciseLabel.setTint(0xff0000);
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

    if (endIndex < exercises.length) {
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
