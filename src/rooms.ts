import entranceImage from './assets/entrance.jpg';
import hallwayImage from './assets/hallway.jpg';
import loungeImage from './assets/lounge.jpg';
import kitchenImage from './assets/kitchen.jpg';
import diningImage from './assets/dining.jpg';
import diningKitchenImage from './assets/dining_kitchen.jpg';
import bathroomImage from './assets/bathroom.jpg';
import masterBedroomImage from './assets/master_bedroom.jpg';
import singleBedroomImage from './assets/single_bedroom.jpg';

export interface Hotspot {
    id: string;
    cx: number;
    cy: number;
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
            { id: 'computer', cx: 1690, cy: 360 },
            { id: 'books', cx: 1250, cy: 455 },
            { id: 'canister', cx: 1083, cy: 658 },
        ],
    },
    {
        id: 'hallway',
        name: 'Hallway',
        image: hallwayImage,
        hotspots: [
            { id: 'bedroom_door', cx: 425, cy: 630 },
            { id: 'bathroom_door', cx: 1650, cy: 550 },
            { id: 'hallway_painting', cx: 1047, cy: 423 },
        ],
        nextRoomId: 'kitchen',
    },
    {
        id: 'bathroom',
        name: 'Bathroom',
        image: bathroomImage,
        hotspots: [
            { id: 'toothbrush_holder', cx: 388, cy: 451 },
            { id: 'medicine_cabinet', cx: 262, cy: 271 },
        ],
        nextRoomId: 'hallway',
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        image: kitchenImage,
        hotspots: [
            { id: 'spice_rack', cx: 1404, cy: 404 },
            { id: 'kitchen_drawer', cx: 853, cy: 657 },
        ],
        previousRoomId: 'hallway',
        nextRoomId: 'lounge',
    },
    {
        id: 'lounge',
        name: 'Lounge',
        image: loungeImage,
        hotspots: [
            { id: 'safe', cx: 90, cy: 768 },
            { id: 'remote', cx: 966, cy: 719 },
        ],
        previousRoomId: 'kitchen',
        nextRoomId: 'entrance',
    },
    {
        id: 'entrance',
        name: 'Entrance',
        image: entranceImage,
        hotspots: [
            { id: 'door', cx: 990, cy: 558 },
            { id: 'painting', cx: 353, cy: 467 },
            { id: 'drawer', cx: 1300, cy: 715 },
            { id: 'flower_pot', cx: 1333, cy: 381 },
            { id: 'boots', cx: 1098, cy: 834 },
            { id: 'key_bowl', cx: 1391, cy: 595 },
        ],
        previousRoomId: 'lounge',
    },
];

export const roomsById = new Map(rooms.map(r => [r.id, r]));

// There is some sort of puzzle on the computer screen (a cat going through a maze and the directions you take are the answer to the directional lock)
// to unlock directional lock oncanister and inside canister is a toothbrush of certain color. the toothbrush holder in the bathroom has 2 toothbrushes and a missing one.
// when you click on the toothbrush holder before you have the toothbrush, it will say "looks like one toothbrush is missing". once you put the missing toothbrush in the holder,
// the order left to right, and each toothbrush has a different number of stripes on it. These 3 numbers help you unlock the medicine cabinet (number lock).
// Inside the medicine cabinet is an array of perscription bottles with different color pills. This will be the order of the 6 spice rack bottles in the kitchen.
// In the kitchen, the spice rack bottles have labels on them. Tumeric, salt, pepper, etc. Each spice label has a number of ounces on it (e.g. tumeric is 2oz, pepper is 1oz etc)
// And the numbers from the labels in the order of the pill bottle colors (left to right) will help you determine the combination of the safe in the living room.
// Inside the safe is a puzzle to determine the channel to turn the TV to. On the TV screen once on the right channel, there will be a series of repeating symbols in a specific order.
// This will give you the key to the symbol lock on the cabinet
// Inside the cabinet is a flathead screwdriver.
// Using the screwdriver on the painting pries off the frame, revealing the sliding puzzle.

// there should also be hotspots on things that you can interact with but don't have to interact with (like the flower pot) and it says "these are pretty flowers!"
// hallway_painting, flower_pot, boots, key_bowl (e.g. you see keys but none of them work on the front door)
