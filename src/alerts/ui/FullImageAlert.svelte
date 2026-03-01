<script>
    import Alert from "../../Alert.svelte";
    import ZoomableImage from "./ZoomableImage.svelte";

    const { src, alt, onClose } = $props();
</script>

<Alert {onClose} transparent>
    <ZoomableImage {src} {alt} class="full-image" />
</Alert>

<style>
    :global(.full-image) {
        max-width: 80vw;
        max-height: 80vh;
        object-fit: contain;
        display: block;
    }
</style>
