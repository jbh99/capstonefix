import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { SeatStatus } from "@/types/seat";

const Seat = ({ seat }: { seat: SeatStatus }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-24 h-24 flex items-center justify-center rounded-lg cursor-pointer",
            seat.occupied ? "bg-red-500" : "bg-green-500"
          )}
        >
          <span className='text-white font-bold'>{seat.seatName}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent></PopoverContent>
    </Popover>
  );
};

export default Seat;
