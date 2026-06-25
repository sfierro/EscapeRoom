// ─── Game Validator ─────────────────────────────────────────────
// Forward-simulates an omniscient solver to verify that a GameDefinition
// is structurally sound and end-to-end completable.
//
// What we catch:
//   • Dangling references (hotspot→puzzle, exit→room, item→items[], …)
//   • Duplicate ids (rooms, puzzles, items, objectives)
//   • Unreachable rooms (no path from startRoomId given the gates)
//   • Unsolvable games (some objective never completes)
//   • Inventory deadlocks (consumed item required by a later gate)
//   • Empty hint lists, missing solvedFlag on lock/use puzzles, etc.
//
// What this does NOT yet catch (future work, requires schema extension):
//   • Logical clue dependencies ("this puzzle's clue lives in room X, only
//     reachable after solving puzzle Y") — needs explicit `cluesFrom` data.

import type { GameDefinition } from "../../src/engine/types";
import { evaluate } from "../../src/engine/conditions";

export interface ValidationReport {
    gameId: string;
    title: string;
    errors: string[];
    warnings: string[];
    trace: string[];
    finalState: SimState;
}

interface SimState {
    flags: Record<string, boolean>;
    inventory: string[];
}

// ─── Static reference checks ────────────────────────────────────
function staticChecks(
    game: GameDefinition,
    errors: string[],
    warnings: string[],
): void {
    const roomIds = new Set<string>();
    const puzzleIds = new Set<string>();
    const itemIds = new Set<string>();
    const objectiveIds = new Set<string>();

    for (const r of game.rooms) {
        if (roomIds.has(r.id))
            errors.push(`Duplicate room id: '${r.id}'`);
        roomIds.add(r.id);
    }
    for (const p of game.puzzles) {
        if (puzzleIds.has(p.id))
            errors.push(`Duplicate puzzle id: '${p.id}'`);
        puzzleIds.add(p.id);
    }
    for (const i of game.items) {
        if (itemIds.has(i.id))
            errors.push(`Duplicate item id: '${i.id}'`);
        itemIds.add(i.id);
    }
    for (const o of game.objectives) {
        if (objectiveIds.has(o.id))
            errors.push(`Duplicate objective id: '${o.id}'`);
        objectiveIds.add(o.id);
    }

    if (!roomIds.has(game.startRoomId))
        errors.push(
            `startRoomId '${game.startRoomId}' is not present in rooms[]`,
        );

    for (const room of game.rooms) {
        if (room.next && !roomIds.has(room.next.roomId))
            errors.push(
                `Room '${room.id}' next.roomId '${room.next.roomId}' is unknown`,
            );
        if (room.previous && !roomIds.has(room.previous.roomId))
            errors.push(
                `Room '${room.id}' previous.roomId '${room.previous.roomId}' is unknown`,
            );
        for (const h of room.hotspots) {
            if (h.puzzleId && !puzzleIds.has(h.puzzleId))
                errors.push(
                    `Room '${room.id}' hotspot references unknown puzzle '${h.puzzleId}'`,
                );
            if (h.navigateTo && !roomIds.has(h.navigateTo))
                errors.push(
                    `Room '${room.id}' hotspot navigates to unknown room '${h.navigateTo}'`,
                );
        }
    }

    for (const p of game.puzzles) {
        const interactive = p.lock || p.use;
        if (interactive && !p.solvedFlag)
            warnings.push(
                `Puzzle '${p.id}' is interactive but has no solvedFlag — engine can never mark it solved`,
            );
        if (p.use?.requires && !itemIds.has(p.use.requires))
            errors.push(
                `Puzzle '${p.id}' use.requires unknown item '${p.use.requires}'`,
            );
        if (p.reward?.kind === "give_item") {
            if (!itemIds.has(p.reward.item))
                errors.push(
                    `Puzzle '${p.id}' reward gives unknown item '${p.reward.item}'`,
                );
            if (!p.reward.collectedFlag)
                errors.push(
                    `Puzzle '${p.id}' give_item reward missing collectedFlag`,
                );
        }
    }

    // Hotspots without puzzleId/text/navigateTo are no-ops.
    for (const room of game.rooms) {
        for (const [i, h] of room.hotspots.entries()) {
            const verbs = [h.puzzleId, h.text, h.navigateTo].filter(Boolean);
            if (verbs.length === 0)
                warnings.push(
                    `Room '${room.id}' hotspot[${i}] has no action (no puzzleId, text, or navigateTo)`,
                );
            if (verbs.length > 1)
                warnings.push(
                    `Room '${room.id}' hotspot[${i}] sets multiple actions — only one will fire`,
                );
        }
    }

    for (const o of game.objectives) {
        if (o.hints.length === 0)
            warnings.push(`Objective '${o.id}' has zero hints`);
    }

    // ─── Detect items that get awarded but never required ──────
    // An item is "useful" if it appears in any `use.requires` or in any
    // condition `item:X` (room gate, objective completion).
    const usedItemIds = new Set<string>();
    for (const p of game.puzzles) {
        if (p.use?.requires) usedItemIds.add(p.use.requires);
    }
    const collectItemRefs = (cond: string | undefined) => {
        if (!cond) return;
        const m = cond.replace(/^!/, "").trim().match(/^item:(.+)$/);
        if (m) usedItemIds.add(m[1].trim());
    };
    for (const r of game.rooms) {
        collectItemRefs(r.next?.requires);
        collectItemRefs(r.previous?.requires);
    }
    for (const o of game.objectives) collectItemRefs(o.completedWhen);
    for (const p of game.puzzles) {
        if (p.reward?.kind === "give_item" && !usedItemIds.has(p.reward.item)) {
            warnings.push(
                `Item '${p.reward.item}' is given by puzzle '${p.id}' but never required by any gate, objective, or use puzzle — looks decorative`,
            );
        }
    }
}

