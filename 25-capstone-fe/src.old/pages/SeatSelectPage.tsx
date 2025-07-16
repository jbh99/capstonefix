import React, { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  layoutStatusesAtom,
  seatStatusesAtom,
  editModeAtom,
  selectedLayoutAtom,
} from "@/store/atoms";
import { SeatLayoutGrid } from "@/components/SeatLayout/SeatLayoutGrid";
import { SeatControlPanel } from "@/components/SeatLayout/SeatControlPanel";
import { useGetLayouts, useSeatMetadata, useSeatStatus } from "@/hooks/useApi";
import { useWebSocket } from "@/hooks/useWebSocket";
import { SeatEditForm } from "@/components/SeatLayout/SeatEditForm";

export const SeatSelectPage: React.FC = () => {
  const [editMode, setEditMode] = useAtom(editModeAtom);
  const layouts = useAtomValue(layoutStatusesAtom);
  const layout = useAtomValue(selectedLayoutAtom);
  const seats = useAtomValue(seatStatusesAtom);

  const { isLoading: isLoadingMetadata, error: metadataError } =
    useGetLayouts();
  const { isLoading: isLoadingStatus, error: statusError } = useSeatStatus();

  // Initialize WebSocket connection
  useWebSocket();

  // Disable edit mode when navigating to this page
  useEffect(() => {
    setEditMode(false);
  }, [setEditMode]);

  if (isLoadingMetadata || isLoadingStatus) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-lg'>Loading seat data...</div>
      </div>
    );
  }

  if (metadataError || statusError) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-red-500'>
          Error loading seat data. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>{layout?.name}</h1>
        <h3 className='text-3xl font-bold'>{layout?.location}</h3>
        <p className='text-gray-500'></p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-3 overflow-auto'>
          <div className='p-4 border rounded-lg bg-white shadow'>
            <div className='overflow-hidden'>
              <SeatLayoutGrid />
            </div>
          </div>
        </div>

        <div>
          <SeatControlPanel />
          {editMode && <SeatEditForm />}
        </div>
      </div>
    </div>
  );
};
