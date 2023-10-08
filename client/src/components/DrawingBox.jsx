import { Stage, Layer, Line, Rect } from "react-konva";
import { useState, useRef } from "react";

// eslint-disable-next-line react/prop-types
const DrawingBox = ({ onCheck }) => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // To draw line
    let lastLine = lines[lines.length - 1];

    if (lastLine) {
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="">
      <div className="drawing-box">
        <div className="drawing-box__canvas">
          <Stage
            width={28}
            height={28}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            className="canvas-stage"
            ref={stageRef}
          >
            <Layer>
              <>
                <Rect x={0} y={0} width={28} height={28} fill="black"></Rect>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke="#fff"
                    strokeWidth={1}
                    lineCap="round"
                  />
                ))}
              </>
            </Layer>
          </Stage>
        </div>
      </div>
      <div className="drawing-box__buttons">
        <button
          onClick={() => {
            setLines([]);
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            onCheck(stageRef.current.toDataURL());
          }}
        >
          Check
        </button>
      </div>
    </div>
  );
};

export default DrawingBox;
