// QuestionsAnswering.js
import Phaser from "phaser";
import axios from "axios";
import skyBackground from "../assets/images/sky.png";
import mountainBackground from "../assets/images/mountain.png";
import longGrassBackground from "../assets/images/longGrass.png";

import right_answer from "../assets/audios/voice_lines/right_answer.mp3";
import wrong_answer from "../assets/audios/voice_lines/wrong_answer.mp3";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

let questions = [];
let currentQuestionIndex = 0;
let questionContainer;
let imageContainer;
let answerContainer;
let userScore = 0;
let remainingTime = 0;

// Function to fetch QuestionsAnswering data
async function fetchQuestions() {
  const selectedExerciseId = sessionStorage.getItem("selectedExerciseId");
  if (selectedExerciseId) {
    try {
      const response = await axios.get(
        `${serverUrl}/questions/questions/${selectedExerciseId}`
      );
      const questions = response.data;

      return questions;
    } catch (error) {
      console.error("Error fetching Questions:", error);
    }
  }
}

export default class QuestionsAnswering extends Phaser.Scene {
  constructor() {
    super({ key: "QuestionsAnswering" });
    this.timerRunning = true; // Initialize the timer as running
    this.timerEvent = null; // Declare timerEvent
  }

  preload() {
    this.load.image("sky", skyBackground);
    this.load.image("mountain", mountainBackground);
    this.load.image("longGrass", longGrassBackground);

    this.load.audio("right_answer", right_answer);
    this.load.audio("wrong_answer", wrong_answer);
  }

  async create() {
    const audioState = sessionStorage.getItem("audioState");

    this.right_answer = this.sound.add("right_answer");
    this.wrong_answer = this.sound.add("wrong_answer");

    this.createBackgroundLayers();
    questions = await fetchQuestions();

    // Preload question images after questions are fetched
    questions.forEach((question) => {
      if (question.questionImage) {
        this.load.image(
          question.questionId,
          `${serverUrl}/uploads/questions/${question.questionImage}`
        );
      }
    });

    // Start preloading and execute callback when preloading is complete
    this.load.once("complete", () => {
      // Continue with the rest of the scene initialization
      if (questions.length > 0) {
        this.createContainers();
        this.displayQuestion(questions[currentQuestionIndex], audioState);
        this.startTimer(30); // Start the timer for 30 seconds
      }
    });

    this.load.start(); // Start preloading
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

  createContainers() {
    questionContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 4
    );

    imageContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2 - 70
    );

