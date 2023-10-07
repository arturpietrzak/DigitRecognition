import { useState } from "react";
import DrawingBox from "./components/DrawingBox";

function App() {
  const [response, setResponse] = useState(null);
  const handleCheck = (base64) => {
    fetch("/classify_number", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setResponse({
          prediction: res.prediction,
          probability: res.probability,
        });
        console.log(res);
      });
  };

  return (
    <main className="page-container">
      <DrawingBox onCheck={handleCheck} />
      {response !== null ? response : undefined}
    </main>
  );
}

export default App;
