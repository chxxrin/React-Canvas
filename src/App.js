import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushType, setBrushType] = useState("pen");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [eraserMode, setEraserMode] = useState(false);

  const startDrawing = (e) => {
    if (e.button === 2) { // Right-click triggers eraser mode
      setEraserMode(true);
    } else {
      setEraserMode(false);
    }

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    if (eraserMode) {
      ctx.strokeStyle = "#FFFFFF"; // White color for eraser
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    } else {
      switch (brushType) {
        case "pen":
          ctx.strokeStyle = brushColor;
          ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          ctx.stroke();
          break;

        case "pencil":
          ctx.strokeStyle = `${brushColor}80`;
          ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          ctx.stroke();
          break;

        case "brush-pen":
          ctx.strokeStyle = brushColor;
          ctx.lineWidth = brushSize * 2;
          ctx.lineJoin = "round";
          ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          ctx.stroke();
          break;

        case "spray":
          for (let i = 0; i < 10; i++) {
            const offsetX =
              e.nativeEvent.offsetX +
              (Math.random() - 0.5) * brushSize * 2;
            const offsetY =
              e.nativeEvent.offsetY +
              (Math.random() - 0.5) * brushSize * 2;
            ctx.fillStyle = brushColor;
            ctx.fillRect(offsetX, offsetY, 1, 1);
          }
          break;

        default:
          break;
      }
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const adjustBrushSize = (e) => {
    setBrushSize(Math.round((e.target.value / 100) * 50));
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "drawing.png";
    link.click();
  };

  return (
    <div className="app">
      <h1>Canvas</h1>
      <div className="toolbar">
        <label>
          Brush Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
        </label>
        <div className="brush-size-slider">
          <input
            type="range"
            min="1"
            max="100"
            value={(brushSize / 50) * 100}
            onChange={adjustBrushSize}
          />
          <span>{brushSize}px</span>
        </div>
        <label>
          Brush Type:
          <select
            value={brushType}
            onChange={(e) => setBrushType(e.target.value)}
          >
            <option value="pen">Pen</option>
            <option value="pencil">Pencil</option>
            <option value="spray">Spray</option>
            <option value="paint">Paint</option>
            <option value="brush-pen">Brush Pen</option>
          </select>
        </label>
        <button onClick={saveAsImage}>Save as PNG</button>
      </div>
      <div className="drawing-area">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onContextMenu={(e) => e.preventDefault()} // Disable default right-click menu
        />
      </div>
    </div>
  );
}

export default App;
