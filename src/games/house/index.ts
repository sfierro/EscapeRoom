import type { GameDefinition } from "../../engine/types";

// ─── Room art ──────────────────────────────────────────────────
import entranceImage from "../../assets/rooms/entrance.jpg";
import hallwayImage from "../../assets/rooms/hallway.jpg";
import loungeImage from "../../assets/rooms/lounge.jpg";
import kitchenImage from "../../assets/rooms/kitchen.jpg";
import bathroomImage from "../../assets/rooms/bathroom.jpg";
import singleBedroomImage from "../../assets/rooms/single_bedroom.jpg";
import outsideImage from "../../assets/rooms/outside.jpg";

// ─── Clue art ──────────────────────────────────────────────────
import booksImage from "../../assets/clues/books.png";
import mazeImage from "../../assets/clues/maze-computer.png";
import toothbrush2Image from "../../assets/clues/toothbrush-2.png";
import toothbrush3Image from "../../assets/clues/toothbrush-3.png";
import vitaminsImage from "../../assets/clues/vitamins.png";
import spicesImage from "../../assets/clues/spices.png";
import notepadImage from "../../assets/clues/notepad.jpg";
import remoteImage from "../../assets/clues/remote.png";
import tvImage from "../../assets/clues/tv.png";
import slidingPuzzleImage from "../../assets/clues/sliding-puzzle-painting.png";

