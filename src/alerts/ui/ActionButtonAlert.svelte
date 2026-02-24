<script>
    import Alert from "../../Alert.svelte";

    const { emoji, text, buttonText, onAction, onClose } = $props();
</script>

<Alert {onClose}>
    <div class="found-item-container">
        <span class="found-item-emoji">{emoji}</span>
        <p class="alert-text">{text}</p>
        <button class="action-button" onclick={onAction}>
            {buttonText}
        </button>
    </div>
</Alert>

<style>
    .found-item-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
    }

    .found-item-emoji {
        font-size: 3.5rem;
        line-height: 1;
    }
</style>
