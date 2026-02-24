<script>
    import {
        gameState,
        closeAlert,
        removeFromInventory,
        hasItem,
    } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
    import ActionButtonAlert from "./ui/ActionButtonAlert.svelte";

    function useKeyOnDoor() {
        removeFromInventory("key");
        gameState.showingOutside = true;
        closeAlert();
    }
</script>

{#if hasItem("key")}
    <ActionButtonAlert
        emoji="🔑"
        text="Use the key on the door?"
        buttonText="Use key"
        onAction={useKeyOnDoor}
        onClose={closeAlert}
    />
{:else}
    <TextAlert text="This door is locked!" onClose={closeAlert} />
{/if}
