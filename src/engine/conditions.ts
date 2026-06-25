import type { Condition } from "./types";

export interface ConditionContext {
    flags: Record<string, boolean>;
    inventory: string[];
}

/**
 * Evaluate a condition string against the current game state.
 * Supported grammar (single check, optional leading `!`):
 *   flag:my.flag.id
 *   item:my_item_id
 *   !flag:my.flag.id
 *   !item:my_item_id
 *
 * An empty / missing condition is considered `true` (no gate).
 */
export function evaluate(
    condition: Condition | undefined | null,
    ctx: ConditionContext,
): boolean {
    if (!condition) return true;

    let expr = condition.trim();
    let negate = false;
    if (expr.startsWith("!")) {
        negate = true;
        expr = expr.slice(1).trim();
    }

    const sep = expr.indexOf(":");
    if (sep === -1) {
        console.warn(`Invalid condition (no ':'): ${condition}`);
        return false;
    }
    const kind = expr.slice(0, sep).trim();
    const id = expr.slice(sep + 1).trim();

    let result: boolean;
    switch (kind) {
        case "flag":
            result = ctx.flags[id] === true;
            break;
        case "item":
            result = ctx.inventory.includes(id);
            break;
        default:
            console.warn(`Unknown condition kind '${kind}' in: ${condition}`);
            return false;
    }
    return negate ? !result : result;
}
