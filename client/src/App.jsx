import { useState } from "react";
import DrawingBox from "./components/DrawingBox";

function App() {
  const [response, setResponse] = useState({});
  const handleCheck = (base64) => {
    fetch("/classify_number", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.probability <= 0.01) {
          setResponse({
            prediction: res.prediction,
            probability: res.probability,
          });
        } else {
          setResponse({});
        }
      });
  };

  return (
    <main className="page-container">
      <DrawingBox onCheck={handleCheck} />
      {response.probability !== undefined ? (
        <div>
          Predicted number is {String(response.prediction)} with{" "}
          {String(response.probability)}% certainty
        </div>
      ) : undefined}
    </main>
  );
}

export default App;
