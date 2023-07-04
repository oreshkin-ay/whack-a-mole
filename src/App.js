import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import "./App.css";

const shuffle = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor(Math.random() * (arr.length - 1 - 0 + 1)) + 0;
    [arr[i], arr[index]] = [arr[index], arr[i]];
  }
  return arr;
};

export default function App() {
  const [fieldFlat, setFieldFlat] = useState(
    new Array(3 * 3).fill(0).map((_, index) => index)
  );
  const [start, setStart] = useState(false);
  const [showed, setShowed] = useState(new Set());
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
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
    setScore((prev) => prev + 1);
  };

  const handleStart = () => {
    setStart(true);
    ref.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          clearInterval(ref.current);
          setStart(false);
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
    <div>
      {!start && <button onClick={handleStart}>start</button>}
      {start && (
        <>
          <p>Time:{time}</p> <p>Score: {score}</p>{" "}
        </>
      )}
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
                      src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.png"
                    />

                    <img
                      alt="12"
                      className="hool"
                      src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.png"
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
