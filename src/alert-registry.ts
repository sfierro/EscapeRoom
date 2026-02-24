import type { Component } from "svelte";

import DoorAlert from "./alerts/door-alert.svelte";
import ComputerAlert from "./alerts/computer-alert.svelte";
import BooksAlert from "./alerts/books-alert.svelte";
import CanisterAlert from "./alerts/canister-alert.svelte";
import ToothbrushHolderAlert from "./alerts/toothbrush-holder-alert.svelte";
import MedicineCabinetAlert from "./alerts/medicine-cabinet-alert.svelte";
import SpiceRackAlert from "./alerts/spice-rack-alert.svelte";
import SafeAlert from "./alerts/safe-alert.svelte";
import RemoteAlert from "./alerts/remote-alert.svelte";
import DrawerAlert from "./alerts/drawer-alert.svelte";
import KitchenDrawerAlert from "./alerts/kitchen-drawer-alert.svelte";
import PaintingAlert from "./alerts/painting-alert.svelte";
import HallwayPaintingAlert from "./alerts/hallway-painting-alert.svelte";
import FlowerPotAlert from "./alerts/flower-pot-alert.svelte";
import BootsAlert from "./alerts/boots-alert.svelte";
import KeyBowlAlert from "./alerts/key-bowl-alert.svelte";
import ClockAlert from "./alerts/clock-alert.svelte";
import PosterAlert from "./alerts/poster-alert.svelte";
import RugAlert from "./alerts/rug-alert.svelte";
import ToasterAlert from "./alerts/toaster-alert.svelte";
import PlantAlert from "./alerts/plant.svelte";
import CookiesAlert from "./alerts/cookies-alert.svelte";
import CouchAlert from "./alerts/couch-alert.svelte";

/**
 * Maps each hotspot `id` (from rooms.ts) to its concrete alert component.
 * Navigation-only hotspots (bedroom_door, bathroom_door) are NOT included
 * because they don't open alerts – they navigate directly.
 */
export const alertRegistry: Record<string, Component> = {
    // Entrance
    door: DoorAlert,
    painting: PaintingAlert,
    drawer: DrawerAlert,
    flower_pot: FlowerPotAlert,
    boots: BootsAlert,
    key_bowl: KeyBowlAlert,

    // Single bedroom
    computer: ComputerAlert,
    books: BooksAlert,
    canister: CanisterAlert,
    clock: ClockAlert,
    poster: PosterAlert,
    rug: RugAlert,

    // Hallway
    hallway_painting: HallwayPaintingAlert,

    // Bathroom
    toothbrush_holder: ToothbrushHolderAlert,
    medicine_cabinet: MedicineCabinetAlert,

    // Kitchen
    spice_rack: SpiceRackAlert,
    kitchen_drawer: KitchenDrawerAlert,
    toaster: ToasterAlert,

    // Lounge
    safe: SafeAlert,
    remote: RemoteAlert,
    plant: PlantAlert,
    cookies: CookiesAlert,
    couch: CouchAlert,
};
