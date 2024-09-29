"use client";

import "./styles.css";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

interface TextBox {
  x: number;
  y: number;
  text: string;
  id: number;
}

const Drawer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [currentTextBox, setCurrentTextBox] = useState<TextBox | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (context) {
      setDrawing(true);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && context) {
      const { offsetX, offsetY } = e.nativeEvent;
      if (tool === "pencil") {
        context.lineTo(offsetX, offsetY);
        context.stroke();
      } else if (tool === "eraser") {
        context.clearRect(offsetX - 10, offsetY - 10, 20, 20);
      }
    }
  };

  const stopDrawing = () => {
    if (drawing && context) {
      setDrawing(false);
      context.closePath();
    }
  };

  const changeTool = (newTool: "pencil" | "eraser") => {
    setTool(newTool);
  };

  const addTextBox = () => {
    const newBox: TextBox = {
      x: 100,
      y: 100,
      text: "Your text here",
      id: Date.now(),
    };
    setTextBoxes((prevBoxes) => [...prevBoxes, newBox]);
  };

  const updateText = (id: number, newText: string) => {
    const updatedBoxes = textBoxes.map((box) =>
      box.id === id ? { ...box, text: newText } : box
    );
    setTextBoxes(updatedBoxes);
  };

  const startDragging = (
    box: TextBox,
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    setCurrentTextBox(box);
    const { clientX, clientY } = e;
    setOffset({ x: clientX - box.x, y: clientY - box.y });
  };

  const dragTextBox = (e: React.MouseEvent<HTMLInputElement>) => {
    if (currentTextBox && offset) {
      const { clientX, clientY } = e;
      const updatedBox: TextBox = {
        ...currentTextBox,
        x: clientX - offset.x,
        y: clientY - offset.y,
      };
      const updatedBoxes = textBoxes.map((box) =>
        box.id === currentTextBox.id ? updatedBox : box
      );
      setTextBoxes(updatedBoxes);
    }
  };

  const stopDragging = () => {
    setCurrentTextBox(null);
    setOffset(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setTextBoxes([]);
    }
  };

  return (
    <div className="drawer-container">
      <div className="toolbar">
        <button className="tool-button" onClick={() => changeTool("pencil")}>
          <Image alt="pencil" src={"/pencil-icon.png"} width={50} height={50} />
        </button>
        <button className="tool-button" onClick={() => changeTool("eraser")}>
          <Image alt="eraser" src={"/eraser-icon.png"} width={50} height={50} />
        </button>
        <button className="tool-button" onClick={addTextBox}>
          <Image
            alt="textbox"
            src={"/add-textbox-icon.png"}
            width={50}
            height={50}
          />
        </button>
        <button className="tool-button" onClick={clearCanvas}>
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="canvas"
      />
      {textBoxes.map((box) => (
        <input
          key={box.id}
          className="text-box"
          style={{ left: box.x, top: box.y }}
          value={box.text}
          onChange={(e) => updateText(box.id, e.target.value)}
          onMouseDown={(e) => startDragging(box, e)}
          onMouseMove={dragTextBox}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        />
      ))}
    </div>
  );
};

export default Drawer;
