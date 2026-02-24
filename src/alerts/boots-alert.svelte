<script>
    import { closeAlert } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert text="A pair of muddy boots." onClose={closeAlert} />
