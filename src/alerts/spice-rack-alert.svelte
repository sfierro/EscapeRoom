<script>
  import { closeAlert } from "../game-state.svelte";
  import spicesImage from "../assets/clues/spices.png";
  import ClueAlert from "./ui/ClueAlert.svelte";
</script>

<ClueAlert src={spicesImage} alt="Spice Rack" imageClass="large-clue-image" onClose={closeAlert} >
  <p class="alert-text">Some spices seem more full than others.<br />Do those colors look familiar?</p>
</ClueAlert>
