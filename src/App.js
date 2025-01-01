import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushType, setBrushType] = useState("pen");
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [layers, setLayers] = useState([{ id: 1, visible: true, opacity: 1 }]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [myTextureImage, setMyTextureImage] = useState(null);

  const loadTextureImage = () => {
    const image = new Image();
    image.src = 'path/to/your/texture-image.png';
    image.onload = () => setMyTextureImage(image);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (brushType === "paint") {
      floodFill(e.nativeEvent.offsetX, e.nativeEvent.offsetY, brushColor);
    } else {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setDrawing(true);
    }
  };

  const floodFill = (x, y, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const targetColor = getPixelColor(data, x, y, canvas.width);
    const fillColorArray = hexToRGBA(fillColor);

    if (colorsMatch(targetColor, fillColorArray)) {
      return; 
    }

    const stack = [[x, y]];

    while (stack.length) {
      const [currentX, currentY] = stack.pop();

      if (
        currentX >= 0 &&
        currentX < canvas.width &&
        currentY >= 0 &&
        currentY < canvas.height
      ) {
        const currentColor = getPixelColor(data, currentX, currentY, canvas.width);

        if (colorsMatch(currentColor, targetColor)) {
          setPixelColor(data, currentX, currentY, canvas.width, fillColorArray);

          stack.push([currentX + 1, currentY]);
          stack.push([currentX - 1, currentY]);
          stack.push([currentX, currentY + 1]);
          stack.push([currentX, currentY - 1]);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data, x, y, width) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const setPixelColor = (data, x, y, width, color) => {
    const index = (y * width + x) * 4;
    [data[index], data[index + 1], data[index + 2], data[index + 3]] = color;
  };

  const colorsMatch = (color1, color2) => {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    );
  };

  const hexToRGBA = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255,
      255, 
    ];
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    switch (brushType) {
      case "pen":
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
        break;

      case "brush-pen":
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
        break;

      case "pencil":
        ctx.strokeStyle = `${brushColor}80`;
        ctx.lineWidth = brushSize / 2;
        ctx.lineCap = "round";
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
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const image = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    link.click();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = [...history.slice(0, historyIndex + 1), imageData];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.putImageData(history[historyIndex - 1], 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.putImageData(history[historyIndex + 1], 0, 0);
      setHistoryIndex(historyIndex + 1);
    }
  };

  return (
    <div className="app">
      <h1 className="title">Canvas</h1>
      <div className="toolbar">
        <label>
          Brush Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
        </label>
        <label>
          Brush Size:
          <input
            type="number"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </label>
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
        ></canvas>
      </div>
    </div>
  );
}

export default App;
