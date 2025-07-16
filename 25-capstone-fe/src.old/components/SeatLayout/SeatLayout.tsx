import React, { useMemo } from "react";
import SeatMap from "./SeatMap";
import { getSeatBoundingBox } from "./utils";

interface LayoutData {
  layout: Array<{
    row: number;
    col: number;
    x: number;
    y: number;
    w?: number;
    h?: number;
    rx?: number;
    ry?: number;
    r?: number;
  }>;
}

interface SeatLayoutProps {
  layoutData: LayoutData;
  children?: (seat: any) => React.ReactNode;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ layoutData, children }) => {
  const { layout } = layoutData;

  const boundingBox = useMemo(() => {
    return layout
      .map((seat) =>
        getSeatBoundingBox(
          { x: seat.x, y: seat.y },
          { w: seat.w || 1, h: seat.h || 1 },
          { x: seat.rx, y: seat.ry, a: seat.r }
        )
      )
      .reduce(
        ({ x, y }, { max }) => ({
          x: Math.max(x, max.x),
          y: Math.max(y, max.y),
        }),
        { x: 0, y: 0 }
      );
  }, [layout]);

  const wrapperStyle = useMemo(() => {
    return {
      width: `${boundingBox.x}px`,
      height: `${boundingBox.y}px`,
      margin: "0 auto",
      padding: "40px",
    };
  }, [boundingBox]);

  return (
    <div className='relative'>
      <div style={wrapperStyle}>
        <SeatMap seats={layout}>{children}</SeatMap>
      </div>
    </div>
  )
};

export default SeatLayout;
