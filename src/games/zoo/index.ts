import type { GameDefinition } from "../../engine/types";

// ─── Room art (programmatic SVG backdrops) ──────────────────────
import plazaImage from "./assets/rooms/plaza.svg";
import aviaryImage from "./assets/rooms/aviary.svg";
import reptileHouseImage from "./assets/rooms/reptile_house.svg";
import mainGateImage from "./assets/rooms/main_gate.svg";
import outsideImage from "./assets/rooms/outside.svg";

// ─── Clue art ──────────────────────────────────────────────────
import coloringBookImage from "./assets/clues/coloring_book.svg";

export const zooGame: GameDefinition = {
    id: "zoo",
    title: "Midnight Lock Game Presents: Escape from the Zoo",
    startRoomId: "plaza",
    outsideImage,

    items: [
        { id: "master_key", emoji: "🗝️", label: "Master key" },
    ],

    rooms: [
        {
            id: "plaza",
            name: "Entry Plaza",
            image: plazaImage,
            next: { roomId: "aviary", requires: "flag:gift_shop.solved" },
            hotspots: [
                { puzzleId: "info_kiosk", cx: 280, cy: 480 },
                { puzzleId: "vending_machine", cx: 700, cy: 560 },
                { puzzleId: "gift_shop", cx: 1200, cy: 500 },
                { text: "A wooden bench. Empty.", cx: 960, cy: 900 },
                { text: "The afternoon sun is starting to set.", cx: 1700, cy: 180 },
            ],
        },
        {
            id: "aviary",
            name: "Aviary",
            image: aviaryImage,
            previous: { roomId: "plaza" },
            next: { roomId: "reptile_house", requires: "flag:bird_cage.open" },
            hotspots: [
                { puzzleId: "bird_cage", cx: 960, cy: 620 },
                { puzzleId: "wing_chart", cx: 320, cy: 600 },
                {
                    text: "An empty nest. Whoever lived here is long gone.",
                    cx: 1500,
                    cy: 700,
                },
                { text: "A soft chirping somewhere overhead.", cx: 900, cy: 280 },
            ],
        },
        {
            id: "reptile_house",
            name: "Reptile House",
            image: reptileHouseImage,
            previous: { roomId: "aviary" },
            next: { roomId: "main_gate", requires: "flag:terrarium.open" },
            hotspots: [
                { puzzleId: "temperature_panel", cx: 360, cy: 600 },
                { puzzleId: "snake_terrarium", cx: 960, cy: 620 },
                { puzzleId: "info_card", cx: 1560, cy: 600 },
            ],
        },
        {
            id: "main_gate",
            name: "Main Gate",
            image: mainGateImage,
            previous: { roomId: "reptile_house" },
            hotspots: [
                { puzzleId: "combo_lock", cx: 420, cy: 700 },
                { puzzleId: "main_gate_door", cx: 960, cy: 720 },
                {
                    text: "A neatly trimmed bush. Nothing hidden inside.",
                    cx: 1480,
                    cy: 850,
                },
            ],
        },
    ],

    puzzles: [
        // ─── Plaza ──────────────────────────────────────────────
        {
            id: "info_kiosk",
            clue: {
                text: "TODAY'S PRICES\n\nAdult — $4\nChild — $1\nSenior — $7",
            },
        },
        {
            id: "vending_machine",
            prompt:
                "The vending machine wants three coins. The price sign is on the kiosk.",
            lock: { kind: "number", digits: 3, answer: "417" },
            solvedFlag: "vending_machine.open",
            reward: {
                kind: "clue",
                text: "A receipt drops out:\n\n\"Aviary cage opens with this morning's flight log: D R U L D\"",
            },
        },
        {
            id: "gift_shop",
            prompt: "The gift shop window has a keypad. Try a single password.",
            lock: { kind: "password", answer: "ANIMALS" },
            solvedFlag: "gift_shop.solved",
            reward: {
                kind: "clue",
                image: coloringBookImage,
                imageClass: "large-clue-image",
                text: "A child's drawing taped to the window. The order matters.",
            },
        },

        // ─── Aviary ─────────────────────────────────────────────
        {
            id: "wing_chart",
            clue: {
                text: "WINGSPANS\n\nEagle — 7ft\nSwan — 8ft\nWren — 0.5ft\n\n(Probably not useful.)",
            },
        },
        {
            id: "bird_cage",
            prompt:
                "The cage's directional lock awaits a sequence of arrows.",
            lock: { kind: "directional", answer: "DRULD" },
            solvedFlag: "bird_cage.open",
            reward: {
                kind: "clue",
                text: "The cage door swings open. The bird inside chirps once and flies past you down the corridor — toward the reptile house.",
            },
        },

        // ─── Reptile House ──────────────────────────────────────
        {
            id: "temperature_panel",
            clue: {
                text: "HABITAT PANEL\n\nFive empty slots are mounted above the terrarium — waiting for symbols to be entered.\n\n(A small label reads: \"Pattern source: lost.\")",
            },
        },
        {
            id: "info_card",
            clue: {
                text: "DID YOU KNOW?\n\nSnakes have no eyelids — they sleep with their eyes open.",
            },
        },
        {
            id: "snake_terrarium",
            prompt:
                "A symbol pad is bolted to the glass.",
            lock: {
                kind: "symbol",
                slots: 5,
                answer: ["star", "circle", "triangle", "circle", "star"],
            },
            solvedFlag: "terrarium.open",
            reward: {
                kind: "clue",
                text: "Behind the glass, painted on the back wall in faded yellow:\n\n9 1 4 5 2",
            },
        },

        // ─── Main Gate ──────────────────────────────────────────
        {
            id: "combo_lock",
            prompt:
                "A 5-digit combo lock chained to the master key locker.",
            lock: { kind: "number", digits: 5, answer: "91452" },
            solvedFlag: "combo_lock.open",
            reward: {
                kind: "give_item",
                item: "master_key",
                emoji: "🗝️",
                text: "A heavy master key drops into your hand.",
                buttonText: "Take master key",
                emptyText: "The locker is empty.",
                collectedFlag: "master_key.collected",
            },
        },
        {
            id: "main_gate_door",
            use: {
                requires: "master_key",
                consumesItem: true,
                useEmoji: "🗝️",
                useText: "The master key fits this gate. Unlock it?",
                useButtonText: "Use master key",
                lockedText:
                    "The main gate is locked tight. You'll need a master key.",
            },
            solvedFlag: "escaped",
            reward: { kind: "escape" },
        },
    ],

    objectives: [
        {
            id: "buy_a_snack",
            title: "Crack the vending machine",
            completedWhen: "flag:vending_machine.open",
            hints: [
                "The vending machine in the plaza wants a 3-digit code. Something nearby tells you the answer.",
                "Check the info kiosk — today's ticket prices are listed there.",
                "Read the prices in order: Adult, Child, Senior.",
                "The code is 4-1-7.",
            ],
        },
        {
            id: "open_gift_shop",
            title: "Open the gift shop",
            completedWhen: "flag:gift_shop.solved",
            hints: [
                "The gift shop in the plaza is password-locked. The password is a single word.",
                "Look at what the shop sells — what's the one-word theme of this whole place?",
                "The password is ANIMALS (all caps).",
            ],
        },
        {
            id: "open_bird_cage",
            title: "Open the aviary's bird cage",
            completedWhen: "flag:bird_cage.open",
            hints: [
                "The bird cage in the aviary uses a directional lock — 5 arrow presses in sequence.",
                "Did you solve the vending machine? Its receipt described the flight pattern.",
                "The pattern is Down, Right, Up, Left, Down.",
                "Enter: D R U L D.",
            ],
        },
        {
            id: "open_terrarium",
            title: "Open the snake terrarium",
            completedWhen: "flag:terrarium.open",
            hints: [
                "The terrarium needs a 5-symbol sequence. The habitat panel's pattern source is \"lost\" — but someone else may have copied it.",
                "Did you collect a child's drawing from the gift shop? It shows a 5-symbol pattern. The kid wrote that order matters.",
                "Enter, in order: Star, Circle, Triangle, Circle, Star.",
            ],
        },
        {
            id: "open_combo_lock",
            title: "Crack the main gate's combo lock",
            completedWhen: "flag:combo_lock.open",
            hints: [
                "The combo lock at the main gate needs a 5-digit code.",
                "The terrarium revealed a number painted inside. Read it left to right.",
                "The code is 9-1-4-5-2.",
            ],
        },
        {
            id: "escape",
            title: "Escape!",
            completedWhen: "flag:escaped",
            hints: [
                "You have the master key. The main gate is right there.",
                "Click the main gate and use the master key.",
            ],
        },
    ],
};
