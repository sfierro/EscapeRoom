import type { GameDefinition, ObjectiveConfig } from "./types";
import { evaluate } from "./conditions";

export interface HintContext {
    flags: Record<string, boolean>;
    inventory: string[];
}

/**
 * Returns the first objective whose `completedWhen` is not yet satisfied,
 * walking the linear objectives list in order. Returns null if the
 * player has finished every objective (game complete).
 */
export function getCurrentObjective(
    game: GameDefinition,
    ctx: HintContext,
): ObjectiveConfig | null {
    for (const obj of game.objectives) {
        if (!evaluate(obj.completedWhen, ctx)) return obj;
    }
    return null;
}

/**
 * Returns the slice of hints the player has unlocked for the active
 * objective. If `level` is 0 or the objective is null, the result is empty.
 */
export function getRevealedHints(
    objective: ObjectiveConfig | null,
    level: number,
): string[] {
    if (!objective) return [];
    return objective.hints.slice(0, Math.max(0, Math.min(level, objective.hints.length)));
}
