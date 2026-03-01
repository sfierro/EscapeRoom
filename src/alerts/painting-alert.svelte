<script>
  import {
    gameState,
    closeAlert,
    removeFromInventory,
    hasItem,
  } from "../game-state.svelte";
  import TextAlert from "./ui/TextAlert.svelte";
  import ActionButtonAlert from "./ui/ActionButtonAlert.svelte";
  import Alert from "../Alert.svelte";
  import SlidingPuzzle from "../SlidingPuzzle.svelte";

  function useScrewdriver() {
    removeFromInventory("screwdriver");
    gameState.paintingPried = true;
  }
</script>

{#if !gameState.paintingPried}
  <Alert onClose={closeAlert}>
  <div class="flex flex-col items-center justify-center gap-8">
    <SlidingPuzzle />
    <p class="alert-text">
      Behind the painting, hidden inside the frame, is a sliding puzzle.<br/>
      It looks like an altered replica of the original.
      </p>
    </div>
  </Alert>

{:else if hasItem("screwdriver")}
  <ActionButtonAlert
    emoji="🪛"
    text="The frame of this painting looks like it could be pried off with the right tool."
    buttonText="Use screwdriver"
    onAction={useScrewdriver}
    onClose={closeAlert}
  />
{:else}
  <TextAlert
    text="The frame of this painting looks like it could be pried off with the right tool."
    onClose={closeAlert}
  />
{/if}
