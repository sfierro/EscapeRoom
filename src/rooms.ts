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
    /** If set, clicking this hotspot shows a simple text popup (no dedicated alert component needed). */
    text?: string;
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
            { text: 'Looks like it\'s time to escape.', cx: 1470, cy: 168 },
            { text: 'A poster of a cat.', cx: 86, cy: 179 },
            { text: 'A colorful rug.', cx: 961, cy: 910 },
            { text: 'A lightly slept in bed.', cx: 472, cy: 512 },
            { text: 'Nothing to see here.', cx: 730, cy: 587 },
        ],
    },
    {
        id: 'hallway',
        name: 'Hallway',
        image: hallwayImage,
        hotspots: [
            { cx: 425, cy: 630, navigateTo: 'single_bedroom' },
            { cx: 1650, cy: 550, navigateTo: 'bathroom' },
            { text: 'An interesting painting of a forest scene.', cx: 1047, cy: 423 },
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
            { text: 'An empty trash can.', cx: 1537, cy: 965 },
            { text: 'An empty drawer.', cx: 607, cy: 843 },
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
            { text: 'It\'s not snack time.', cx: 279, cy: 586 },
            { text: 'A stack of clean plates.', cx: 1333, cy: 275 },
            { text: 'Nothing cooking in the oven.', cx: 1567, cy: 550 },
            { text: 'Someone made soup recently.', cx: 1275, cy: 554 },

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
            { text: 'This plant looks like it\'s getting plenty of sunlight.', cx: 401, cy: 534 },
            { text: 'A plate of chocolate chip cookies.', cx: 801, cy: 650 },
            { text: 'That couch looks comfy.', cx: 1319, cy: 523 },
            { text: 'What a beautiful painting!', cx: 1557, cy: 160 },
            { text: 'Quite the tall lamp.', cx: 1855, cy: 150 },
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
            { text: 'These are pretty flowers!', cx: 1333, cy: 381 },
            { text: 'A pair of muddy boots.', cx: 1098, cy: 834 },
            { text: 'A bowl of keys, but none of them seem to fit the front door.', cx: 1391, cy: 595 },
            { text: 'Nothing under the mat.', cx: 869, cy: 813 },
        ],
        previousRoomId: 'lounge',
    },
];

export const roomsById = new Map(rooms.map(r => [r.id, r]));
