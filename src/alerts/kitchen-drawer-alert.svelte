<script>
    import { gameState, closeAlert } from "../game-state.svelte";
    import Alert from "../Alert.svelte";
    import NumberLock from "../NumberLock.svelte";
    import ClueAlert from "./ui/ClueAlert.svelte";
    import noteImage from "../assets/clues/notepad.jpg";
</script>

{#if gameState.kitchenDrawerOpen}
    <ClueAlert
        src={noteImage}
        alt="note"
        imageClass="large-clue-image"
        onClose={closeAlert}
    >
        <p class="alert-text">Inside the drawer you find a note.</p>
    </ClueAlert>
{:else}
    <Alert onClose={closeAlert}>
        <NumberLock
            digits={4}
            onEnter={(value) => value === "3341"}
            onSuccess={() => (gameState.kitchenDrawerOpen = true)}
        />
    </Alert>
{/if}
