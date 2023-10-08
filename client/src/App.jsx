import { useState } from "react";
import DrawingBox from "./components/DrawingBox";

function App() {
  const [response, setResponse] = useState(null);
  const handleCheck = (base64) => {
    fetch("/classify_number", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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
          setResponse(null);
        }
      });
  };

  return (
    <main className="page-container">
      <DrawingBox onCheck={handleCheck} />
      {response !== null ? (
        <div>
          Predicted number is {String(response.prediction)} with{" "}
          {String(response.probability)}% certainty
        </div>
      ) : undefined}
    </main>
  );
}

export default App;