    answerContainer = this.add.container(
      this.game.config.width / 2,
      (this.game.config.height / 4) * 3 + 20
    );
    this.add.existing(questionContainer);
    this.add.existing(imageContainer);
    this.add.existing(answerContainer);
  }

  displayQuestion(question, audioState) {
    // Log the questionImage of every question entry
    console.log(
      "QUestion ID: " +
        question.questionId +
        "\nQUestion Image: " +
        `${serverUrl}/uploads/questions/` +
        question.questionImage
    );

    if (questionContainer) {
      questionContainer.removeAll(true);
    }
    if (answerContainer) {
      answerContainer.removeAll(true);
    }
    if (imageContainer) {
      imageContainer.removeAll(true);
    }
    // Load and display questionImage
    if (question.questionImage) {
      const questionImage = this.add.image(0, 100, question.questionId);

      // Set a fixed size for the question image
      const fixedHeight = 200; // Replace with your desired height
      questionImage.displayHeight = fixedHeight;

      // Adjust the width according to the aspect ratio
      const aspectRatio = questionImage.width / questionImage.height;
      const fixedWidth = fixedHeight * aspectRatio;
      questionImage.displayWidth = fixedWidth;

      questionImage.setOrigin(0.5);
      imageContainer.add(questionImage);
    }

    const questionText = this.add.text(0, 0, question.question_text, {
      fontFamily: "Comic Sans MS",
      fontSize: "40px",
      fill: "#000",
      wordWrap: { width: 700, useAdvancedWrap: true },
    });
    questionText.setOrigin(0.5, 0);

    // Add hover effect for questionText
    questionText.setInteractive();
    questionText.on("pointerover", () => {
      questionText.setAlpha(0.8);
      if (audioState === "On") {
        responsiveVoice.speak(questionText.text, "Filipino Female");
      }
    });

    // Remove hover effect for questionText
    questionText.on("pointerout", () => {
      questionText.setAlpha(1);
    });

    question.answer_choices.forEach((choice, index) => {
      const answerText = this.add.text(0, 0, choice, {
        fontFamily: "Comic Sans MS",
        fontSize: "52px",
        fill: "#fff",
        padding: 10,
        backgroundColor: "#000",
        wordWrap: { width: 150, useAdvancedWrap: true },
      });
      answerText.setOrigin(0.5, 0.5);
      answerText.setInteractive();

      answerText.on("pointerover", () => {
        answerText.setAlpha(0.8);
        answerText.setBackgroundColor("#fff");
        answerText.setFill("#000");
        if (audioState === "On") {
          responsiveVoice.speak(
            answerText.text,
            "Spanish Latin American Female"
          );
        }
      });

      answerText.on("pointerout", () => {
        answerText.setAlpha(1);
        answerText.setBackgroundColor("#000");
        answerText.setFill("#fff");
      });

      answerText.removeAllListeners("pointerdown");

      answerText.on("pointerdown", () => {
        this.timerRunning = false;
        console.log("Remaining time: " + remainingTime);

        let pointsEarned = 0;

        if (choice === question.correct_answer) {
          if (remainingTime >= 21 && remainingTime <= 30) {
            pointsEarned = 3;
          } else if (remainingTime >= 11 && remainingTime <= 20) {
            pointsEarned = 2;
          } else if (remainingTime >= 1 && remainingTime <= 10) {
            pointsEarned = 1;
          }

          userScore += pointsEarned;

          console.log(
            `Correct answer! You earned ${pointsEarned} points. Total score: ${userScore}`
          );

          if (audioState === "On") {
            this.right_answer.play();
          }
        } else {
          console.log("Incorrect answer.");
          if (audioState === "On") {
            this.wrong_answer.play();
          }
        }
        if (this.timerEvent) {
          this.timerEvent.remove(); // Stop the timer event if it exists
        }

        this.displayCountdownAndNextQuestion(audioState);
      });

      answerText.x = (index - (question.answer_choices.length - 1) / 2) * 200;
      answerContainer.add(answerText);
    });

    questionContainer.add(questionText);
  }

  startTimer(seconds) {
    const timerText = this.add.text(
      this.game.config.width - 10,
      10,
      `Time Left: ${seconds}`,
      {
        fontFamily: "Arial",
        fontSize: "48px",
        fill: "#fff",
        backgroundColor: "#000",
      }
    );
    timerText.setOrigin(1, 0);

    this.timerEvent = this.time.addEvent({
      // Assign timer event to this.timerEvent
      delay: 1000,
      callback: () => {
        if (this.timerRunning) {
          // Check if the timer is running
          seconds--;
          remainingTime = seconds; // Update remaining time

          timerText.setText(`Time Left: ${seconds}`);
          if (seconds <= 10) {
            // Change the color to red if 10 seconds or less
            timerText.setBackgroundColor("#ff0000");
            // Apply growing and shaking animation
            this.tweens.add({
              targets: timerText,
              scaleX: 1.5,
              scaleY: 1.5,
              duration: 200,
              ease: "Power2",
              yoyo: true,
              repeat: 1,
            });
          }

          if (seconds === 0) {
            timerText.setText("Time Left: 0");
            this.timerEvent.remove();
            this.displayCountdownAndNextQuestion();
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  displayCountdownAndNextQuestion(audioState) {
    // Create a transparent overlay to block interactions
    const overlay = this.add.rectangle(
      this.game.config.width / 2,
      this.game.config.height / 2,
      this.game.config.width,
      this.game.config.height,
      0x000000,
      0
    );
    overlay.setInteractive(); // Enable interaction with the overlay

    const countdownText = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "3",
      {
        fontFamily: "Arial",
        fontSize: "500px",
        fill: "#fff",
        backgroundColor: "#1f1f1f",
      }
    );
    countdownText.setOrigin(0.5);

    let countdown = 3;
    const countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        countdown--;
        countdownText.setText(countdown.toString());

        if (countdown === 0) {
          countdownText.destroy();
          countdownTimer.destroy();
          overlay.destroy(); // Remove the overlay to enable interactions

          this.displayNextQuestion(audioState);
          this.timerRunning = true; // Resume the timer when the countdown is over
        }
      },
      callbackScope: this,
      repeat: 2, // repeat 3 times for 3 seconds (3 - 1)
    });
  }

  displayNextQuestion(audioState) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      this.displayQuestion(questions[currentQuestionIndex], audioState);
    } else {
      console.log("End of the questions.");
      console.log("Total Score: " + userScore);
      this.registry.set("score", userScore);
      this.cameras.main.fadeOut(500);
      this.cameras.main.on("camerafadeoutcomplete", () => {
        this.scene.start("GameOver", { score: userScore });
      });
    }
    this.startTimer(30); // Start a 30-second timer for each question display
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
