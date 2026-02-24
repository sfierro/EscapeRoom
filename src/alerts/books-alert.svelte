<script>
    import { closeAlert } from "../game-state.svelte";
    import FullImageAlert from "./ui/FullImageAlert.svelte";
    import booksImage from "../assets/clues/books.png";
</script>

<FullImageAlert src={booksImage} alt="Books" onClose={closeAlert} />
