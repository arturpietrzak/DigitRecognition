import { useState } from "react";
import DrawingBox from "./components/DrawingBox";

function App() {
  const [response, setResponse] = useState(null);
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
          setResponse(null);
          console.log(response);
        }
      });
  };

  return (
    <main className="page-container">
      <DrawingBox onCheck={handleCheck} />
    </main>
  );
}

export default App;
