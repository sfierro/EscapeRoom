<script>
    import {
        gameState,
        closeAlert,
        removeFromInventory,
        hasItem,
    } from "../game-state.svelte";
    import Alert from "../Alert.svelte";
    import ClueAlert from "./ui/ClueAlert.svelte";
    import toothbrush2Image from "../assets/clues/toothbrush-2.png";
    import toothbrush3Image from "../assets/clues/toothbrush-3.png";

    function placeToothbrush() {
        removeFromInventory("toothbrush");
        gameState.toothbrushPlaced = true;
    }
</script>

{#if gameState.toothbrushPlaced}
    <ClueAlert
        src={toothbrush3Image}
        alt="Toothbrushes"
        imageClass="large-clue-image"
        onClose={closeAlert}
    />
{:else}
    <ClueAlert
        src={toothbrush2Image}
        alt="Toothbrushes"
        imageClass="large-clue-image"
        onClose={closeAlert}
    >
        {#if hasItem("toothbrush")}
            <button class="action-button" onclick={placeToothbrush}>
                Place toothbrush
            </button>
        {:else}
            <p class="alert-text">
                Looks like another toothbrush might be able to fit in the
                holder.
            </p>
        {/if}
    </ClueAlert>
{/if}
