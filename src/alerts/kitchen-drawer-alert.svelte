<script>
    import {
        gameState,
        closeAlert,
        addToInventory,
    } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
    import ActionButtonAlert from "./ui/ActionButtonAlert.svelte";
    import Alert from "../Alert.svelte";
    import SymbolLock from "../SymbolLock.svelte";

    const CORRECT_CODE = ["star", "star", "square", "triangle", "circle"];

    function collectScrewdriver() {
        gameState.screwdriverCollected = true;
        addToInventory("screwdriver");
        closeAlert();
    }
</script>

{#if gameState.screwdriverCollected}
    <TextAlert text="The drawer is empty." onClose={closeAlert} />
{:else if gameState.kitchenDrawerOpen}
    <ActionButtonAlert
        emoji="🪛"
        text="Inside the drawer you find a screwdriver."
        buttonText="Take screwdriver"
        onAction={collectScrewdriver}
        onClose={closeAlert}
    />
{:else}
    <Alert onClose={closeAlert}>
        <SymbolLock
            slots={5}
            onEnter={(values) =>
                values.every((v, i) => v === CORRECT_CODE[i])}
            onSuccess={() => (gameState.kitchenDrawerOpen = true)}
        />
    </Alert>
{/if}
