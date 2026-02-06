<script>
    const { onClose, children } = $props();

    function handleOverlayClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    function handleOverlayKeydown(event) {
        if (event.key === "Escape") {
            onClose();
        }
    }
</script>

<div
    class="alert-overlay"
    onclick={handleOverlayClick}
    onkeydown={handleOverlayKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
>
    <div class="alert">
        <button class="close-button" onclick={onClose} aria-label="Close">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
        <div class="alert-content">
            {@render children()}
        </div>
    </div>
</div>

<style>
    .alert-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .alert {
        background-color: rgba(229, 229, 229, 1);
        color: #000;
        border-radius: 12px;
        padding: 24px 32px;
        min-width: 300px;
        max-width: 90vw;
        width: fit-content;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .close-button {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        color: #000;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .close-button:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .close-button:focus:not(:focus-visible) {
        outline: none;
    }

    .alert-content {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
    }
</style>
