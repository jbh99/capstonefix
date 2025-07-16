import React from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  selectedSeatAtom,
  editModeAtom,
  selectedSeatIdAtom,
} from "@/store/atoms";
import { useUpdateSeatStatus } from "@/hooks/useApi";

export const SeatControlPanel: React.FC = () => {
  const [editMode, setEditMode] = useAtom(editModeAtom);
  const selectedSeat = useAtomValue(selectedSeatAtom);
  const setSelectedSeatId = useSetAtom(selectedSeatIdAtom);
  const { mutate: updateStatus } = useUpdateSeatStatus();

  const handleToggleOccupation = () => {
    if (selectedSeat) {
      updateStatus({
        seatId: selectedSeat.seatId,
        occupied: !selectedSeat.occupied,
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedSeatId(null);
  };

  return (
    <div className='p-4 border rounded-lg shadow-sm bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-medium'>Seat Controls</h3>
        <div className='flex items-center space-x-2'>
          <Switch
            id='edit-mode'
            checked={editMode}
            onCheckedChange={setEditMode}
          />
          <Label htmlFor='edit-mode'>Edit Mode</Label>
        </div>
      </div>

      {selectedSeat ? (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='text-sm font-medium'>Seat ID:</div>
            <div>{selectedSeat.seatId}</div>

            <div className='text-sm font-medium'>Status:</div>
            <div
              className={
                selectedSeat.occupied ? "text-red-500" : "text-green-500"
              }
            >
              {selectedSeat.occupied ? "Occupied" : "Available"}
            </div>

            <div className='text-sm font-medium'>Last Updated:</div>
            <div className='text-xs'>
              {new Date(selectedSeat.lastUpdated).toLocaleString()}
            </div>
          </div>

          <div className='flex space-x-2'>
            <Button
              onClick={handleToggleOccupation}
              variant={selectedSeat.occupied ? "default" : "destructive"}
            >
              {selectedSeat.occupied ? "Mark Available" : "Mark Occupied"}
            </Button>

            <Button variant='outline' onClick={handleClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      ) : (
        <div className='text-center py-4 text-gray-500'>
          Select a seat to view details
        </div>
      )}
    </div>
  );
};
