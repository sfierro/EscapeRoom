<script>
    import { closeAlert } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert text="It's not snack time." onClose={closeAlert} />
