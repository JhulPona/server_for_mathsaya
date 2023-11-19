import Phaser from "phaser";
import imgLogo from "../assets/images/mathsaya_logo.png";
import audioIntro from "../assets/audios/intro.ogg";
import backgroundImg from "../assets/images/introBackground.png";

class GameIntro extends Phaser.Scene {
  constructor() {
    super({ key: "GameIntro" });
  }

  preload() {
    this.loadImages();
    this.loadAudio();
  }

  loadImages() {
    this.load.image("mathsaya_logo", imgLogo);
    this.load.image("background", backgroundImg);
  }

  loadAudio() {
    this.load.audio("intro", audioIntro);
  }

  create() {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createLogo(width, height);
    this.playIntroMusic();
  }

  createBackground(width, height) {
    const background = this.add
      .image(width / 2, height / 2, "background")
      .setDisplaySize(width, height);
  }

  createLogo(width, height) {
    const imgLogo = this.add
      .image(width / 2, height / 2, "mathsaya_logo")
      .setScale(0.7)
      .setAlpha(0);

    this.createLogoAnimation(imgLogo);
  }

  createLogoAnimation(imgLogo) {
    this.tweens.add({
      targets: imgLogo,
      alpha: 1,
      scale: 0.9,
      duration: 2000,
      ease: "Linear",
      onComplete: () => {
        this.autoTransitionToPlayGame();
      },
    });
  }

  playIntroMusic() {
    const audioIntro = this.sound.add("intro", { loop: false });

    if (!audioIntro.isPlaying) {
      audioIntro.play();
    }
  }

  autoTransitionToPlayGame() {
    const audioIntro = this.sound.get("intro");

    audioIntro.once("complete", () => {
      this.scene.start("TestScreen");
    });
  }
}

export default GameIntro;
