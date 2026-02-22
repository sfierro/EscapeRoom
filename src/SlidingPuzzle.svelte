<script>
    import paintingUrl from "./assets/painting.png";

    const { onSolved: onSolvedCallback } = $props();

    // ─── Configurable ──────────────────────────────────────────
    let cols = 3;
    let rows = 3;
    let imageWidth = 480; // px – change to resize the puzzle
    let imageHeight = 360; // px
    let seed = 35; // deterministic shuffle – change to get a different layout

    // ─── Constants ─────────────────────────────────────────────
    const totalTiles = cols * rows;
    const emptyTileGoal = rows * cols - 1; // bottom-right position
    const tileW = imageWidth / cols;
    const tileH = imageHeight / rows;

    // Every tile number except the one permanently removed
    const tileNumbers = Array.from({ length: totalTiles }, (_, i) => i).filter(
        (i) => i !== emptyTileGoal,
    );

    // ─── Seeded PRNG (mulberry32) ──────────────────────────────
    function mulberry32(s) {
        return function () {
            s |= 0;
            s = (s + 0x6d2b79f5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // ─── Puzzle helpers ────────────────────────────────────────
    function createSolvedState() {
        return Array.from({ length: totalTiles }, (_, i) =>
            i === emptyTileGoal ? null : i,
        );
    }

    function countInversions(arr) {
        const tiles = arr.filter((t) => t !== null);
        let inv = 0;
        for (let i = 0; i < tiles.length; i++)
            for (let j = i + 1; j < tiles.length; j++)
                if (tiles[i] > tiles[j]) inv++;
        return inv;
    }

    /**
     * For even-width grids the solvability rule is:
     *   (inversions + |blankRow − goalBlankRow|) must be even.
     * For odd-width grids only inversions parity matters.
     */
    function isSolvable(arr) {
        const inv = countInversions(arr);
        if (cols % 2 === 1) return inv % 2 === 0;
        const blankRow = Math.floor(arr.indexOf(null) / cols);
        const goalRow = Math.floor(emptyTileGoal / cols);
        return (inv + Math.abs(blankRow - goalRow)) % 2 === 0;
    }

    function checkSolved(arr) {
        const goal = createSolvedState();
        return arr.every((v, i) => v === goal[i]);
    }

    /** Fisher-Yates shuffle with seeded PRNG – deterministic for a given seed. */
    function shuffle() {
        const rand = mulberry32(seed);
        let arr;
        do {
            arr = createSolvedState();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        } while (!isSolvable(arr) || checkSolved(arr));
        return arr;
    }

    // ─── Reactive state ────────────────────────────────────────
    let tiles = $state(shuffle());
    let solved = $derived(checkSolved(tiles));

    // ─── Interaction ───────────────────────────────────────────
    function isAdjacent(a, b) {
        const rowA = Math.floor(a / cols),
            colA = a % cols;
        const rowB = Math.floor(b / cols),
            colB = b % cols;
        return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
    }

    function handleTileClick(tileNum) {
        if (solved) return;
        const pos = tiles.indexOf(tileNum);
        const emptyPos = tiles.indexOf(null);
        if (isAdjacent(pos, emptyPos)) {
            tiles[pos] = null;
            tiles[emptyPos] = tileNum;
            if (checkSolved(tiles) && onSolvedCallback) {
                onSolvedCallback();
            }
        }
    }
</script>

<div
    class="puzzle-container"
    style="width: {imageWidth}px; height: {imageHeight}px;"
>
    <!--
        Keyed each over tile *numbers* (not positions) so the DOM element
        for each tile persists across moves → CSS transition fires.
    -->
    {#each tileNumbers as tile (tile)}
        {@const pos = tiles.indexOf(tile)}
        <button
            class="tile"
            class:solved
            aria-label="Tile {tile + 1}"
            style="
                width: {tileW}px;
                height: {tileH}px;
                left: {(pos % cols) * tileW}px;
                top: {Math.floor(pos / cols) * tileH}px;
                background-image: url('{paintingUrl}');
                background-size: {imageWidth}px {imageHeight}px;
                background-position: -{(tile % cols) * tileW}px -{Math.floor(
                tile / cols,
            ) * tileH}px;
            "
            onclick={() => handleTileClick(tile)}
        ></button>
    {/each}

    <!-- When solved, fill in the missing tile so the full image appears -->
    {#if solved}
        <div
            class="tile solved missing-tile"
            style="
                width: {tileW}px;
                height: {tileH}px;
                left: {(emptyTileGoal % cols) * tileW}px;
                top: {Math.floor(emptyTileGoal / cols) * tileH}px;
                background-image: url('{paintingUrl}');
                background-size: {imageWidth}px {imageHeight}px;
                background-position: -{(emptyTileGoal % cols) *
                tileW}px -{Math.floor(emptyTileGoal / cols) * tileH}px;
            "
        ></div>
    {/if}
</div>

<style>
    .puzzle-container {
        position: relative;
        overflow: hidden;
        user-select: none;
    }

    .tile {
        position: absolute;
        padding: 0;
        margin: 0;
        border: none;
        background-color: transparent;
        cursor: pointer;
        transition:
            left 0.2s ease-out,
            top 0.2s ease-out,
            box-shadow 0.3s ease;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
    }

    .tile:focus:not(:focus-visible) {
        outline: none;
    }

    .tile:hover:not(.solved) {
        z-index: 1;
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
    }

    .tile.solved {
        box-shadow: none;
        cursor: default;
        transition:
            left 0.2s ease-out,
            top 0.2s ease-out,
            box-shadow 0.5s ease;
    }

    .missing-tile {
        pointer-events: none;
        animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
