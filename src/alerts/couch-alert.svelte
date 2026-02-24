<script>
    import { closeAlert } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert text="That couch looks comfy." onClose={closeAlert} />
