<script>
    import NumberLockOpenIcon from "./icons/number-lock-open-icon.svelte";
    import NumberLockClosedIcon from "./icons/number-lock-closed-icon.svelte";

    const SYMBOLS = ["diamond", "star", "circle", "square", "triangle"];

    const { slots = 5, onEnter, onSuccess } = $props();

    let values = $state([]);
    let disabled = $state(false);
    let incorrect = $state(false);

    $effect(() => {
        if (values.length !== slots) {
            values = Array(slots).fill(0);
        }
    });

    function increment(index) {
        if (disabled || incorrect) return;
        values[index] = (values[index] + 1) % SYMBOLS.length;
    }

    function decrement(index) {
        if (disabled || incorrect) return;
        values[index] = (values[index] - 1 + SYMBOLS.length) % SYMBOLS.length;
    }

    function getValue() {
        return values.map((v) => SYMBOLS[v]);
    }

    function handleEnter() {
        if (disabled || incorrect || !onEnter) return;
        const isCorrect = onEnter(getValue());
        if (isCorrect) {
            disabled = true;
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1000);
        } else {
            incorrect = true;
            setTimeout(() => {
                incorrect = false;
            }, 1000);
        }
    }
</script>

<div class="symbol-lock" class:disabled>
    {#each values as val, index}
        <div class="slot-container">
            <button
                class="arrow-button arrow-up"
                onclick={() => increment(index)}
                aria-label="Next symbol"
                disabled={disabled || incorrect}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M18 15L12 9L6 15"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
            <div class="symbol-display">
                <svg class="symbol-icon" viewBox="0 0 24 24">
                    {#if SYMBOLS[val] === "diamond"}
                        <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" />
                    {:else if SYMBOLS[val] === "star"}
                        <polygon
                            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                            fill="currentColor"
                        />
                    {:else if SYMBOLS[val] === "circle"}
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                    {:else if SYMBOLS[val] === "square"}
                        <rect x="3" y="3" width="18" height="18" fill="currentColor" />
                    {:else if SYMBOLS[val] === "triangle"}
                        <polygon points="12,2 23,21 1,21" fill="currentColor" />
                    {/if}
                </svg>
            </div>
            <button
                class="arrow-button arrow-down"
                onclick={() => decrement(index)}
                aria-label="Previous symbol"
                disabled={disabled || incorrect}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
    {/each}
    {#if onEnter}
        <button
            class="lock-button"
            class:unlocked={disabled}
            class:incorrect
            onclick={handleEnter}
            disabled={disabled || incorrect}
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
    {/if}
</div>

<style>
    .symbol-lock {
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
        );
        border-radius: 20px;
        backdrop-filter: blur(10px);
    }

    .symbol-lock.disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    .slot-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        position: relative;
    }

    .arrow-button {
        background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        cursor: pointer;
        padding: 6px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2c3e50;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 36px;
        min-height: 32px;
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        position: relative;
        overflow: hidden;
    }

    .arrow-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 100%
        );
        opacity: 0;
        transition: opacity 0.2s;
    }

    .arrow-button:hover {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.12),
            0 2px 4px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        transform: translateY(-1px);
    }

    .arrow-button:hover::before {
        opacity: 1;
    }

    .arrow-button:active {
        background: linear-gradient(180deg, #e9ecef 0%, #dee2e6 100%);
        box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.1),
            inset 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
    }

    .arrow-button:focus:not(:focus-visible) {
        outline: none;
    }

    .arrow-button:focus-visible {
        outline: 2px solid #4a90e2;
        outline-offset: 2px;
        box-shadow:
            0 0 0 4px rgba(74, 144, 226, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .arrow-button svg {
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
        transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .arrow-button:active svg {
        transform: scale(0.9);
    }

    .arrow-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    .symbol-display {
        background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
        border: 2px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        width: 56px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        overflow: hidden;
        user-select: none;
    }

    .symbol-display::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 100%
        );
        pointer-events: none;
    }

    .symbol-icon {
        width: 32px;
        height: 32px;
        color: #1a1a1a;
        position: relative;
        z-index: 1;
    }

    .slot-container:hover .symbol-display {
        box-shadow:
            0 6px 12px rgba(0, 0, 0, 0.15),
            0 3px 6px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 0 0 1px rgba(74, 144, 226, 0.2);
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
        margin-left: 8px;
        width: fit-content;
        height: fit-content;
    }

    .lock-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 100%
        );
        opacity: 0;
        transition: opacity 0.2s;
    }

    .lock-button:hover:not(:disabled) {
        background: linear-gradient(180deg, #5ba0f2 0%, #4080cd 100%);
        box-shadow:
            0 6px 8px rgba(74, 144, 226, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }

    .lock-button:hover:not(:disabled)::before {
        opacity: 1;
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

    .lock-button.unlocked::before {
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.25) 0%,
            transparent 100%
        );
        opacity: 1;
    }

    .lock-button.incorrect {
        background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
        box-shadow:
            0 4px 6px rgba(239, 68, 68, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .lock-button.incorrect::before {
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.25) 0%,
            transparent 100%
        );
        opacity: 1;
    }

    .lock-button:focus:not(:focus-visible) {
        outline: none;
    }

    .lock-button:focus-visible {
        outline: 2px solid #4a90e2;
        outline-offset: 2px;
    }

    .lock-button.unlocked:focus-visible {
        outline: 2px solid #10b981;
    }

    .lock-button.incorrect:focus-visible {
        outline: 2px solid #ef4444;
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