// ─── BFS over the room graph in a given state ──────────────────
function reachableRooms(game: GameDefinition, state: SimState): Set<string> {
    const visited = new Set<string>([game.startRoomId]);
    const queue = [game.startRoomId];
    while (queue.length) {
        const rid = queue.shift()!;
        const room = game.rooms.find((r) => r.id === rid);
        if (!room) continue;
        for (const h of room.hotspots) {
            if (h.navigateTo && !visited.has(h.navigateTo)) {
                visited.add(h.navigateTo);
                queue.push(h.navigateTo);
            }
        }
        const ctx = { flags: state.flags, inventory: state.inventory };
        if (
            room.next &&
            evaluate(room.next.requires, ctx) &&
            !visited.has(room.next.roomId)
        ) {
            visited.add(room.next.roomId);
            queue.push(room.next.roomId);
        }
        if (
            room.previous &&
            evaluate(room.previous.requires, ctx) &&
            !visited.has(room.previous.roomId)
        ) {
            visited.add(room.previous.roomId);
            queue.push(room.previous.roomId);
        }
    }
    return visited;
}

// ─── Forward-simulation ────────────────────────────────────────
// Greedy: keep solving anything that can be solved with the current
// inventory/flags, then re-check reachability, repeat to fixpoint.
function simulate(
    game: GameDefinition,
    trace: string[],
): { state: SimState; escaped: boolean } {
    const state: SimState = { flags: {}, inventory: [] };
    let escaped = false;

    // Track which puzzles we've already resolved to avoid duplicate logs.
    const handled = new Set<string>();

    let progress = true;
    let iteration = 0;
    while (progress && iteration < 200) {
        progress = false;
        iteration++;
        const rooms = reachableRooms(game, state);
        for (const rid of rooms) {
            const room = game.rooms.find((r) => r.id === rid)!;
            for (const h of room.hotspots) {
                if (!h.puzzleId) continue;
                const p = game.puzzles.find((q) => q.id === h.puzzleId);
                if (!p) continue;
                const solved = p.solvedFlag
                    ? state.flags[p.solvedFlag] === true
                    : false;

                // ── Solve the puzzle if we can. ──────────────────
                if (!solved) {
                    if (p.use) {
                        if (!state.inventory.includes(p.use.requires)) continue;
                        if (p.use.consumesItem) {
                            state.inventory = state.inventory.filter(
                                (i) => i !== p.use!.requires,
                            );
                        }
                        if (p.solvedFlag) state.flags[p.solvedFlag] = true;
                        trace.push(
                            `[${rid}] used ${p.use.requires} on ${p.id}`,
                        );
                        progress = true;
                    } else if (p.lock) {
                        if (p.solvedFlag) state.flags[p.solvedFlag] = true;
                        trace.push(`[${rid}] solved lock ${p.id}`);
                        progress = true;
                    } else if (p.clue && !handled.has(p.id)) {
                        trace.push(`[${rid}] observed clue ${p.id}`);
                        handled.add(p.id);
                        // Clues with no solvedFlag are passive; mark handled.
                    }
                }

                // ── Always try to harvest the reward if available. ─
                if (
                    p.reward?.kind === "give_item" &&
                    (p.solvedFlag ? state.flags[p.solvedFlag] : true) &&
                    !state.flags[p.reward.collectedFlag]
                ) {
                    state.flags[p.reward.collectedFlag] = true;
                    if (!state.inventory.includes(p.reward.item)) {
                        state.inventory.push(p.reward.item);
                    }
                    trace.push(
                        `[${rid}] collected ${p.reward.item} from ${p.id}`,
                    );
                    progress = true;
                }
                if (
                    p.reward?.kind === "escape" &&
                    p.solvedFlag &&
                    state.flags[p.solvedFlag] &&
                    !escaped
                ) {
                    escaped = true;
                    trace.push(`[${rid}] ESCAPED via ${p.id}`);
                    progress = true;
                }
            }
        }
    }

    if (iteration >= 200)
        trace.push("WARN: simulation hit iteration cap (200) — possible loop");

    return { state, escaped };
}

// ─── Public entrypoint ─────────────────────────────────────────
export function validateGame(game: GameDefinition): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];
    const trace: string[] = [];

    staticChecks(game, errors, warnings);

    // Bail before simulation if static checks already exploded —
    // the simulator may crash on bad references.
    if (errors.length === 0) {
        const { state, escaped } = simulate(game, trace);

        // Did every objective complete?
        const ctx = { flags: state.flags, inventory: state.inventory };
        for (const obj of game.objectives) {
            if (!evaluate(obj.completedWhen, ctx)) {
                errors.push(
                    `Objective '${obj.id}' was never satisfied (completedWhen: '${obj.completedWhen}')`,
                );
            }
        }

        // Are all rooms reachable? Orphan rooms are a soft warning.
        const reachable = reachableRooms(game, state);
        for (const r of game.rooms) {
            if (!reachable.has(r.id)) {
                warnings.push(
                    `Room '${r.id}' was never reachable by the solver`,
                );
            }
        }

        if (!escaped) {
            // Only flag as error if some puzzle had an `escape` reward.
            const hasEscape = game.puzzles.some(
                (p) => p.reward?.kind === "escape",
            );
            if (hasEscape) errors.push("Solver never reached an escape state");
        }

        return {
            gameId: game.id,
            title: game.title,
            errors,
            warnings,
            trace,
            finalState: state,
        };
    }

    return {
        gameId: game.id,
        title: game.title,
        errors,
        warnings,
        trace,
        finalState: { flags: {}, inventory: [] },
    };
}
