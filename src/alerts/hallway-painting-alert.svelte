<script>
  import { closeAlert } from "../game-state.svelte";
  import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert
  text="An interesting painting of a forest scene."
  onClose={closeAlert}
/>
