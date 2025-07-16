import React from "react";
import { useAtomValue } from "jotai";
import { SeatItem } from "./SeatItem";
import { selectedLayoutAtom } from "@/store/atoms";

export const SeatLayoutGrid: React.FC = () => {
  const currentLayout = useAtomValue(selectedLayoutAtom);

  if (!currentLayout) {
    return (
      <div className='flex items-center justify-center h-96'>
        Loading layout...
      </div>
    );
  }

  return (
    <div
      className='flex flex-wrap gap-8 justify-center border-gray-200 rounded-lg bg-gray-50'
      style={{
        margin: "0 auto",
        padding: "40px",
      }}
    >
      {currentLayout.seats.map((seat) => (
        <SeatItem
          key={seat.seatId}
          seatId={seat.seatId}
          seatName={seat.seatName}
        />
      ))}
    </div>
  );
};
