<script>
    import NumberLockOpenIcon from "./icons/number-lock-open-icon.svelte";
    import NumberLockClosedIcon from "./icons/number-lock-closed-icon.svelte";

    const { digits = 4, onEnter } = $props();

    let values = $state([]);
    let disabled = $state(false);
    let incorrect = $state(false);

    $effect(() => {
        const newLength = digits;
        if (values.length !== newLength) {
            values = Array(newLength).fill(0);
        }
    });

    function increment(index) {
        if (disabled || incorrect) return;
        values[index] = (values[index] + 1) % 10;
    }

    function decrement(index) {
        if (disabled || incorrect) return;
        values[index] = (values[index] - 1 + 10) % 10;
    }

    function getValue() {
        return values.join("");
    }

    function handleEnter() {
        if (disabled || incorrect || !onEnter) return;
        const isCorrect = onEnter(getValue());
        if (isCorrect) {
            disabled = true;
        } else {
            incorrect = true;
            setTimeout(() => {
                incorrect = false;
            }, 1000);
        }
    }
</script>

<div class="number-lock" class:disabled>
    {#each values as _, index}
        <div class="digit-container">
            <button
                class="arrow-button arrow-up"
                onclick={() => increment(index)}
                aria-label="Increment digit"
                disabled={disabled || incorrect}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18 15L12 9L6 15"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
            <div class="digit-display" data-digit={values[index]}>
                <span class="digit-value">{values[index]}</span>
            </div>
            <button
                class="arrow-button arrow-down"
                onclick={() => decrement(index)}
                aria-label="Decrement digit"
                disabled={disabled || incorrect}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
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
    .number-lock {
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

    .number-lock.disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    .digit-container {
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

    .arrow-button:disabled:hover {
        transform: none;
        background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .digit-display {
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
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .digit-display::before {
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

    .digit-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1a1a1a;
        font-family:
            "Courier New", Courier, "Lucida Console", Monaco, "Consolas",
            "Liberation Mono", "DejaVu Sans Mono", monospace;
        letter-spacing: 0.05em;
        text-shadow:
            0 1px 2px rgba(255, 255, 255, 0.8),
            0 1px 1px rgba(0, 0, 0, 0.1);
        transition:
            transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.2s;
        display: inline-block;
        position: relative;
        z-index: 1;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    /* Animation for digit changes */
    .digit-display[data-digit] .digit-value {
        animation: digitChange 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes digitChange {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    /* Subtle glow effect on hover */
    .digit-container:hover .digit-display {
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

    .lock-button.incorrect:hover:not(:disabled) {
        background: linear-gradient(180deg, #f87171 0%, #ef4444 100%);
        box-shadow:
            0 6px 8px rgba(239, 68, 68, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .lock-button:focus:not(:focus-visible) {
        outline: none;
    }

    .lock-button:focus-visible {
        outline: 2px solid #4a90e2;
        outline-offset: 2px;
        box-shadow:
            0 0 0 4px rgba(74, 144, 226, 0.3),
            0 4px 6px rgba(74, 144, 226, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .lock-button.unlocked:focus-visible {
        outline: 2px solid #10b981;
        box-shadow:
            0 0 0 4px rgba(16, 185, 129, 0.3),
            0 4px 6px rgba(16, 185, 129, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .lock-button.incorrect:focus-visible {
        outline: 2px solid #ef4444;
        box-shadow:
            0 0 0 4px rgba(239, 68, 68, 0.3),
            0 4px 6px rgba(239, 68, 68, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1);
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
