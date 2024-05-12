import React, { useEffect, useLayoutEffect, useState } from "react";
import lines from "./data/lines.json";
import { set } from "mongoose";

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
  },[]);

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
    if(time === 0){
      endTest();
    }
  },[time, isRunning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      if (!isRunning) {
        setIsRunning(true);
      }
      if (e.key === "Backspace") {
        if (inputText.length === 0) {
          return;
        }
        setInputText((prevInputText) => prevInputText.slice(0, -1));
      } else if ((e.key.length === 1 && e.key.match(/[a-z0-9]/i)) || e.key === " " || e.key === "." || e.key === ",") {
        setInputText((prevInputText) => prevInputText + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    checkText();
    findwpmandcpm();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputText]);

  const checkText = () => {
    for (let i = 0; i <= inputText.length; i++) {
      if (inputText[i] === text[i] && i < text.length) {
        finalText[i] = <span className='rounded-sm bg-green-300'>{text[i]}</span>;
      }
      else if(i == inputText.length ){
        finalText[i] = <span className='rounded-sm bg-yellow-300'>{text[i]}</span>;
      }
      else {
        finalText[i] = <span className='rounded-sm bg-red-300'>{text[i]}</span>;
        setMistakes(mistakes + 1);
      }
    }
    if(inputText.length === text.length){
      endTest();
    }
  };

  function findwpmandcpm(){
    const wordsTyped = (inputText).trim().split(/\s+/).length;
    const charactersTyped = inputText.length;
    const minutesElapsed = (60 - time) / 60;
    if(minutesElapsed > 0){
      setWpm(Math.round(wordsTyped / minutesElapsed));
      setCpm(Math.round(charactersTyped / minutesElapsed));
    }
  }
 const endTest = () => {
  setIsRunning(false);
 };  

  return (
    <div className="flex items-center justify-center h-screen bg-amber-400">
      <div className="flex items-center justify-center bg-white w-[700px] p-6 rounded-2xl shadow-md border-2">
        <div className="flex flex-col items-center justify-center bg-white w-[700px] p-6 rounded-2xl border-2 border-slate-300">
          <div>
          {finalText.map((element, index) => (
  <span key={index}>{element}</span>
))}

          </div>
          <div>
            <br />
          </div>
          <div className="flex flex-row justify-around w-[100%] ">
            <div>Time Left: {time}</div>
            <div>Mistakes: {mistakes}</div>
            <div>WPM: {wpm}</div>
            <div>CPM: {cpm}</div>
            <div>
              <button onClick={restart} className="bg-lime-300 p-1 rounded-md border-2 border-black">Try Again</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
