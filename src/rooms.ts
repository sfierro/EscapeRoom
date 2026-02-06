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
}

export const rooms: Room[] = [
    {
        id: 'entrance',
        name: 'Entrance',
        image: entranceImage,
        hotspots: [
            { id: 'door', cx: 990, cy: 558 },
            { id: 'painting', cx: 350, cy: 460 },
            { id: 'drawer', cx: 1300, cy: 715 }
        ]
    },
    // {
    //     id: 'hallway',
    //     name: 'Hallway',
    //     image: hallwayImage,
    //     hotspots: []
    // },
    // {
    //     id: 'lounge',
    //     name: 'Lounge',
    //     image: loungeImage,
    //     hotspots: []
    // },
    // {
    //     id: 'kitchen',
    //     name: 'Kitchen',
    //     image: kitchenImage,
    //     hotspots: []
    // },
    // {
    //     id: 'dining_kitchen',
    //     name: 'Dining Kitchen',
    //     image: diningKitchenImage,
    //     hotspots: []
    // },
    // {
    //     id: 'bathroom',
    //     name: 'Bathroom',
    //     image: bathroomImage,
    //     hotspots: []
    // },
    // {
    //     id: 'master_bedroom',
    //     name: 'Master Bedroom',
    //     image: masterBedroomImage,
    //     hotspots: []
    // },
    // {
    //     id: 'single_bedroom',
    //     name: 'Single Bedroom',
    //     image: singleBedroomImage,
    //     hotspots: []
    // }
];
