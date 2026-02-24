<script>
    import noteImage from "../assets/clues/note.png";
</script>

<div class="paper-wrapper">
    <svg
        class="paper-svg"
        viewBox="-8 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>paper</title>
        <path
            d="M13.52 5.72h-7.4c-0.36 0-0.56 0.2-0.6 0.24l-5.28 5.28c-0.040 0.040-0.24 0.24-0.24 0.56v12.2c0 1.24 1 2.24 2.24 2.24h11.24c1.24 0 2.24-1 2.24-2.24v-16.040c0.040-1.24-0.96-2.24-2.2-2.24zM5.28 8.56v1.8c0 0.32-0.24 0.56-0.56 0.56h-1.84l2.4-2.36zM14.080 24.040c0 0.32-0.28 0.56-0.56 0.56h-11.28c-0.32 0-0.56-0.28-0.56-0.56v-11.36h3.040c1.24 0 2.24-1 2.24-2.24v-3.040h6.52c0.32 0 0.56 0.24 0.56 0.56l0.040 16.080z"
        ></path>
    </svg>
    <img src={noteImage} alt="note" class="note-overlay" />
</div>

<style>
    .paper-wrapper {
        position: relative;
        display: inline-block;
    }

    .paper-svg {
        width: 100%;
        height: 100%;
        fill: #f5f0e6;
        filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.25));
    }

    .note-overlay {
        position: absolute;
        top: 28%;
        left: 15%;
        width: 72%;
        height: 58%;
        object-fit: contain;
        pointer-events: none;
    }
</style>
