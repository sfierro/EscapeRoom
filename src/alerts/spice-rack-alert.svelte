<script>
  import { closeAlert } from "../game-state.svelte";
  import FullImageAlert from "./ui/FullImageAlert.svelte";
  import spicesImage from "../assets/clues/spices.png";
</script>

<FullImageAlert src={spicesImage} alt="Spice Rack" onClose={closeAlert} />
