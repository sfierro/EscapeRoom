<script>
    const { src, alt, class: className = "" } = $props();
    let zoomed = $state(false);

    function handleKeydown(event) {
        if (event.key === "Escape") {
            zoomed = false;
        }
    }
</script>

<button class="zoom-trigger" onclick={() => (zoomed = true)}>
    <img {src} {alt} class={className} />
</button>

{#if zoomed}
    <div
        class="zoom-overlay"
        onclick={() => (zoomed = false)}
        onkeydown={handleKeydown}
        role="button"
        tabindex="-1"
    >
        <img {src} {alt} class="zoomed-image" />
    </div>
{/if}

<style>
    .zoom-trigger {
        all: unset;
        cursor: zoom-in;
        display: inline-flex;
    }

    .zoom-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: zoom-out;
    }

    .zoomed-image {
        max-width: 92vw;
        max-height: 92vh;
        object-fit: contain;
    }
</style>
