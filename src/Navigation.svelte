<script>
    const { hasPreviousRoom, hasNextRoom, onPrevious, onNext } = $props();
</script>

<div class="navigation-container">
    {#if hasPreviousRoom}
        <button
            class="nav-button nav-button-left"
            onclick={onPrevious}
            aria-label="Previous room"
        >
            <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
            <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M19.5025 20.835L2.99281 13.4725C1.66906 12.8822 1.66906 11.1178 2.99281 10.5275L19.5025 3.16496C20.9984 2.49789 22.5499 3.97914 21.809 5.36689L18.657 11.2706C18.4118 11.7298 18.4118 12.2702 18.657 12.7294L21.809 18.6331C22.5499 20.0209 20.9984 21.5021 19.5025 20.835Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                />
            </svg>
        </button>
    {/if}

    {#if hasNextRoom}
        <button
            class="nav-button nav-button-right"
            onclick={onNext}
            aria-label="Next room"
        >
            <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
            <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M4.49746 20.835L21.0072 13.4725C22.3309 12.8822 22.3309 11.1178 21.0072 10.5275L4.49746 3.16496C3.00163 2.49789 1.45006 3.97914 2.19099 5.36689L5.34302 11.2706C5.58817 11.7298 5.58818 12.2702 5.34302 12.7294L2.19099 18.6331C1.45007 20.0209 3.00163 21.5021 4.49746 20.835Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                />
            </svg>
        </button>
    {/if}
</div>

<style>
    .navigation-container {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        pointer-events: none;
        z-index: 10;
    }

    .nav-button-left {
        margin-right: auto;
    }

    .nav-button-right {
        margin-left: auto;
    }

    .nav-button {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
        color: white;
        transition: all 0.2s ease;
    }

    .nav-button:hover {
        background: rgba(0, 0, 0, 0.7);
        border-color: rgba(255, 255, 255, 0.5);
        transform: scale(1.1);
    }

    .nav-button:active {
        transform: scale(0.95);
    }

    .nav-button:focus:not(:focus-visible) {
        outline: none;
    }

    .nav-button svg {
        width: 32px;
        height: 32px;
    }
</style>
