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

<svg
    class="hotspot-svg"
    width="1920"
    height="1080"
    viewBox="0 0 1920 1080"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
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
</svg>

<style>
    .hotspot-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        user-select: none;
        -webkit-user-drag: none;
        -moz-user-select: none;
    }

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
