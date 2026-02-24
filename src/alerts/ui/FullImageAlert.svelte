<script>
    import Alert from "../../Alert.svelte";

    const { src, alt, onClose } = $props();
</script>

<Alert {onClose} transparent>
    <img {src} {alt} class="full-image" />
</Alert>

<style>
    .full-image {
        max-width: 80vw;
        max-height: 80vh;
        object-fit: contain;
        display: block;
    }
</style>
