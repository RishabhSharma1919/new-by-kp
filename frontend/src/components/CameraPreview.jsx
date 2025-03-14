"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN button
import Draggable from "react-draggable";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const CameraPreview = ({ paintingSrc }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [paintingSize, setPaintingSize] = useState(200);
  const [wallDetected, setWallDetected] = useState(false);
  const [paintingPosition, setPaintingPosition] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
    loadModel();
  }, []);

  const loadModel = async () => {
    const model = await cocoSsd.load();
    detectObjects(model);
  };

  const detectObjects = async (model) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !canvas) return;

    setInterval(async () => {
      if (!video.paused && !video.ended) {
        const predictions = await model.detect(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let wallFound = false;
        predictions.forEach((prediction) => {
          if (prediction.class === "wall") {
            wallFound = true;
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            ctx.fillRect(x, y, width, height);

            // Set painting position inside detected wall
            setPaintingPosition({ x: x + width / 4, y: y + height / 4 });
          }
        });

        setWallDetected(wallFound);
      }
    }, 500);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
      {/* Camera Feed (Reduced Height) */}
      <div className="relative w-full h-1/2 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute w-full h-full object-cover top-0 left-0 right-0 mx-auto"
        />
        <canvas ref={canvasRef} className="absolute w-full h-full" />
      </div>

      {/* Painting Overlay (Draggable only if wall is detected) */}
      {paintingSrc && wallDetected && (
        <Draggable defaultPosition={paintingPosition}>
          <img
            src={paintingSrc}
            alt="Painting"
            className="absolute cursor-move"
            style={{ width: `${paintingSize}px` }}
          />
        </Draggable>
      )}

      {/* UI Controls */}
      <div className="absolute bottom-4 flex gap-2 bg-white p-3 rounded-lg shadow-lg">
        {wallDetected ? (
          <p className="text-green-500">Wall detected! You can place the painting.</p>
        ) : (
          <p className="text-red-500">No wall detected. Move the camera.</p>
        )}
        <input
          type="range"
          min="100"
          max="400"
          value={paintingSize}
          onChange={(e) => setPaintingSize(Number(e.target.value))}
          className="w-32"
        />
      </div>
    </div>
  );
};

export default CameraPreview;
