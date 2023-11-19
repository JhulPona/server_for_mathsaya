import React from "react";

const VideoPlayer = ({ videoUrl }) => {
  // Extract video ID from the YouTube URL
  const videoId = getYouTubeVideoId(
    "https://youtu.be/2qunqa4Z61U?si=y4-yv8_C7uI3I28t"
  );

  // Generate the embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title="YouTube Video Player"
        frameBorder="0"
        allowFullScreen></iframe>
    </div>
  );
};

// Function to extract the video ID from a YouTube URL
const getYouTubeVideoId = (url) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\?.*v=|v\/|[^/]+\/|embed\/|[^/]+|$)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

export default VideoPlayer;
