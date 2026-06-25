// ─── Game Definition Schema ─────────────────────────────────────
// A complete escape-room game is described by a single GameDefinition
// object. The engine knows how to render and play any such object,
// so authoring a new game means writing data, not code.

// ─── Conditions ─────────────────────────────────────────────────
// Conditions reference game state via a tiny mini-language:
//   "flag:foo.bar"  → gameState.flags["foo.bar"] === true
//   "item:key"      → inventory contains "key"
//   "!flag:foo"     → negation
//   "!item:key"     → negation
export type Condition = string;

// ─── Items ──────────────────────────────────────────────────────
export interface ItemDefinition {
    id: string;
    /** Emoji rendered in the inventory slot. */
    emoji: string;
    /** Optional human label for hint/UI text. */
    label?: string;
}

// ─── Hotspots ───────────────────────────────────────────────────
export interface Hotspot {
    cx: number;
    cy: number;
    /** Open the matching puzzle from `puzzles[]`. */
    puzzleId?: string;
    /** Show a passive text popup. */
    text?: string;
    /** Navigate to another room. */
    navigateTo?: string;
}

// ─── Rooms ──────────────────────────────────────────────────────
export interface RoomExit {
    roomId: string;
    /** Optional gate – player can only proceed when this condition is true. */
    requires?: Condition;
}

export interface Room {
    id: string;
    name: string;
    image: string;
    hotspots: Hotspot[];
    /** Forward navigation (right arrow). */
    next?: RoomExit;
    /** Backward navigation (left arrow). Usually has no gate. */
    previous?: RoomExit;
}

// ─── Locks (interactive inputs) ─────────────────────────────────
export type LockConfig =
    | { kind: "password"; answer: string }
    | { kind: "number"; digits: number; answer: string }
    | { kind: "symbol"; slots: number; answer: string[] }
    | { kind: "directional"; answer: string }
    | {
          kind: "remote";
          answer: string;
          maxDigits: number;
          remoteImage: string;
      };

// ─── Rewards (what shows up after solving / using an item) ──────
export type RewardConfig =
    | { kind: "clue"; image?: string; text?: string; imageClass?: string }
    | {
          kind: "give_item";
          item: string;
          emoji: string;
          text: string;
          buttonText: string;
          emptyText: string;
          /** Flag set when the player picks the item up. */
          collectedFlag: string;
      }
    | {
          kind: "sliding_puzzle";
          image: string;
          cols: number;
          rows: number;
          seed: number;
          imageWidth?: number;
          imageHeight?: number;
          text?: string;
      }
    | {
          kind: "tv_symbols";
          tvImage: string;
          /** Sequence of symbol names from the symbol palette. */
          sequence: string[];
      }
    | {
          /** Player wins. Engine freezes the timer and shows the outside image. */
          kind: "escape";
      };

// ─── Puzzle (anything you can interact with from a hotspot) ─────
export interface PuzzleConfig {
    id: string;

    /** Plain-text prompt shown above the interaction. */
    prompt?: string;

    /** Pure passive clue. Either this OR lock OR use must be set. */
    clue?: { image?: string; text?: string; imageClass?: string };

    /** Lock-based puzzle. */
    lock?: LockConfig;

    /** Use-an-item-from-inventory puzzle. */
    use?: {
        requires: string;
        consumesItem: boolean;
        useEmoji?: string;
        useText: string;
        useButtonText: string;
        /** Shown when the player doesn't have the required item. */
        lockedText?: string;
        /** Optional image shown alongside the use button (e.g. toothbrush holder). */
        previewImage?: string;
        previewImageClass?: string;
    };

    /**
     * Flag flipped to true when the puzzle's primary interaction succeeds
     * (lock unlocked OR item used). Required if `lock` or `use` is set.
     */
    solvedFlag?: string;

    /** What happens after the solvedFlag becomes true. */
    reward?: RewardConfig;
}

// ─── Objectives (drive the hint system) ─────────────────────────
export interface ObjectiveConfig {
    id: string;
    /** Optional human title, surfaced in the hint UI header. */
    title?: string;
    /** Condition that, when true, marks this objective complete. */
    completedWhen: Condition;
    /** Ordered list – revealed one at a time when the player clicks the hint button. */
    hints: string[];
}

// ─── Top-level game definition ──────────────────────────────────
export interface GameDefinition {
    /** Stable identifier (used for save-file scoping). */
    id: string;
    /** Display title – e.g. "Midnight Lock Game Presents: Escape from the House". */
    title: string;
    /** Room the player starts in. */
    startRoomId: string;
    /** Image used when the player has escaped. */
    outsideImage: string;
    /** All items the game uses (inventory rendering). */
    items: ItemDefinition[];
    rooms: Room[];
    puzzles: PuzzleConfig[];
    /** Linear list of objectives in play order. Drives hints. */
    objectives: ObjectiveConfig[];
}
