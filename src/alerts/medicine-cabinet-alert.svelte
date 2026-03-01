<script>
    import { gameState, closeAlert } from "../game-state.svelte";
    import Alert from "../Alert.svelte";
    import ClueAlert from "./ui/ClueAlert.svelte";
    import NumberLock from "../NumberLock.svelte";
    import vitaminsImage from "../assets/clues/vitamins.png";
</script>

{#if gameState.medicineCabinetOpen}
    <ClueAlert
        src={vitaminsImage}
        imageClass="large-clue-image"
        alt="Vitamin Bottles"
        onClose={closeAlert}
    >
        <p class="alert-text">An assortment of colorful vitamins.</p>
    </ClueAlert>
{:else}
    <Alert onClose={closeAlert}>
        <NumberLock
            digits={3}
            onEnter={(value) => value === "232"}
            onSuccess={() => (gameState.medicineCabinetOpen = true)}
        />
    </Alert>
{/if}
