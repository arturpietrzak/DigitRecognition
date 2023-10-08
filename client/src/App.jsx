import { useState } from "react";
import DrawingBox from "./components/DrawingBox";

function App() {
  const [response, setResponse] = useState(null);

  const resizeImage = (base64) => {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = base64;

      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = 28;
        canvas.height = 28;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 28, 28);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
    });
  };

  const handleCheck = async (base64) => {
    const resizedBase64 = await resizeImage(base64);

    fetch("/api/classify_number", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: resizedBase64,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setResponse({
          prediction: res.prediction,
          probability: res.probability,
        });
      });
  };

  return (
    <main className="page-container">
      <DrawingBox onCheck={handleCheck} />
      {response && (
        <div>
          Predicted number is {response.prediction} with{" "}
          {Math.round(response.probability * 10000) / 100}% certainty
        </div>
      )}
    </main>
  );
}

export default App;
