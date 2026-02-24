<script>
    import {
        gameState,
        closeAlert,
        addToInventory,
    } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
    import ActionButtonAlert from "./ui/ActionButtonAlert.svelte";
    import Alert from "../Alert.svelte";
    import NumberLock from "../NumberLock.svelte";

    function collectKey() {
        gameState.drawerKeyCollected = true;
        addToInventory("key");
        closeAlert();
    }
</script>

{#if gameState.drawerKeyCollected}
    <TextAlert text="The drawer is empty." onClose={closeAlert} />
{:else if gameState.drawerUnlocked}
    <ActionButtonAlert
        emoji="🔑"
        text="Inside the drawer you find a key."
        buttonText="Take key"
        onAction={collectKey}
        onClose={closeAlert}
    />
{:else}
    <Alert onClose={closeAlert}>
        <NumberLock
            digits={4}
            onEnter={(value) => value === "2817"}
            onSuccess={() => (gameState.drawerUnlocked = true)}
        />
    </Alert>
{/if}
