export interface Station {
    id: string;
    name: string;
    type: 'SPKLU' | 'SPBKLU';
    latitude: number;
    longitude: number;
    capacity: number; // Number of chargers
    operator: string;
    created_at: string;
}

export interface CandidateLocation {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    createdAt: Date;
}

export interface LayerState {
    spklu: boolean;
    spbklu: boolean;
    candidates: boolean;
}

export interface SelectedMarker {
    type: 'station' | 'candidate';
    data: Station | CandidateLocation;
}
