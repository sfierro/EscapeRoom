<script>
  import { closeAlert } from "../game-state.svelte";
  import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert
  text="A bowl of keys, but none of them seem to fit the front door."
  onClose={closeAlert}
/>