export const houseGame: GameDefinition = {
    id: "house",
    title: "Midnight Lock Game Presents: Escape from the House",
    startRoomId: "single_bedroom",
    outsideImage,

    items: [
        { id: "toothbrush", emoji: "🪥", label: "Toothbrush" },
        { id: "screwdriver", emoji: "🪛", label: "Screwdriver" },
        { id: "key", emoji: "🔑", label: "Key" },
    ],

    rooms: [
        {
            id: "single_bedroom",
            name: "Single Bedroom",
            image: singleBedroomImage,
            next: { roomId: "hallway", requires: "flag:toothbrush.collected" },
            hotspots: [
                { puzzleId: "computer", cx: 1690, cy: 360 },
                { puzzleId: "books", cx: 1250, cy: 455 },
                { puzzleId: "canister", cx: 1083, cy: 658 },
                { text: "Looks like it's time to escape.", cx: 1470, cy: 168 },
                { text: "A poster of a cat.", cx: 86, cy: 179 },
                { text: "A colorful rug.", cx: 961, cy: 910 },
                { text: "A lightly slept in bed.", cx: 472, cy: 512 },
                { text: "Nothing to see here.", cx: 730, cy: 587 },
            ],
        },
        {
            id: "hallway",
            name: "Hallway",
            image: hallwayImage,
            next: { roomId: "kitchen", requires: "flag:medicine_cabinet.open" },
            hotspots: [
                { cx: 425, cy: 630, navigateTo: "single_bedroom" },
                { cx: 1650, cy: 550, navigateTo: "bathroom" },
                {
                    text: "An interesting painting of a forest scene.",
                    cx: 1047,
                    cy: 423,
                },
            ],
        },
        {
            id: "bathroom",
            name: "Bathroom",
            image: bathroomImage,
            previous: { roomId: "hallway", requires: "flag:toothbrush.collected" },
            hotspots: [
                { puzzleId: "toothbrush_holder", cx: 388, cy: 451 },
                { puzzleId: "medicine_cabinet", cx: 262, cy: 271 },
                { text: "An empty trash can.", cx: 1537, cy: 965 },
                { text: "An empty drawer.", cx: 607, cy: 843 },
            ],
        },
        {
            id: "kitchen",
            name: "Kitchen",
            image: kitchenImage,
            previous: { roomId: "hallway" },
            next: { roomId: "lounge", requires: "flag:kitchen_drawer.open" },
            hotspots: [
                { puzzleId: "spice_rack", cx: 1404, cy: 404 },
                { puzzleId: "kitchen_drawer", cx: 853, cy: 657 },
                { text: "It's not snack time.", cx: 279, cy: 586 },
                { text: "A stack of clean plates.", cx: 1333, cy: 275 },
                { text: "Nothing cooking in the oven.", cx: 1567, cy: 550 },
                { text: "Someone made soup recently.", cx: 1275, cy: 554 },
            ],
        },
        {
            id: "lounge",
            name: "Lounge",
            image: loungeImage,
            previous: { roomId: "kitchen" },
            next: { roomId: "entrance", requires: "flag:screwdriver.collected" },
            hotspots: [
                { puzzleId: "safe", cx: 90, cy: 768 },
                { puzzleId: "remote", cx: 966, cy: 719 },
                {
                    text: "This plant looks like it's getting plenty of sunlight.",
                    cx: 401,
                    cy: 534,
                },
                {
                    text: "A plate of chocolate chip cookies.",
                    cx: 801,
                    cy: 650,
                },
                { text: "That couch looks comfy.", cx: 1319, cy: 523 },
                { text: "What a beautiful painting!", cx: 1557, cy: 160 },
                { text: "Quite the tall lamp.", cx: 1855, cy: 150 },
            ],
        },
        {
            id: "entrance",
            name: "Entrance",
            image: entranceImage,
            previous: { roomId: "lounge" },
            hotspots: [
                { puzzleId: "door", cx: 990, cy: 558 },
                { puzzleId: "painting", cx: 353, cy: 467 },
                { puzzleId: "drawer", cx: 1300, cy: 715 },
                { text: "These are pretty flowers!", cx: 1333, cy: 381 },
                { text: "A pair of muddy boots.", cx: 1098, cy: 834 },
                {
                    text: "A bowl of keys, but none of them seem to fit the front door.",
                    cx: 1391,
                    cy: 595,
                },
                { text: "Nothing under the mat.", cx: 869, cy: 870 },
            ],
        },
    ],

    puzzles: [
        // ─── Single bedroom ─────────────────────────────────────
        {
            id: "books",
            clue: {
                image: booksImage,
                imageClass: "large-clue-image",
                text: "Judging these books by their covers might not be a bad idea.",
            },
        },
        {
            id: "computer",
            prompt: "The computer is locked. I wonder what the password is.",
            lock: { kind: "password", answer: "BLACKCAT" },
            solvedFlag: "computer.solved",
            reward: {
                kind: "clue",
                image: mazeImage,
                imageClass: "large-clue-image",
                text: "Maybe we should follow the cat...",
            },
        },
        {
            id: "canister",
            prompt: "This canister is sealed with a directional lock.",
            lock: { kind: "directional", answer: "RULDL" },
            solvedFlag: "canister.open",
            reward: {
                kind: "give_item",
                item: "toothbrush",
                emoji: "🪥",
                text: "Inside the canister you find a toothbrush.",
                buttonText: "Take toothbrush",
                emptyText: "The canister is empty.",
                collectedFlag: "toothbrush.collected",
            },
        },

        // ─── Bathroom ───────────────────────────────────────────
        {
            id: "toothbrush_holder",
            use: {
                requires: "toothbrush",
                consumesItem: true,
                useText: "There's room for another toothbrush in the holder.",
                useButtonText: "Place toothbrush",
                lockedText:
                    "Looks like another toothbrush might be able to fit in the holder.",
                previewImage: toothbrush2Image,
                previewImageClass: "large-clue-image",
            },
            solvedFlag: "toothbrush.placed",
            reward: {
                kind: "clue",
                image: toothbrush3Image,
                imageClass: "large-clue-image",
            },
        },
        {
            id: "medicine_cabinet",
            lock: { kind: "number", digits: 3, answer: "232" },
            solvedFlag: "medicine_cabinet.open",
            reward: {
                kind: "clue",
                image: vitaminsImage,
                imageClass: "large-clue-image",
                text: "An assortment of colorful vitamins.",
            },
        },

        // ─── Kitchen ────────────────────────────────────────────
        {
            id: "spice_rack",
            clue: {
                image: spicesImage,
                imageClass: "large-clue-image",
                text: "Some spices seem more full than others.\nDo those colors look familiar?",
            },
        },
        {
            id: "kitchen_drawer",
            lock: { kind: "number", digits: 4, answer: "3341" },
            solvedFlag: "kitchen_drawer.open",
            reward: {
                kind: "clue",
                image: notepadImage,
                imageClass: "large-clue-image",
                text: "Inside the drawer you find a note.",
            },
        },

        // ─── Lounge ─────────────────────────────────────────────
        {
            id: "remote",
            lock: {
                kind: "remote",
                answer: "41",
                maxDigits: 2,
                remoteImage,
            },
            solvedFlag: "tv.correct",
            reward: {
                kind: "tv_symbols",
                tvImage,
                sequence: ["star", "star", "square", "triangle", "circle"],
            },
        },
        {
            id: "safe",
            lock: {
                kind: "symbol",
                slots: 5,
                answer: ["star", "star", "square", "triangle", "circle"],
            },
            solvedFlag: "safe.open",
            reward: {
                kind: "give_item",
                item: "screwdriver",
                emoji: "🪛",
                text: "Inside the safe you find a screwdriver.",
                buttonText: "Take screwdriver",
                emptyText: "The safe is empty.",
                collectedFlag: "screwdriver.collected",
            },
        },

        // ─── Entrance ───────────────────────────────────────────
        {
            id: "painting",
            use: {
                requires: "screwdriver",
                consumesItem: true,
                useEmoji: "🪛",
                useText:
                    "The frame of this painting looks like it could be pried off with the right tool.",
                useButtonText: "Use screwdriver",
                lockedText:
                    "The frame of this painting looks like it could be pried off with the right tool.",
            },
            solvedFlag: "painting.pried",
            reward: {
                kind: "sliding_puzzle",
                image: slidingPuzzleImage,
                cols: 3,
                rows: 3,
                seed: 37,
                text: "Behind the painting, hidden inside the frame, is a sliding puzzle.\nIt looks like an altered replica of the original.",
            },
        },
        {
            id: "drawer",
            lock: { kind: "number", digits: 5, answer: "25134" },
            solvedFlag: "drawer.unlocked",
            reward: {
                kind: "give_item",
                item: "key",
                emoji: "🔑",
                text: "Inside the drawer you find a key.",
                buttonText: "Take key",
                emptyText: "The drawer is empty.",
                collectedFlag: "key.collected",
            },
        },
        {
            id: "door",
            use: {
                requires: "key",
                consumesItem: true,
                useEmoji: "🔑",
                useText: "Use the key on the door?",
                useButtonText: "Use key",
                lockedText: "This door is locked!",
            },
            solvedFlag: "escaped",
            reward: { kind: "escape" },
        },
    ],

    // ─── Hint progression ───────────────────────────────────────
    // Order matters – the engine surfaces hints for the FIRST objective
    // whose `completedWhen` is still false.
    objectives: [
        {
            id: "solve_computer",
            title: "Unlock the computer",
            completedWhen: "flag:computer.solved",
            hints: [
                "The computer in the bedroom asks for a password. Look around the room for written clues.",
                "The colorful books on the shelf might not be in random order — try reading the first letter of each cover.",
                "The password is case-sensitive and all one word.",
                'The password is "BLACKCAT" (all caps).',
            ],
        },
        {
            id: "open_canister",
            title: "Open the canister",
            completedWhen: "flag:canister.open",
            hints: [
                "The canister has a directional lock. There's a clue somewhere in this bedroom.",
                "Now that the computer is unlocked, check what it's displaying. A maze, perhaps — and a cat poster.",
                "Trace a path through the maze from start to end. Each turn is one direction.",
                "The sequence is Right, Up, Left, Down, Left → R U L D L.",
            ],
        },
        {
            id: "place_toothbrush",
            title: "Place the toothbrush",
            completedWhen: "flag:toothbrush.placed",
            hints: [
                "You picked up a toothbrush. Where does a toothbrush go?",
                "Try the bathroom. There's a toothbrush holder on the counter.",
                "Click the toothbrush holder and choose Place toothbrush.",
            ],
        },
        {
            id: "open_medicine_cabinet",
            title: "Open the medicine cabinet",
            completedWhen: "flag:medicine_cabinet.open",
            hints: [
                "The medicine cabinet needs a 3-digit code. There's a clue near another bathroom fixture.",
                "Now that the third toothbrush is in the holder, take a closer look at how they're arranged.",
                "Each toothbrush points in a direction — count something about each one.",
                "The code is 2-3-2 (heights of the toothbrushes, left to right).",
            ],
        },
        {
            id: "open_kitchen_drawer",
            title: "Open the kitchen drawer",
            completedWhen: "flag:kitchen_drawer.open",
            hints: [
                "The kitchen drawer needs a 4-digit code. The kitchen has a few interactive spots — both probably matter.",
                "The vitamins from the medicine cabinet and the spices on the rack share something in common.",
                "The vitamins show a color sequence. Find those same colors in the spice rack.",
                "Read the positions of those colors on the spice rack to get a 4-digit code: 3341.",
            ],
        },
        {
            id: "watch_tv",
            title: "Set the TV to the right channel",
            completedWhen: "flag:tv.correct",
            hints: [
                "Pick up the remote in the lounge — it can change the TV channel.",
                "Did you read the note from the kitchen drawer? It probably says something about a channel.",
                "Punch in CH 41 on the remote and press OK.",
            ],
        },
        {
            id: "open_safe",
            title: "Open the safe",
            completedWhen: "flag:safe.open",
            hints: [
                "The safe in the lounge takes a 5-symbol code. Have you seen any sequences of symbols lately?",
                "Once the TV is on the right channel, watch the screen — symbols flash in order.",
                "Enter the symbols in the order they appear on the TV.",
                "The code is: Star, Star, Square, Triangle, Circle.",
            ],
        },
        {
            id: "pry_painting",
            title: "Investigate the painting",
            completedWhen: "flag:painting.pried",
            hints: [
                "You have a screwdriver — is there anything in the house that looks like it could be opened with one?",
                "Head to the entrance and try the painting on the wall.",
                "Click the painting and choose Use screwdriver.",
            ],
        },
        {
            id: "open_entrance_drawer",
            title: "Open the entrance drawer",
            completedWhen: "flag:drawer.unlocked",
            hints: [
                "The entrance drawer needs a 5-digit code. The painting behind the frame might know something.",
                "Solve the sliding puzzle behind the painting — the tile numbers, read left-to-right top-to-bottom, are the code.",
                "Once the puzzle is solved, read the numbers in order: 2-5-1-3-4.",
            ],
        },
        {
            id: "escape",
            title: "Escape!",
            completedWhen: "flag:escaped",
            hints: [
                "You have the key. There's only one lock left in this house.",
                "Use the key on the front door in the entrance.",
            ],
        },
    ],
};
