<script>
    import { closeAlert } from "../game-state.svelte";
    import TextAlert from "./ui/TextAlert.svelte";
</script>

<TextAlert text="A colorful rug." onClose={closeAlert} />
