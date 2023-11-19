import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Phaser from "phaser";
import GameIntro from "../game/scenes/GameIntro";
import TestScreen from "../game/scenes/TestScreen";
import PlayGame from "../game/scenes/PlayGame";
import YunitsChoices from "../game/scenes/YunitsChoices";
import LessonsChoices from "../game/scenes/LessonsChoices";
import ExercisesChoices from "../game/scenes/ExercisesChoices";
import QuestionsAnswering from "../game/scenes/QuestionsAnswering";
import GameOver from "../game/scenes/GameOver";
import Settings from "../game/scenes/Settings";
import Profile from "../game/scenes/Profile";
import VideoScene from "../game/scenes/VideoScene";

const PhaserGame = ({ setIsPhaserGameActive }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    setShowConfetti(true);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, []);

  useEffect(() => {
    const initializeGame = () => {
      const config = {
        type: Phaser.AUTO,
        parent: "mathsaya_game",
        scene: [
          GameIntro,
          TestScreen,
          PlayGame,
          YunitsChoices,
          LessonsChoices,
          // VideoScene,
          ExercisesChoices,
          QuestionsAnswering,
          GameOver,
          Settings,
          Profile,
        ],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      const game = new Phaser.Game(config);

      const handleResize = () => {
        const isMobileView = window.matchMedia("(max-width: 767px)").matches;
        const currentIsPortrait = window.innerHeight > window.innerWidth;
        setIsMobile(isMobileView);
        setIsPortrait(currentIsPortrait);
        game.scale.refresh();
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return game;
    };

    const gameInstance = initializeGame();
    setIsPhaserGameActive(true);

    return () => {
      gameInstance.destroy(true);
      setIsPhaserGameActive(false);
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsPhaserGameActive]);

  return (
    <>
      {showConfetti && <Confetti />}

      {isMobile && isPortrait ? (
        <div className="text-center p-5">
          <p>
            Please rotate your device to landscape mode for the best experience.
          </p>
        </div>
      ) : null}
      <div id="mathsaya_game" className="w-full h-screen">
        {/* Your Phaser game container */}
      </div>
    </>
  );
};

export default PhaserGame;
