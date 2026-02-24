<script>
    import { closeAlert } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert text="A plate of chocolate chip cookies." onClose={closeAlert} />
