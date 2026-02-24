<script>
    import Alert from "../../Alert.svelte";

    const { src, alt, onClose, children, imageClass = "clue-image" } = $props();
</script>

<Alert {onClose}>
    <div class="clue-container">
        <img {src} {alt} class={imageClass} />
        {#if children}
            {@render children()}
        {/if}
    </div>
</Alert>

<style>
    .clue-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        max-width: 500px;
    }

    .clue-container :global(.clue-image) {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: 8px;
    }

    .clue-container :global(.large-clue-image) {
        max-width: 100%;
        max-height: 600px;
        object-fit: contain;
        border-radius: 8px;
    }
</style>
