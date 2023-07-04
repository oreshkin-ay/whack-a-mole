import { useEffect, useRef, useMemo, useState } from "react";
import Confetti from "react-confetti";

import "./App.css";
import { useWindowSize } from "@uidotdev/usehooks";

const shuffle = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor(Math.random() * (arr.length - 1 - 0 + 1)) + 0;
    [arr[i], arr[index]] = [arr[index], arr[i]];
  }
  return arr;
};

const imgMap = {
  0: "oleg.png",
  1: "shelist.png",
  2: "arh.png",
  3: "kate.png",
  4: "or.png",
  5: "kir.png",
  6: "rom.png",

  7: "kate.png",
  8: "shelist.png",
};

const scoreMap = {
  0: -25,
  1: 5,
  2: 5,
  3: -5,
  4: 5,
  5: 5,
  6: 5,
  7: -5,
  8: 5,
};

function App() {
  const { width, height } = useWindowSize();

  const [fieldFlat, setFieldFlat] = useState(
    new Array(3 * 3).fill(0).map((_, index) => index)
  );
  const [start, setStart] = useState(false);
  const [showed, setShowed] = useState(new Set());
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [clicked, setCliked] = useState(null);
  const [showConfetti, setShowConfetti] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!start) return;
    let timerId;
    timerId = setInterval(() => {
      setFieldFlat((prev) => {
        const arr = shuffle(prev);
        setShowed((prev) => {
          const copy = new Set(arr.slice(0, 2));
          return copy;
        });
        return arr;
      });
    }, 2500);

    return () => {
      clearInterval(timerId);
    };
  }, [start]);

  const handleClick = (index) => {
    if (!showed.has(index)) return;

    setShowed((prev) => {
      const copy = new Set(prev);
      copy.delete(index);
      return copy;
    });
    setScore((prev) => prev + scoreMap[index]);
    setCliked(index);
  };

  const handleStart = () => {
    setStart(true);
    setShowConfetti(false);
    setScore(0);

    ref.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          clearInterval(ref.current);
          setStart(false);
          setShowed(new Set());
          setTime(30);
          setCliked(null);
          setShowConfetti(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearInterval(ref.current);
    };
  }, []);

  useEffect(() => {
    if (clicked === 2) {
      const c = Math.floor(Math.random() * 16777215).toString(16);
      document.body.style.backgroundColor = `#${c}14`;
    } else if (clicked === 3 || clicked === 7) {
      const prevScale = document.querySelector("#block").style.transform;

      if (prevScale) {
        let values = prevScale.split("(")[1];
        values = values.split(")")[0];
        values = values.split(".");
        document.querySelector("#block").style.transform = `scale(1.${
          +values[1] + 1
        })`;
      } else {
        document.querySelector("#block").style.transform = `scale(1.1)`;
      }
    }
  }, [clicked]);

  const matrix = useMemo(() => {
    const m = [];
    for (let i = 0; i < fieldFlat.length; i++) {
      const row = Math.floor(i / 3);
      const cell = i % 3;
      m[row] ??= [];
      m[row][cell] = fieldFlat[i];
    }
    return m;
  }, [fieldFlat]);

  return (
    <div className="wrapper">
      {showConfetti && <Confetti width={width} height={height} />}

      {showConfetti && (
        <>
          <h1>С Днем Рождения!</h1>
          <h2>Score: {score}</h2>
        </>
      )}
      {!start && <button onClick={handleStart}>start</button>}
      {start && (
        <>
          <p>Time:{time}</p>
          <div>
            <p>Score: {score}</p>
          </div>
        </>
      )}
      <div id="block" className="block">
        {start &&
          matrix.map((row, rowIndex) => {
            return (
              <div className="row" key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const id = rowIndex * 3 + cellIndex;
                  return (
                    <button
                      key={cellIndex}
                      onClick={() => handleClick(id)}
                      className="cell"
                    >
                      <img
                        alt=""
                        className="item"
                        hidden={!showed.has(id)}
                        id={id}
                        src={imgMap[id]}
                      />
                      <div
                        className={[
                          "score",
                          clicked === id ? "hideMe" : "",
                          scoreMap[clicked] < 0 ? "red" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {clicked === id &&
                          `${scoreMap[clicked] > 0 ? "+" : ""}${
                            scoreMap[clicked]
                          }`}

                        {clicked === id && id === 5 && (
                          <div className={["kir"].filter(Boolean).join(" ")}>
                            <img
                              alt=""
                              className="item"
                              id={id}
                              style={{ height: 38, width: 38 }}
                              src={"vue.png"}
                            />
                          </div>
                        )}
                      </div>

                      <img alt="12" className="hool" src="mole-hill.png" />
                    </button>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
