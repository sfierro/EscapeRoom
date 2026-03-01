<script>
    import { closeAlert } from "../game-state.svelte";
    import ClueAlert from "./ui/ClueAlert.svelte";
    import booksImage from "../assets/clues/books.png";
</script>

<ClueAlert src={booksImage} alt="Books" imageClass="large-clue-image" onClose={closeAlert} >
  <p class="alert-text">Judging these books by their covers might not be a bad idea.</p>
</ClueAlert>
