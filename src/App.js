import { useEffect, useRef, useState } from "react";
import "./App.css";

const API = `https://jsonplaceholder.typicode.com/posts/`;

function App() {
  //state variables for managing text content, error handling, and pause state for fetching
  const [text, setText] = useState();
  const [error, setError] = useState(null);
  const [pauseFetch, setPauseFetch] = useState(false);

  //refs for accessing DOM elements and managing height
  const containerRef = useRef(null);
  const textRef = useRef(null);

  //function to generate a random number
  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  useEffect(() => {
    const textData = async (url) => {
      try {
        //fetching data from the API
        const response = await fetch(`${url}${generateRandomNumber()}`);
        const data = await response.json();

        //frror handeling upon response
        if (!response.ok) {
          //clear text state
          setText(null);
          throw new Error(`${data.message}(${response.status})`);
        }

        if (data) {
          //set fetched text to the state
          setText(data.body);
        }
      } catch (err) {
        //error hadnling with try-catch block
        setError(`fetching fail ${err}`);
      }
    };
    //interval for fetching data periodically
    const interval = setInterval(() => {
      if (!pauseFetch) {
        textData(API);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [text, pauseFetch]);

  //event handlers for pausing and resuming data fetching
  const handleMouseEnter = () => {
    setPauseFetch(true);
  };
  const handleMouseLeave = () => {
    setPauseFetch(false);
  };

  useEffect(() => {
    //update element height when the ref changes
    containerRef.current.style.height = `${textRef.current.offsetHeight}px`;
  }, [text]);

  return (
    <div className="App">
      <div
        ref={containerRef}
        className="container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p ref={textRef}>{text ? text : error}</p>
      </div>
    </div>
  );
}

export default App;
