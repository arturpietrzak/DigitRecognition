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
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    let lastLine = lines[lines.length - 1];

    if (lastLine) {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
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
            width={560}
            height={560}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            className="canvas-stage"
            ref={stageRef}
          >
            <Layer>
              <>
                <Rect x={0} y={0} width={560} height={560} fill="black"></Rect>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke="#fff"
                    strokeWidth={40}
                    lineCap="round"
                    bezier="true"
                  />
                ))}
              </>
            </Layer>
          </Stage>
        </div>
        <div className="drawing-box__target">
          <div className="drawing-box__target__border"></div>
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
