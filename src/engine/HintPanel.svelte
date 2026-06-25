<script>
    import {
        gameState,
        getActiveGame,
        closeHintPanel,
    } from "../game-state.svelte";
    import { getCurrentObjective, getRevealedHints } from "./hints";
    import Alert from "../Alert.svelte";

    const game = getActiveGame();

    const objective = $derived(
        getCurrentObjective(game, {
            flags: gameState.flags,
            inventory: gameState.inventory,
        }),
    );

    const currentLevel = $derived(
        objective ? (gameState.hintLevels[objective.id] ?? 0) : 0,
    );

    const revealed = $derived(getRevealedHints(objective, currentLevel));

    const hasMore = $derived(
        objective ? currentLevel < objective.hints.length : false,
    );

    // Auto-reveal the first hint when the panel opens on a fresh objective.
    // This means the player never sees an empty panel.
    $effect(() => {
        if (objective && (gameState.hintLevels[objective.id] ?? 0) === 0) {
            gameState.hintLevels[objective.id] = 1;
        }
    });

    function showAnother() {
        if (!objective) return;
        const current = gameState.hintLevels[objective.id] ?? 0;
        if (current < objective.hints.length) {
            gameState.hintLevels[objective.id] = current + 1;
        }
    }
</script>

<Alert onClose={closeHintPanel}>
    <div class="hint-panel">
        <div class="hint-header">
            <span class="hint-bulb" aria-hidden="true">💡</span>
            <div class="hint-title-block">
                <h2 class="hint-title">Hints</h2>
                {#if objective?.title}
                    <p class="hint-objective">{objective.title}</p>
                {/if}
            </div>
        </div>

        {#if !objective}
            <p class="hint-empty">You've solved every puzzle in this game!</p>
        {:else}
            <ol class="hint-list">
                {#each revealed as hint, i (i)}
                    <li class="hint-item">
                        <span class="hint-index">{i + 1}.</span>
                        <span class="hint-text">{hint}</span>
                    </li>
                {/each}
            </ol>

            {#if hasMore}
                <button class="hint-more-button" onclick={showAnother}>
                    Show another hint
                </button>
            {:else}
                <p class="hint-no-more">No more hints available for this step.</p>
            {/if}
        {/if}
    </div>
</Alert>

<style>
    .hint-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 500px;
        min-width: 320px;
        padding: 4px 8px;
    }

    .hint-header {
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        padding-bottom: 12px;
    }

    .hint-bulb {
        font-size: 2rem;
        line-height: 1;
    }

    .hint-title-block {
        display: flex;
        flex-direction: column;
    }

    .hint-title {
        font-family: "Courier New", Courier, monospace;
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        color: #1a1a1a;
    }

    .hint-objective {
        font-family: "Courier New", Courier, monospace;
        font-size: 0.85rem;
        color: #555;
        margin: 4px 0 0 0;
    }

    .hint-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .hint-item {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        padding: 10px 12px;
        background: rgba(74, 144, 226, 0.08);
        border-left: 3px solid #4a90e2;
        border-radius: 6px;
        animation: hintIn 0.25s ease-out;
    }

    .hint-index {
        font-family: "Courier New", Courier, monospace;
        font-weight: 700;
        color: #4a90e2;
        flex-shrink: 0;
    }

    .hint-text {
        font-family: "Courier New", Courier, monospace;
        font-size: 0.95rem;
        color: #1a1a1a;
        line-height: 1.4;
        text-align: left;
    }

    .hint-more-button {
        align-self: center;
        padding: 8px 20px;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: "Courier New", Courier, monospace;
        color: #fff;
        background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
            0 4px 6px rgba(245, 158, 11, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .hint-more-button:hover {
        background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
        transform: translateY(-1px);
        box-shadow:
            0 6px 8px rgba(245, 158, 11, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .hint-more-button:active {
        background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
        transform: translateY(0);
    }

    .hint-no-more {
        font-family: "Courier New", Courier, monospace;
        font-size: 0.85rem;
        color: #888;
        text-align: center;
        margin: 0;
        font-style: italic;
    }

    .hint-empty {
        font-family: "Courier New", Courier, monospace;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
        color: #1a1a1a;
        margin: 0;
        padding: 16px 0;
    }

    @keyframes hintIn {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
