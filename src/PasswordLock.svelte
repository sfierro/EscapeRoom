<script>
    const { onEnter } = $props();

    let value = $state("");
    let disabled = $state(false);
    let incorrect = $state(false);
    let correct = $state(false);

    function handleEnter() {
        if (disabled || incorrect || !onEnter) return;
        const isCorrect = onEnter(value);
        if (isCorrect) {
            correct = true;
            disabled = true;
        } else {
            incorrect = true;
            setTimeout(() => {
                incorrect = false;
            }, 1000);
        }
    }

    function handleKeydown(event) {
        if (event.key === "Enter") {
            handleEnter();
        }
    }
</script>

<div class="password-lock" class:disabled>
    <div class="input-row">
        <input
            type="text"
            class="password-input"
            bind:value
            placeholder="Enter password..."
            onkeydown={handleKeydown}
            disabled={disabled || incorrect}
        />
        <button
            class="enter-button"
            class:correct
            class:incorrect
            onclick={handleEnter}
            disabled={disabled || incorrect}
            aria-label="Submit password"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {#if correct}
                    <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                {:else}
                    <path
                        d="M5 12H19M19 12L13 6M19 12L13 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                {/if}
            </svg>
        </button>
    </div>
</div>

<style>
    .password-lock {
        display: flex;
        flex-direction: column;
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

    .password-lock.disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    .input-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .password-input {
        font-size: 1.1rem;
        font-family:
            "Courier New", Courier, "Lucida Console", Monaco, "Consolas",
            "Liberation Mono", "DejaVu Sans Mono", monospace;
        letter-spacing: 0.05em;
        padding: 12px 16px;
        border: 2px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
        color: #1a1a1a;
        width: 220px;
        box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        outline: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .password-input::placeholder {
        color: #999;
        font-family: inherit;
        letter-spacing: normal;
    }

    .password-input:focus {
        border-color: rgba(74, 144, 226, 0.5);
        box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06),
            0 0 0 3px rgba(74, 144, 226, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .password-input:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .enter-button {
        background: linear-gradient(180deg, #4a90e2 0%, #357abd 100%);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 12px;
        cursor: pointer;
        padding: 10px 14px;
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

    .enter-button::before {
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

    .enter-button:hover:not(:disabled) {
        background: linear-gradient(180deg, #5ba0f2 0%, #4080cd 100%);
        box-shadow:
            0 6px 8px rgba(74, 144, 226, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }

    .enter-button:hover:not(:disabled)::before {
        opacity: 1;
    }

    .enter-button:active:not(:disabled) {
        background: linear-gradient(180deg, #357abd 0%, #2a5f9d 100%);
        box-shadow:
            0 2px 4px rgba(74, 144, 226, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
        transform: translateY(0);
    }

    .enter-button:disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

    .enter-button.correct {
        background: linear-gradient(180deg, #10b981 0%, #059669 100%);
        box-shadow:
            0 4px 6px rgba(16, 185, 129, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .enter-button.incorrect {
        background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
        box-shadow:
            0 4px 6px rgba(239, 68, 68, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .enter-button:focus:not(:focus-visible) {
        outline: none;
    }

    .enter-button:focus-visible {
        outline: 2px solid #4a90e2;
        outline-offset: 2px;
        box-shadow:
            0 0 0 4px rgba(74, 144, 226, 0.3),
            0 4px 6px rgba(74, 144, 226, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .enter-button svg {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        position: relative;
        z-index: 1;
    }
</style>
