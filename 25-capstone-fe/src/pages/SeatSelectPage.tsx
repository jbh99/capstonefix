import React from "react";
import Seat from "../components/Seat";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useGetLayouts, useGetLayoutSeatStatus } from "@/hooks/useApi";
import {
  currentLayoutAtom,
  layoutsAtom,
  seatStatusAtom,
  selectedLayoutIdAtom,
} from "@/store/atoms";
import { useAtomValue } from "jotai";

export const SeatSelectPage: React.FC = () => {
  const layouts = useAtomValue(layoutsAtom);
  const status = useAtomValue(seatStatusAtom);
  const currentLayoutId = useAtomValue(selectedLayoutIdAtom);

  const { isLoading: isLoadingInit, error: metadataError } = useGetLayouts();
  const { isLoading: isLoadingStatus, error: statusError } =
    useGetLayoutSeatStatus(currentLayoutId);

  useWebSocket();

  if (isLoadingInit || isLoadingStatus) {
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
        <h1 className='text-3xl font-bold'>fill</h1>
        <h3 className='text-md font-bold'>f4</h3>
        <p className='text-gray-500'></p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-3 overflow-auto'>
          <div className='p-4 border rounded-lg bg-white shadow'>
            <div className='overflow-hidden'>
              <div
                className='flex flex-wrap gap-8 justify-center border-gray-200 rounded-lg bg-gray-50'
                style={{
                  margin: "0 auto",
                  padding: "40px",
                }}
              >
                {status.map((seat) => (
                  <Seat key={seat.seatId} seat={seat} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
};
