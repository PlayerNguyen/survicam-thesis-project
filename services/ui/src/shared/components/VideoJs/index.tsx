import React, { useEffect, useRef } from "react";
import videojs from "video.js";
type VideoJsPlayer = any;
type VideoJsPlayerOptions = any;

import "video.js/dist/video-js.css";

type VideoJsProps = {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
};

export const VideoJs: React.FC<VideoJsProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("video-js", "vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady?.(player);

        player.on("loadedmetadata", () => {
          const duration = player.duration();
          console.log("Duration of the video:", duration);

          if (duration && duration !== Infinity) {
            player.currentTime(duration - 0.04); // Seek to the last frame
          }
        });
      }));
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(options.autoplay ?? false);
      player.src(options.sources ?? []);
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJs;
