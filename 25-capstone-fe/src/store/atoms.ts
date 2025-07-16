import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  LayoutStatus,
  SeatLayout,
  SeatStatus,
  UnassignedModule,
} from "../lib/schemas";

export const layoutsAtom = atom<SeatLayout[]>([]);
export const seatStatusAtom = atom<SeatStatus[]>([]);
export const selectedLayoutIdAtom = atom<string | null>(null);
export const selectedSeatIdAtom = atom<string | null>(null);

export const unassignedModulesAtom = atom<UnassignedModule[]>([]);
export const editModeAtom = atomWithStorage<boolean>("seatEditMode", false);

export const selectedLayoutAtom = atom((get) => {
  const selectedId = get(selectedLayoutIdAtom);
  const statuses = get(layoutsAtom);

  if (!selectedId) return null;

  return statuses.find((status) => status.id === selectedId) || null;
});
