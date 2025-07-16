import React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/lib/utils";
import {
  selectedSeatIdAtom,
  isSeatOccupiedAtom,
  editModeAtom,
} from "@/store/atoms";

interface SeatItemProps {
  seatId: string;
  seatName: string;
}

export const SeatItem: React.FC<SeatItemProps> = ({ seatId, seatName }) => {
  const isOccupied = useAtomValue(isSeatOccupiedAtom)(seatId);
  const setSelectedSeatId = useSetAtom(selectedSeatIdAtom);
  const editMode = useAtomValue(editModeAtom);

  const handleClick = () => {
    setSelectedSeatId(seatId);
  };

  const seatClasses = cn(
    "w-[80px] h-[80px] flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 ease-in-out",
    isOccupied
      ? "bg-gray-200 text-black"
      : "bg-sky-500 text-white shadow-md scale-105",
    editMode && "ring-2 ring-blue-400 ring-offset-2"
  );

  return (
    <div className={seatClasses} onClick={handleClick}>
      <div className='font-sm'>{seatName}</div>
    </div>
  );
};
