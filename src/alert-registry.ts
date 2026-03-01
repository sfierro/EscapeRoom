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

/**
 * Maps each hotspot `alertId` (from rooms.ts) to its concrete alert component.
 *
 * Text-only hotspots use the `text` field on Hotspot instead and are handled
 * generically in App.svelte — no entry here or dedicated .svelte file needed.
 */
export const alertRegistry: Record<string, Component> = {
    // Entrance
    door: DoorAlert,
    painting: PaintingAlert,
    drawer: DrawerAlert,

    // Single bedroom
    computer: ComputerAlert,
    books: BooksAlert,
    canister: CanisterAlert,

    // Bathroom
    toothbrush_holder: ToothbrushHolderAlert,
    medicine_cabinet: MedicineCabinetAlert,

    // Kitchen
    spice_rack: SpiceRackAlert,
    kitchen_drawer: KitchenDrawerAlert,

    // Lounge
    safe: SafeAlert,
    remote: RemoteAlert,
};
