import React, { useEffect, useLayoutEffect, useState } from "react";
import lines from "./data/lines.json";
import bgimg from "./assets/bg.jpg";
import './App.css';  // For custom styles

const App = () => {
  const [text, setText] = useState("");
  const [finalText, setFinalText] = useState([]);
  const [inputText, setInputText] = useState("");
  const [time, setTime] = useState(60);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useLayoutEffect(() => {
    placeData();
  }, []);

  const restart = () => {
    placeData();
  };

  const placeData = () => {
    let randomIndex = Math.floor(Math.random() * lines.length);
    setText(lines[randomIndex].text);
    setFinalText(Array.from(lines[randomIndex].text));
    setTime(60);
    setMistakes(0);
    setInputText("");
    setIsRunning(false);
    setWpm(0);
    setCpm(0);
  };

  useEffect(() => {
    if (time > 0 && isRunning) {
      const timer = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      endTest();
    }
  }, [time, isRunning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      if (!isRunning) {
        setIsRunning(true);
      }
      if (e.key === "Backspace") {
        if (inputText.length === 0) return;
        setInputText((prevInputText) => prevInputText.slice(0, -1));
      } else if ((e.key.length === 1 && e.key.match(/[a-z0-9]/i)) || e.key === " " || e.key === "." || e.key === ",") {
        setInputText((prevInputText) => prevInputText + e.key);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputText, isRunning]);

  useEffect(() => {
    checkText();
  }, [inputText]);

  const checkText = () => {
    let newMistakes = 0;
    for (let i = 0; i <= inputText.length; i++) {
      if (inputText[i] === text[i] && i < text.length) {
        finalText[i] = (
          <span className="correct-char">{text[i]}</span>
        );
      } else if (i === inputText.length) {
        finalText[i] = (
          <span className="current-char">{text[i]}</span>
        );
      } else {
        finalText[i] = <span className="wrong-char">{text[i]}</span>;
        newMistakes++;
      }
    }
    setMistakes(newMistakes);
    if (inputText.length === text.length) {
      endTest();
    }
  };

  function findwpmandcpm() {
    const wordsTyped = inputText.trim().split(/\s+/).length;
    const charactersTyped = inputText.length;
    const minutesElapsed = (60 - time) / 60;
    if (minutesElapsed > 0) {
      setWpm(Math.round(wordsTyped / minutesElapsed));
      setCpm(Math.round(charactersTyped / minutesElapsed));
    }
  }

  const endTest = () => {
    setIsRunning(false);
    findwpmandcpm();
  };

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `url(${bgimg})` }}>
      <div className="flex flex-col items-center justify-between min-h-screen">
        <div className="stats-container flex flex-row justify-around w-[90%] mt-8 p-4 bg-white bg-opacity-50 rounded-lg shadow-lg">
          <div>Time Left: {time}</div>
          <div>Mistakes: {mistakes}</div>
          <div>WPM: {wpm}</div>
          <div>CPM: {cpm}</div>
        </div>

        <div className="typing-area bg-white w-[80%] lg:w-[60%] p-8 rounded-2xl shadow-xl bg-opacity-80 text-2xl text-center my-10">
          <div className="text-content">
            {finalText.map((element, index) => (
              <span key={index}>{element}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center mb-12">
          <button
            onClick={restart}
            className="try-again-btn px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 hover:scale-105 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
