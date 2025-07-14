import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { getLLMResponse } from "../utils/openai";

const SentimentChat = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");
  const [message, setMessage] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [loading, setLoading] = useState(false);
  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);
  // Start webcam
  useEffect(() => {
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
        });
    };
    startVideo();
  }, []);
  // Detect expression
  useEffect(() => {
    let interval;
    const detect = async () => {
      if (
        videoRef.current &&
        faceapi.nets.tinyFaceDetector.params &&
        faceapi.nets.faceExpressionNet.params
      ) {
        const detections = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();
        if (detections && detections.expressions) {
          // Get the expression with the highest probability
          const sorted = Object.entries(detections.expressions).sort(
            (a, b) => b[1] - a[1]
          );
          setExpression(sorted[0][0]);
        }
      }
    };
    interval = setInterval(detect, 1000);
    return () => clearInterval(interval);
  }, []);
  // Handle user message submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLlmResponse("");
    try {
      const prompt = `The user looks ${expression}. Respond to their message accordingly.\nUser: ${message}\nAI:`;
      const response = await getLLMResponse(prompt);
      setLlmResponse(response);
    } catch (err) {
      setLlmResponse("Error getting response from LLM.");
    }
    setLoading(false);
  };
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">Sentiment Chat</h2>
      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="320"
          height="240"
          style={{ borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <div className="mt-2">
          <span className="font-semibold">Detected Expression:</span>{" "}
          <span className="text-blue-600">{expression}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 w-full mb-2"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {llmResponse && (
        <div className="bg-gray-100 p-3 rounded">
          <span className="font-semibold">AI:</span> {llmResponse}
        </div>
      )}
    </div>
  );
};

export default SentimentChat; 