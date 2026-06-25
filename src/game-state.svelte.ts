import type { GameDefinition } from "./engine/types";
import { evaluate } from "./engine/conditions";

// ─── Serialisable game-state shape ──────────────────────────────
// Everything the engine needs to fully reconstruct a game session.
// Per-game flags + inventory + hint progress are stored generically
// so the engine works for any GameDefinition.
export interface GameStateSerialized {
    gameId: string;
    currentRoomId: string;
    showingOutside: boolean;
    inventory: string[];
    flags: Record<string, boolean>;
    /** objectiveId -> number of hints currently revealed. */
    hintLevels: Record<string, number>;
    /** Per-sliding-puzzle tile arrays (so progress survives reopens). */
    slidingPuzzleStates: Record<string, (number | null)[]>;
    /** Transition keys ("roomId->nextRoomId") whose unlocked next-arrow has been used. */
    nextArrowsClicked: string[];
    elapsedMs: number;
}

const EMPTY_SERIALIZED: GameStateSerialized = {
    gameId: "",
    currentRoomId: "",
    showingOutside: false,
    inventory: [],
    flags: {},
    hintLevels: {},
    slidingPuzzleStates: {},
    nextArrowsClicked: [],
    elapsedMs: 0,
};

// ─── Active game registry ───────────────────────────────────────
// Pluggable so the engine can host multiple games down the road.
// For now there is exactly one definition loaded at boot.
let activeGame: GameDefinition | null = null;

export function setActiveGame(def: GameDefinition): void {
    activeGame = def;
    if (!gameState.gameId || gameState.gameId !== def.id) {
        resetGame();
    }
}

export function getActiveGame(): GameDefinition {
    if (!activeGame) {
        throw new Error("No active game loaded. Call setActiveGame() first.");
    }
    return activeGame;
}

// ─── Reactive singleton ─────────────────────────────────────────
// UI-only fields (activeHotspotId, hintPanelOpen, timer anchor,
// escape total) are not serialised.
export const gameState = $state({
    ...EMPTY_SERIALIZED,
    activeHotspotId: null as string | null,
    activeText: null as string | null,
    hintPanelOpen: false,
    timerStartedAt: Date.now(),
    escapeTotalMs: null as number | null,
});

// ─── Serialization helpers ──────────────────────────────────────
export function toJSON(): GameStateSerialized {
    return {
        gameId: gameState.gameId,
        currentRoomId: gameState.currentRoomId,
        showingOutside: gameState.showingOutside,
        inventory: [...gameState.inventory],
        flags: { ...gameState.flags },
        hintLevels: { ...gameState.hintLevels },
        slidingPuzzleStates: structuredClone(gameState.slidingPuzzleStates),
        nextArrowsClicked: [...gameState.nextArrowsClicked],
        elapsedMs: getCurrentElapsedMs(),
    };
}

export function fromJSON(data: GameStateSerialized): void {
    gameState.gameId = data.gameId;
    gameState.currentRoomId = data.currentRoomId;
    gameState.showingOutside = data.showingOutside;
    gameState.inventory.length = 0;
    gameState.inventory.push(...data.inventory);
    // Replace flag/hint/sliding maps in-place to keep reactivity sound.
    for (const k of Object.keys(gameState.flags)) delete gameState.flags[k];
    Object.assign(gameState.flags, data.flags);
    for (const k of Object.keys(gameState.hintLevels))
        delete gameState.hintLevels[k];
    Object.assign(gameState.hintLevels, data.hintLevels);
    for (const k of Object.keys(gameState.slidingPuzzleStates))
        delete gameState.slidingPuzzleStates[k];
    Object.assign(
        gameState.slidingPuzzleStates,
        structuredClone(data.slidingPuzzleStates),
    );
    gameState.nextArrowsClicked.length = 0;
    gameState.nextArrowsClicked.push(...(data.nextArrowsClicked ?? []));
    gameState.elapsedMs = data.elapsedMs ?? 0;
    gameState.activeHotspotId = null;
    gameState.activeText = null;
    gameState.hintPanelOpen = false;
    gameState.timerStartedAt = Date.now();
    gameState.escapeTotalMs = null;
}

export function resetGame(): void {
    if (!activeGame) return;
    fromJSON({
        ...EMPTY_SERIALIZED,
        gameId: activeGame.id,
        currentRoomId: activeGame.startRoomId,
    });
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
    if (!data) return;
    // Refuse to load a save from a different game (schema drift safety).
    if (activeGame && data.gameId && data.gameId !== activeGame.id) return;
    fromJSON({
        ...EMPTY_SERIALIZED,
        ...data,
        gameId: activeGame?.id ?? data.gameId,
        currentRoomId: data.currentRoomId || activeGame?.startRoomId || "",
    });
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

// ─── Flag helpers ──────────────────────────────────────────────
export function setFlag(id: string, value = true): void {
    gameState.flags[id] = value;
}

export function getFlag(id: string): boolean {
    return gameState.flags[id] === true;
}

// ─── Condition helper ───────────────────────────────────────────
export function check(condition: string | undefined | null): boolean {
    return evaluate(condition, {
        flags: gameState.flags,
        inventory: gameState.inventory,
    });
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
        return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

// ─── Alert / hint UI helpers ────────────────────────────────────
export function openPuzzle(puzzleId: string): void {
    gameState.activeHotspotId = puzzleId;
}

export function closeAlert(): void {
    gameState.activeHotspotId = null;
    gameState.activeText = null;
}

export function openText(text: string): void {
    gameState.activeText = text;
}

export function openHintPanel(): void {
    gameState.hintPanelOpen = true;
}

export function closeHintPanel(): void {
    gameState.hintPanelOpen = false;
}
