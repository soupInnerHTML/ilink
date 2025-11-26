import * as React from "react";
import type {ICustomizedLabelProps} from "./types.ts";

export const CustomizedLabel: React.FC<ICustomizedLabelProps> = (props) => {
  const { viewBox, label } = props;

  if (!viewBox) return null;

  return (
    <g>
      <rect
        x={viewBox.x + viewBox.width + 3}
        y={viewBox.y - 6}
        width={60}
        height={15}
        fill="#97FCA6"
        rx="4"
      />
      <text
        x={viewBox.x + viewBox.width + 35}
        y={viewBox.y + 2}
        fill="#000"
        fontSize={10}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label.toFixed(2)}
      </text>
    </g>
  );
};