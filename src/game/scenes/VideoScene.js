import Phaser from "phaser";
import axios from "axios";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

export async function fetchVideo() {
  const selectedLessonId = sessionStorage.getItem("selectedLessonId");

  if (!selectedLessonId) {
    console.error("No selected lesson ID found in sessionStorage");
    return null;
  }

  try {
    const response = await axios.get(
      `${serverUrl}/lessons/view/${selectedLessonId}`
    );
    const lesson = response.data;

    if (!lesson) {
      console.error("Lesson not found");
      return null;
    }

    return `${serverUrl}/uploads/lessons/${lesson.lessonVideo}`;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}

export default class VideoScene extends Phaser.Scene {
  constructor() {
    super({ key: "VideoScene" });
  }

  async create() {
    const videoUrl = await fetchVideo();
    console.log("Video URL:", videoUrl);

    if (videoUrl) {
      // Create a video game object
      const video = this.add.video(400, 300, videoUrl);

      // Listen for the 'complete' event, triggered when the video ends
      video.on("complete", function (video) {
        console.log("Video completed");
      });

      // Play the video
      video.play();
    } else {
      console.error("Failed to load video");
    }
  }
}
