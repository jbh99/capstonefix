import React from 'react';
import { getSeatStyles } from '../utils';

interface SeatProps {
  children?: React.ReactNode;
}

const Seat: React.FC<SeatProps> = ( children ) => {

  return (
    <div 
      className="absolute bg-gray-200 border border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
    >
      {children}
    </div>
  );
};

export default Seat;