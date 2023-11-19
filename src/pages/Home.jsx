import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

import "../App.css";

export default function Home() {
  const [speaking, setSpeaking] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);

    // You can set a timeout to stop the confetti after a certain duration
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Adjust the duration as needed

    // Clean up the timer when the component unmounts
    return () => clearTimeout(confettiTimer);
  }, []);

  const speakText = (text) => {
    if (!speaking) {
      responsiveVoice.speak(text, "Filipino Female", {
        onend: () => setSpeaking(null),
        cached: true,
      });

      setSpeaking(text);
    }
  };

  const stopSpeaking = () => {
    if (speaking) {
      responsiveVoice.cancel();
      setSpeaking(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      {showConfetti && <Confetti />}

      <div className="mt-8 text-center bg-tertiary shadow-lg p-4 rounded">
        <div className="flex items-center justify-center">
          <img src={Logo} alt="Logo" className="w-40 h-40 md:w-60 md:h-60" />
        </div>
        <h1 className="text-2xl font-semibold ">IKAW BA'Y ...</h1>
        <div className="mt-4 space-y-4 md:space-y-0 md:space-x-4 md:flex">
          <button
            className="bg-secondary px-4 py-2 rounded hover:bg-pink hover:text-black w-full md:w-auto hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            onMouseEnter={() => speakText("Ikaw ba ay isa ka magtutudlo?")}
            onMouseLeave={stopSpeaking}>
            <Link to="/teacherauth">USA KA MAGTUTUDLO?</Link>
          </button>
          <button
            className="bg-secondary px-4 py-2 rounded hover:bg-pink hover:text-black w-full md:w-auto hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            onMouseEnter={() => speakText("Ikaw ba ay isa ka estudyante?")}
            onMouseLeave={stopSpeaking}>
            <Link to="/studentauth">USA KA ESTUDYANTE?</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
