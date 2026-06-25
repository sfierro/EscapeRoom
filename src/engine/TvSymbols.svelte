<script>
    import SymbolIcon from "./SymbolIcon.svelte";

    const { tvImage, sequence } = $props();
</script>

<div class="tv-container">
    <img src={tvImage} alt="TV" class="tv-image" />
    <div class="symbols-overlay">
        {#each sequence as name, i (i)}
            <div
                class="symbol"
                style="animation-delay: {(i + 1) * 1.5}s"
            >
                <SymbolIcon {name} />
            </div>
        {/each}
    </div>
</div>

<style>
    .tv-container {
        position: relative;
        display: inline-block;
        line-height: 0;
    }

    .tv-image {
        max-width: 100%;
        max-height: 500px;
        object-fit: contain;
        border-radius: 8px;
        display: block;
    }

    .symbols-overlay {
        position: absolute;
        top: 43%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
    }

    .symbol {
        grid-area: 1 / 1;
        width: 96px;
        height: 96px;
        color: #555;
        opacity: 0;
        animation: symbol-flash 10s linear infinite;
    }

    .symbol :global(.symbol-svg) {
        width: 100%;
        height: 100%;
    }

    @keyframes symbol-flash {
        0% {
            opacity: 0;
        }
        1% {
            opacity: 1;
        }
        10% {
            opacity: 1;
        }
        11% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }
</style>
