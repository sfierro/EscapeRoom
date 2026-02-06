<script>
    const { cx, cy, onClick } = $props();

    function handleClick() {
        if (onClick) {
            onClick();
        } else {
            console.log("Hotspot clicked");
        }
    }

    function handleKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
        }
    }
</script>

<g
    class="hotspot-group"
    role="button"
    onclick={handleClick}
    onkeydown={handleKeydown}
    tabindex="0"
    aria-label="Hotspot"
>
    <rect class="hitbox" x={cx - 80} y={cy - 80} width={160} height={160} />
    <circle class="circle" {cx} {cy} r={50} />
</g>

<style>
    .hotspot-group:focus:not(:focus-visible) {
        outline: none;
    }

    .hitbox {
        fill: transparent;
        pointer-events: all;
    }

    .circle {
        fill: rgba(255, 255, 255, 0.25);
        stroke: rgba(255, 255, 255, 0.5);
        stroke-width: 2;
        opacity: 0;
        transition: opacity 150ms;
    }

    .hotspot-group:hover .circle {
        opacity: 1;
    }
</style>
