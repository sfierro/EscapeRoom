// ─── Serialisable game‑state shape ──────────────────────────────
export interface GameStateSerialized {
    currentRoomId: string;
    showingOutside: boolean;
    inventory: string[];
    computerSolved: boolean;
    canisterOpen: boolean;
    toothbrushCollected: boolean;
    toothbrushPlaced: boolean;
    medicineCabinetOpen: boolean;
    safeOpen: boolean;
    tvCorrectChannel: boolean;
    kitchenDrawerOpen: boolean;
    screwdriverCollected: boolean;
    drawerUnlocked: boolean;
    drawerKeyCollected: boolean;
    paintingPried: boolean;
    elapsedMs: number;
}

// ─── Default / initial values ───────────────────────────────────
const DEFAULTS: GameStateSerialized = {
    currentRoomId: 'single_bedroom',
    showingOutside: false,
    inventory: [],
    computerSolved: false,
    canisterOpen: false,
    toothbrushCollected: false,
    toothbrushPlaced: false,
    medicineCabinetOpen: false,
    safeOpen: false,
    tvCorrectChannel: false,
    kitchenDrawerOpen: false,
    screwdriverCollected: false,
    drawerUnlocked: false,
    drawerKeyCollected: false,
    paintingPried: false,
    elapsedMs: 0,
};

// ─── Reactive singleton ─────────────────────────────────────────
// `activeHotspotId` is UI-only (not saved) – it controls which
// alert popup is currently visible.
export const gameState = $state({
    ...DEFAULTS,
    activeHotspotId: null as string | null,
    slidingPuzzleTiles: null as (number | null)[] | null,
    timerStartedAt: Date.now(),
    escapeTotalMs: null as number | null,
});

// ─── Serialization helpers ──────────────────────────────────────
export function toJSON(): GameStateSerialized {
    return {
        currentRoomId: gameState.currentRoomId,
        showingOutside: gameState.showingOutside,
        inventory: [...gameState.inventory],
        computerSolved: gameState.computerSolved,
        canisterOpen: gameState.canisterOpen,
        toothbrushCollected: gameState.toothbrushCollected,
        toothbrushPlaced: gameState.toothbrushPlaced,
        medicineCabinetOpen: gameState.medicineCabinetOpen,
        safeOpen: gameState.safeOpen,
        tvCorrectChannel: gameState.tvCorrectChannel,
        kitchenDrawerOpen: gameState.kitchenDrawerOpen,
        screwdriverCollected: gameState.screwdriverCollected,
        drawerUnlocked: gameState.drawerUnlocked,
        drawerKeyCollected: gameState.drawerKeyCollected,
        paintingPried: gameState.paintingPried,
        elapsedMs: getCurrentElapsedMs(),
    };
}

export function fromJSON(data: GameStateSerialized): void {
    gameState.currentRoomId = data.currentRoomId;
    gameState.showingOutside = data.showingOutside;
    gameState.inventory.length = 0;
    gameState.inventory.push(...data.inventory);
    gameState.computerSolved = data.computerSolved;
    gameState.canisterOpen = data.canisterOpen;
    gameState.toothbrushCollected = data.toothbrushCollected;
    gameState.toothbrushPlaced = data.toothbrushPlaced;
    gameState.medicineCabinetOpen = data.medicineCabinetOpen;
    gameState.safeOpen = data.safeOpen;
    gameState.tvCorrectChannel = data.tvCorrectChannel;
    gameState.kitchenDrawerOpen = data.kitchenDrawerOpen;
    gameState.screwdriverCollected = data.screwdriverCollected;
    gameState.drawerUnlocked = data.drawerUnlocked;
    gameState.drawerKeyCollected = data.drawerKeyCollected;
    gameState.paintingPried = data.paintingPried;
    gameState.elapsedMs = data.elapsedMs ?? 0;
    gameState.activeHotspotId = null;
    gameState.slidingPuzzleTiles = null;
    gameState.timerStartedAt = Date.now();
    gameState.escapeTotalMs = null;
}

export function resetGame(): void {
    fromJSON(DEFAULTS);
}

// ─── Electron IPC wrappers ──────────────────────────────────────
export async function saveGame(): Promise<void> {
    if (!window.api) return;
    gameState.elapsedMs = getCurrentElapsedMs();
    gameState.timerStartedAt = Date.now();
    await window.api.saveGame(toJSON());
}

export async function loadGame(): Promise<void> {
    if (!window.api) return;
    const data = (await window.api.loadGame()) as GameStateSerialized | null;
    if (data) {
        fromJSON(data);
    }
}

// ─── Inventory helpers ──────────────────────────────────────────
export function addToInventory(item: string): void {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
    }
}

export function removeFromInventory(item: string): void {
    const idx = gameState.inventory.indexOf(item);
    if (idx !== -1) {
        gameState.inventory.splice(idx, 1);
    }
}

export function hasItem(item: string): boolean {
    return gameState.inventory.includes(item);
}

// ─── Timer helpers ──────────────────────────────────────────────
export function getCurrentElapsedMs(): number {
    return gameState.elapsedMs + (Date.now() - gameState.timerStartedAt);
}

export function freezeTimer(): void {
    gameState.escapeTotalMs = getCurrentElapsedMs();
}

export function formatElapsedTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

// ─── Close the active alert ────────────────────────────────────
export function closeAlert(): void {
    gameState.activeHotspotId = null;
}
