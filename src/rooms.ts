import entranceImage from './assets/rooms/entrance.jpg';
import hallwayImage from './assets/rooms/hallway.jpg';
import loungeImage from './assets/rooms/lounge.jpg';
import kitchenImage from './assets/rooms/kitchen.jpg';
import bathroomImage from './assets/rooms/bathroom.jpg';
import singleBedroomImage from './assets/rooms/single_bedroom.jpg';

export interface Hotspot {
    cx: number;
    cy: number;
    /** If set, clicking this hotspot opens the matching alert from the registry. */
    alertId?: string;
    /** If set, clicking this hotspot navigates to the given room instead of opening an alert. */
    navigateTo?: string;
}

export interface Room {
    id: string;
    name: string;
    image: string;
    hotspots: Hotspot[];
    previousRoomId?: string;
    nextRoomId?: string;
}

export const rooms: Room[] = [
    {
        id: 'single_bedroom',
        name: 'Single Bedroom',
        image: singleBedroomImage,
        nextRoomId: 'hallway',
        hotspots: [
            { alertId: 'computer', cx: 1690, cy: 360 },
            { alertId: 'books', cx: 1250, cy: 455 },
            { alertId: 'canister', cx: 1083, cy: 658 },
            { alertId: 'clock', cx: 1470, cy: 168 },
            { alertId: 'poster', cx: 86, cy: 179 },
            { alertId: 'rug', cx: 961, cy: 910 },
        ],
    },
    {
        id: 'hallway',
        name: 'Hallway',
        image: hallwayImage,
        hotspots: [
            { cx: 425, cy: 630, navigateTo: 'single_bedroom' },
            { cx: 1650, cy: 550, navigateTo: 'bathroom' },
            { alertId: 'hallway_painting', cx: 1047, cy: 423 },
        ],
        nextRoomId: 'kitchen',
    },
    {
        id: 'bathroom',
        name: 'Bathroom',
        image: bathroomImage,
        hotspots: [
            { alertId: 'toothbrush_holder', cx: 388, cy: 451 },
            { alertId: 'medicine_cabinet', cx: 262, cy: 271 },
        ],
        nextRoomId: 'hallway',
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        image: kitchenImage,
        hotspots: [
            { alertId: 'spice_rack', cx: 1404, cy: 404 },
            { alertId: 'kitchen_drawer', cx: 853, cy: 657 },
            { alertId: 'toaster', cx: 279, cy: 586 },
        ],
        previousRoomId: 'hallway',
        nextRoomId: 'lounge',
    },
    {
        id: 'lounge',
        name: 'Lounge',
        image: loungeImage,
        hotspots: [
            { alertId: 'safe', cx: 90, cy: 768 },
            { alertId: 'remote', cx: 966, cy: 719 },
            { alertId: 'plant', cx: 401, cy: 534 },
            { alertId: 'cookies', cx: 801, cy: 650 },
            { alertId: 'couch', cx: 1319, cy: 523 },
        ],
        previousRoomId: 'kitchen',
        nextRoomId: 'entrance',
    },
    {
        id: 'entrance',
        name: 'Entrance',
        image: entranceImage,
        hotspots: [
            { alertId: 'door', cx: 990, cy: 558 },
            { alertId: 'painting', cx: 353, cy: 467 },
            { alertId: 'drawer', cx: 1300, cy: 715 },
            { alertId: 'flower_pot', cx: 1333, cy: 381 },
            { alertId: 'boots', cx: 1098, cy: 834 },
            { alertId: 'key_bowl', cx: 1391, cy: 595 },
        ],
        previousRoomId: 'lounge',
    },
];

export const roomsById = new Map(rooms.map(r => [r.id, r]));
