<script>
    const { name } = $props();
</script>

<svg class="symbol-svg" viewBox="0 0 24 24" aria-hidden="true">
    {#if name === "diamond"}
        <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" />
    {:else if name === "star"}
        <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill="currentColor"
        />
    {:else if name === "circle"}
        <circle cx="12" cy="12" r="10" fill="currentColor" />
    {:else if name === "square"}
        <rect x="3" y="3" width="18" height="18" fill="currentColor" />
    {:else if name === "triangle"}
        <polygon points="12,2 23,21 1,21" fill="currentColor" />
    {/if}
</svg>

<style>
    .symbol-svg {
        display: inline-block;
    }
</style>
