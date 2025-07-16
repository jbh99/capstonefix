export declare class CreateLayoutDto {
    name: string;
    location: string;
    canvasSize: string;
}
export declare class CreateSeatDto {
    seatName: string;
    seatX: number;
    seatY: number;
    layoutId: string;
    moduleId: number;
}
export declare class ReserveSeatDto {
    minutes?: number;
}
