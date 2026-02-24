<script>
    import Alert from "../../Alert.svelte";

    const { text, onClose } = $props();
</script>

<Alert {onClose}>
    <p class="alert-text">{text}</p>
</Alert>
