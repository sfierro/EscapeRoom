<script>
    import NumberLockOpenIcon from "./icons/number-lock-open-icon.svelte";
    import NumberLockClosedIcon from "./icons/number-lock-closed-icon.svelte";

    const { length = 4, onEnter } = $props();

    let sequence = $state([]);
    let disabled = $state(false);
    let incorrect = $state(false);

    const dirSymbols = { U: "↑", D: "↓", L: "←", R: "→" };

    function addDirection(dir) {
        if (disabled || incorrect || sequence.length >= length) return;
        sequence = [...sequence, dir];
    }

    function removeLastDirection() {
        if (disabled || incorrect || sequence.length === 0) return;
        sequence = sequence.slice(0, -1);
    }

    function clearSequence() {
        if (disabled || incorrect) return;
        sequence = [];
    }

    function handleEnter() {
        if (disabled || incorrect || !onEnter || sequence.length !== length)
            return;
        const isCorrect = onEnter(sequence.join(""));
        if (isCorrect) {
            disabled = true;
        } else {
            incorrect = true;
            setTimeout(() => {
                incorrect = false;
                sequence = [];
            }, 1000);
        }
    }
</script>

<div class="directional-lock" class:disabled>
    <div class="sequence-display">
        {#each Array(length) as _, i}
            <div class="sequence-slot" class:filled={i < sequence.length}>
                {#if i < sequence.length}
                    <span class="direction-symbol"
                        >{dirSymbols[sequence[i]]}</span
                    >
                {:else}
                    <span class="direction-placeholder">·</span>
                {/if}
            </div>
        {/each}
    </div>

    <div class="direction-pad">
        <div class="pad-row pad-top">
            <button
                class="dir-button"
                onclick={() => addDirection("U")}
                disabled={disabled || incorrect || sequence.length >= length}
                aria-label="Up"
            >
                ↑
            </button>
        </div>
        <div class="pad-row pad-middle">
            <button
                class="dir-button"
                onclick={() => addDirection("L")}
                disabled={disabled || incorrect || sequence.length >= length}
                aria-label="Left"
            >
                ←
            </button>
            <button
                class="dir-button"
                onclick={() => addDirection("D")}
                disabled={disabled || incorrect || sequence.length >= length}
                aria-label="Down"
            >
                ↓
            </button>
            <button
                class="dir-button"
                onclick={() => addDirection("R")}
                disabled={disabled || incorrect || sequence.length >= length}
                aria-label="Right"
            >
                →
            </button>
        </div>
    </div>

    <div class="controls-row">
        <button
            class="control-button"
            onclick={clearSequence}
            disabled={disabled || incorrect || sequence.length === 0}
            aria-label="Clear"
        >
            Clear
        </button>
        <button
            class="lock-button"
            class:unlocked={disabled}
            class:incorrect
            onclick={handleEnter}
            disabled={disabled || incorrect || sequence.length !== length}
            aria-label="Unlock"
        >
            <div class="lock-icon-wrapper">
                {#if disabled}
                    <NumberLockOpenIcon />
                {:else}
                    <NumberLockClosedIcon />
                {/if}
            </div>
        </button>
        <button
            class="control-button"
            onclick={removeLastDirection}
            disabled={disabled || incorrect || sequence.length === 0}
            aria-label="Undo"
        >
            Undo
        </button>
    </div>
</div>

<style>
    .directional-lock {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 24px;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
        );
        border-radius: 20px;
        backdrop-filter: blur(10px);
    }

    .directional-lock.disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    .sequence-display {
        display: flex;
        gap: 10px;
    }

    .sequence-slot {
        width: 48px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
        border: 2px solid rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        transition: all 0.2s ease;
    }

    .sequence-slot.filled {
        border-color: rgba(74, 144, 226, 0.3);
        box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(74, 144, 226, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .direction-symbol {
        font-size: 1.6rem;
        font-weight: 700;
        color: #2c3e50;
    }

    .direction-placeholder {
        font-size: 1.6rem;
        color: #ccc;
    }

    .direction-pad {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }

    .pad-row {
        display: flex;
        gap: 6px;
    }

    .dir-button {
        width: 56px;
        height: 56px;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        user-select: none;
    }

    .dir-button:hover:not(:disabled) {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.12),
            0 2px 4px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        transform: translateY(-1px);
    }

    .dir-button:active:not(:disabled) {
        background: linear-gradient(180deg, #e9ecef 0%, #dee2e6 100%);
        box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.1),
            inset 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
    }

    .dir-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .dir-button:focus:not(:focus-visible) {
        outline: none;
    }

    .controls-row {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .control-button {
        font-size: 0.85rem;
        font-weight: 600;
        color: #555;
        background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        cursor: pointer;
        padding: 8px 16px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.06);
    }

    .control-button:hover:not(:disabled) {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
        transform: translateY(-1px);
    }

    .control-button:active:not(:disabled) {
        transform: translateY(0);
    }

    .control-button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .control-button:focus:not(:focus-visible) {
        outline: none;
    }

    .lock-button {
        background: linear-gradient(180deg, #4a90e2 0%, #357abd 100%);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        cursor: pointer;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
            0 4px 6px rgba(74, 144, 226, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
    }

    .lock-button:hover:not(:disabled) {
        background: linear-gradient(180deg, #5ba0f2 0%, #4080cd 100%);
        box-shadow:
            0 6px 8px rgba(74, 144, 226, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }

    .lock-button:active:not(:disabled) {
        background: linear-gradient(180deg, #357abd 0%, #2a5f9d 100%);
        box-shadow:
            0 2px 4px rgba(74, 144, 226, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
        transform: translateY(0);
    }

    .lock-button:disabled {
        opacity: 1;
        cursor: not-allowed;
        pointer-events: none;
    }

    .lock-button.unlocked {
        background: linear-gradient(180deg, #10b981 0%, #059669 100%);
        box-shadow:
            0 4px 6px rgba(16, 185, 129, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .lock-button.incorrect {
        background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
        box-shadow:
            0 4px 6px rgba(239, 68, 68, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .lock-button:focus:not(:focus-visible) {
        outline: none;
    }

    .lock-icon-wrapper {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
        color: #ffffff;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }
</style>
