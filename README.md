# Escape Room

A Svelte 5 project featuring an escape room experience.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` and should open automatically in your browser.

### Building

To create a production build:

```bash
npm run build
```

### Preview Production Build

To preview the production build:

```bash
npm run preview
```

### Validating a game

Forward-simulates an omniscient solver through every game in `src/games/`,
checking for dangling references, duplicate ids, unreachable rooms,
inventory deadlocks, decorative items, and unsolvable objectives.

```bash
npm run validate
```

### Switching which game runs in dev

The dev server defaults to the house game. Append `?game=zoo` (or any other
registered id) to play another:

```
http://localhost:5173/?game=zoo
```

## Project Structure

The codebase is now split into a **data-driven engine** and a **per-game data file**.
A new game is added by writing a single TypeScript module – no Svelte changes needed.

```
src/
  App.svelte                # Thin shell: room rendering, navigation, inventory, hint button
  Alert.svelte              # Generic modal primitive
  Hotspot.svelte            # Clickable region overlay
  Navigation.svelte         # Room arrow buttons
  PasswordLock.svelte       # Lock UI primitives, parameterised
  NumberLock.svelte         #   - reused by the engine for every game
  SymbolLock.svelte         #
  DirectionalLock.svelte    #
  SlidingPuzzle.svelte      # Sliding-tile puzzle (puzzleId-scoped state)
  game-state.svelte.ts      # Reactive flags / inventory / hint levels / save-load
  engine/
    types.ts                # GameDefinition schema (rooms, puzzles, hints, conditions)
    conditions.ts           # Mini-language: "flag:foo" / "item:bar" / negation
    hints.ts                # Picks the current uncompleted objective
    PuzzleAlert.svelte      # Universal puzzle renderer (handles every puzzle kind)
    HintPanel.svelte        # Lightbulb hint modal
    RemoteLock.svelte       # Specialised TV-remote lock UI
    TvSymbols.svelte        # Animated TV symbol sequence
    SymbolIcon.svelte       # Shared symbol SVGs
  alerts/ui/                # ClueAlert / ActionButtonAlert / TextAlert / ZoomableImage
  games/
    house/index.ts          # The first game: "Escape from the House"
    zoo/                    # Proof-of-concept: "Escape from the Zoo" (SVG art)
      index.ts
      assets/rooms/*.svg
      assets/clues/*.svg
  assets/                   # House-specific room and clue art

scripts/
  validate.ts               # `npm run validate` entrypoint
  lib/validate-game.ts      # Forward-simulating game solver
```

### Authoring a new game

Create `src/games/<your-game-id>/index.ts` exporting a `GameDefinition`:

1. Import room and clue images statically (Vite will bundle them).
2. Define `items[]`, `rooms[]`, `puzzles[]`, and the linear `objectives[]` list.
3. Each puzzle is one of:
   - `clue` — passive image or text
   - `lock` — `password`, `number`, `symbol`, `directional`, or `remote`
   - `use` — consume an inventory item to advance
4. Room exits use conditions like `"item:key"` or `"flag:safe.open"`.
5. The hint engine surfaces hints from the first objective whose `completedWhen`
   is still false – so author hints from soft nudge → near-spoiler.

After authoring, register the game in `src/App.svelte`'s `GAMES` map and in
`scripts/validate.ts`. Run `npm run validate` to confirm the game is solvable
end-to-end before shipping.
