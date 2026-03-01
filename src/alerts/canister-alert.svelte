<script>
    import {
        gameState,
        closeAlert,
        addToInventory,
    } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
    import ActionButtonAlert from "./ui/ActionButtonAlert.svelte";
    import Alert from "../Alert.svelte";
    import DirectionalLock from "../DirectionalLock.svelte";

    function collectToothbrush() {
        addToInventory("toothbrush");
        gameState.toothbrushCollected = true;
        closeAlert();
    }
</script>

{#if gameState.toothbrushCollected}
    <TextAlert text="The canister is empty." onClose={closeAlert} />
{:else if gameState.canisterOpen}
    <ActionButtonAlert
        emoji="🪥"
        text="Inside the canister you find a toothbrush."
        buttonText="Take toothbrush"
        onAction={collectToothbrush}
        onClose={closeAlert}
    />
{:else}
    <Alert onClose={closeAlert}>
        <div class="flex flex-col items-center justify-center">
            <DirectionalLock
                onEnter={(value) => value === "RULDL"}
                onSuccess={() => (gameState.canisterOpen = true)}
            />
            <p class="alert-text">This canister is sealed with a directional lock.</p>
        </div>
    </Alert>
{/if}
