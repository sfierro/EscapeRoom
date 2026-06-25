// CLI entrypoint: `npm run validate` (executed via vite-node so we
// pick up Vite's asset/extension resolution for `src/games/*/index.ts`).
//
// Add new games to the GAMES array as they're authored.

import type { GameDefinition } from "../src/engine/types";
import { validateGame, type ValidationReport } from "./lib/validate-game";

import { houseGame } from "../src/games/house/index";

const GAMES: GameDefinition[] = [houseGame];

// ─── Try to load the zoo game if present (optional second game) ─
try {
    const zoo = await import("../src/games/zoo/index");
    if (zoo?.zooGame) GAMES.push(zoo.zooGame);
} catch {
    // Not yet authored – ignore.
}

// ─── Pretty-printing helpers ───────────────────────────────────
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const DIM = "\x1b[2m";

function printReport(r: ValidationReport): void {
    const ok = r.errors.length === 0;
    const header = ok ? `${GREEN}✓ PASS${RESET}` : `${RED}✗ FAIL${RESET}`;
    console.log("");
    console.log(`${BOLD}${header}  ${r.title}${RESET}  ${DIM}(${r.gameId})${RESET}`);

    if (r.errors.length) {
        console.log(`  ${RED}Errors:${RESET}`);
        for (const e of r.errors) console.log(`    - ${e}`);
    }
    if (r.warnings.length) {
        console.log(`  ${YELLOW}Warnings:${RESET}`);
        for (const w of r.warnings) console.log(`    - ${w}`);
    }

    if (r.trace.length) {
        console.log(`  ${BLUE}Solver trace${RESET}  ${DIM}(${r.trace.length} steps)${RESET}`);
        for (const t of r.trace) console.log(`    ${DIM}·${RESET} ${t}`);
    }

    console.log(`  ${DIM}Final inventory:${RESET} [${r.finalState.inventory.join(", ") || "—"}]`);
    const flagCount = Object.keys(r.finalState.flags).filter(
        (k) => r.finalState.flags[k],
    ).length;
    console.log(`  ${DIM}Flags set:${RESET} ${flagCount}`);
}

// ─── Run ───────────────────────────────────────────────────────
let anyFailed = false;
for (const game of GAMES) {
    const report = validateGame(game);
    printReport(report);
    if (report.errors.length > 0) anyFailed = true;
}

console.log("");
if (anyFailed) {
    console.log(`${RED}${BOLD}Validation failed.${RESET}`);
    process.exit(1);
} else {
    console.log(`${GREEN}${BOLD}All games valid.${RESET}`);
}
