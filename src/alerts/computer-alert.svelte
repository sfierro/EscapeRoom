<script>
  import { gameState, closeAlert } from "../game-state.svelte";
  import Alert from "../Alert.svelte";
  import ClueAlert from "./ui/ClueAlert.svelte";
  import PasswordLock from "../PasswordLock.svelte";
  import mazeImage from "../assets/clues/maze-computer.png";
</script>

{#if gameState.computerSolved}
  <ClueAlert
    src={mazeImage}
    alt="Maze"
    imageClass="large-clue-image"
    onClose={closeAlert}
  >
    <p class="alert-text">Maybe we should follow the cat...</p>
  </ClueAlert>
{:else}
  <Alert onClose={closeAlert}>
    <div class="flex flex-col items-center justify-center">
      <PasswordLock
        onEnter={(value) => value === "BLACKCAT"}
        onSuccess={() => (gameState.computerSolved = true)}
      />
      <p class="alert-text">
        The computer is locked. I wonder what the password is.
      </p>
    </div>
  </Alert>
{/if}
