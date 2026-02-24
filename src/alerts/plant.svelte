<script>
    import { closeAlert } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert
    text="This plant looks like it's getting plenty of sunlight."
    onClose={closeAlert}
/>
