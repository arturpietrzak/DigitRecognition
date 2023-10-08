import { useState } from "react";
import DrawingBox from "./components/DrawingBox";

function App() {
  const [response, setResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);
    const resizedBase64 = await resizeImage(base64);

    fetch("https://digit-recognition-zauj.onrender.com/api/classify_number", {
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
        setIsProcessing(false);
      });
  };

  return (
    <main className="page-container">
      <DrawingBox onCheck={handleCheck} />
      {response && !isProcessing && (
        <div>
          Predicted number <span className="bold">{response.prediction}</span>{" "}
          with{" "}
          <span className="bold">
            {Math.round(response.probability * 10000) / 100}%
          </span>{" "}
          certainty
        </div>
      )}
      {isProcessing && <span className="loader"></span>}
    </main>
  );
}

export default App;
