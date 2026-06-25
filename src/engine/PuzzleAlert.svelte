<script>
    import {
        gameState,
        getActiveGame,
        getFlag,
        setFlag,
        hasItem,
        addToInventory,
        removeFromInventory,
        closeAlert,
        freezeTimer,
    } from "../game-state.svelte";

    import Alert from "../Alert.svelte";
    import TextAlert from "../alerts/ui/TextAlert.svelte";
    import ClueAlert from "../alerts/ui/ClueAlert.svelte";
    import ActionButtonAlert from "../alerts/ui/ActionButtonAlert.svelte";

    import PasswordLock from "../PasswordLock.svelte";
    import NumberLock from "../NumberLock.svelte";
    import SymbolLock from "../SymbolLock.svelte";
    import DirectionalLock from "../DirectionalLock.svelte";
    import RemoteLock from "./RemoteLock.svelte";
    import SlidingPuzzle from "../SlidingPuzzle.svelte";
    import TvSymbols from "./TvSymbols.svelte";

    const { puzzleId } = $props();

    const game = getActiveGame();
    const puzzle = $derived(game.puzzles.find((p) => p.id === puzzleId));

    const solved = $derived(
        puzzle?.solvedFlag ? getFlag(puzzle.solvedFlag) : false,
    );

    // ─── Lock submission handlers ───────────────────────────────
    function onLockSuccess() {
        if (puzzle?.solvedFlag) setFlag(puzzle.solvedFlag);
        // The alert stays open – the reward immediately replaces the lock UI.
        // Exception: an `escape` reward triggers the win transition.
        if (puzzle?.reward?.kind === "escape") {
            triggerEscape();
        }
    }

    function checkPasswordAnswer(value, expected) {
        return value === expected;
    }

    function checkNumberAnswer(value, expected) {
        return value === expected;
    }

    function checkSymbolAnswer(values, expected) {
        if (!Array.isArray(values) || !Array.isArray(expected)) return false;
        if (values.length !== expected.length) return false;
        return values.every((v, i) => v === expected[i]);
    }

    function checkDirectionalAnswer(value, expected) {
        return value === expected;
    }

    // ─── Use-item handler ───────────────────────────────────────
    function performItemUse() {
        if (!puzzle?.use) return;
        if (puzzle.use.consumesItem) {
            removeFromInventory(puzzle.use.requires);
        }
        if (puzzle.solvedFlag) setFlag(puzzle.solvedFlag);
        if (puzzle.reward?.kind === "escape") {
            triggerEscape();
        }
    }

    function triggerEscape() {
        freezeTimer();
        gameState.showingOutside = true;
        closeAlert();
    }

    // ─── Give-item reward handler ───────────────────────────────
    function collectRewardItem() {
        if (puzzle?.reward?.kind !== "give_item") return;
        addToInventory(puzzle.reward.item);
        setFlag(puzzle.reward.collectedFlag);
        closeAlert();
    }
</script>

{#if !puzzle}
    <TextAlert text="Puzzle not found: {puzzleId}" onClose={closeAlert} />
{:else if puzzle.clue && !puzzle.lock && !puzzle.use}
    <!-- ─── Pure clue puzzle ───────────────────────────────────── -->
    {#if puzzle.clue.image}
        <ClueAlert
            src={puzzle.clue.image}
            alt={puzzle.id}
            imageClass={puzzle.clue.imageClass ?? "clue-image"}
            onClose={closeAlert}
        >
            {#if puzzle.clue.text}
                <p class="alert-text">{puzzle.clue.text}</p>
            {/if}
        </ClueAlert>
    {:else if puzzle.clue.text}
        <TextAlert text={puzzle.clue.text} onClose={closeAlert} />
    {/if}
{:else if solved && puzzle.reward}
    <!-- ─── Post-solve reward ──────────────────────────────────── -->
    {#if puzzle.reward.kind === "clue"}
        {#if puzzle.reward.image}
            <ClueAlert
                src={puzzle.reward.image}
                alt={puzzle.id}
                imageClass={puzzle.reward.imageClass ?? "clue-image"}
                onClose={closeAlert}
            >
                {#if puzzle.reward.text}
                    <p class="alert-text">{puzzle.reward.text}</p>
                {/if}
            </ClueAlert>
        {:else if puzzle.reward.text}
            <TextAlert text={puzzle.reward.text} onClose={closeAlert} />
        {/if}
    {:else if puzzle.reward.kind === "give_item"}
        {#if getFlag(puzzle.reward.collectedFlag)}
            <TextAlert text={puzzle.reward.emptyText} onClose={closeAlert} />
        {:else}
            <ActionButtonAlert
                emoji={puzzle.reward.emoji}
                text={puzzle.reward.text}
                buttonText={puzzle.reward.buttonText}
                onAction={collectRewardItem}
                onClose={closeAlert}
            />
        {/if}
    {:else if puzzle.reward.kind === "sliding_puzzle"}
        <Alert onClose={closeAlert}>
            <div class="sliding-wrapper">
                <SlidingPuzzle
                    puzzleId={puzzle.id}
                    image={puzzle.reward.image}
                    cols={puzzle.reward.cols}
                    rows={puzzle.reward.rows}
                    seed={puzzle.reward.seed}
                    imageWidth={puzzle.reward.imageWidth ?? 480}
                    imageHeight={puzzle.reward.imageHeight ?? 360}
                />
                {#if puzzle.reward.text}
                    <p class="alert-text">{puzzle.reward.text}</p>
                {/if}
            </div>
        </Alert>
    {:else if puzzle.reward.kind === "tv_symbols"}
        <Alert onClose={closeAlert}>
            <TvSymbols
                tvImage={puzzle.reward.tvImage}
                sequence={puzzle.reward.sequence}
            />
        </Alert>
    {:else if puzzle.reward.kind === "escape"}
        <!-- Player navigated back to a door they already opened. -->
        <TextAlert text="You've already escaped!" onClose={closeAlert} />
    {/if}
{:else if puzzle.lock}
    <!-- ─── Locked puzzle ──────────────────────────────────────── -->
    <Alert onClose={closeAlert}>
        <div class="lock-wrapper">
            {#if puzzle.lock.kind === "password"}
                <PasswordLock
                    onEnter={(v) => checkPasswordAnswer(v, puzzle.lock.answer)}
                    onSuccess={onLockSuccess}
                />
            {:else if puzzle.lock.kind === "number"}
                <NumberLock
                    digits={puzzle.lock.digits}
                    onEnter={(v) => checkNumberAnswer(v, puzzle.lock.answer)}
                    onSuccess={onLockSuccess}
                />
            {:else if puzzle.lock.kind === "symbol"}
                <SymbolLock
                    slots={puzzle.lock.slots}
                    onEnter={(vals) =>
                        checkSymbolAnswer(vals, puzzle.lock.answer)}
                    onSuccess={onLockSuccess}
                />
            {:else if puzzle.lock.kind === "directional"}
                <DirectionalLock
                    onEnter={(v) =>
                        checkDirectionalAnswer(v, puzzle.lock.answer)}
                    onSuccess={onLockSuccess}
                />
            {:else if puzzle.lock.kind === "remote"}
                <RemoteLock
                    remoteImage={puzzle.lock.remoteImage}
                    answer={puzzle.lock.answer}
                    maxDigits={puzzle.lock.maxDigits}
                    onSuccess={onLockSuccess}
                />
            {/if}
            {#if puzzle.prompt}
                <p class="alert-text">{puzzle.prompt}</p>
            {/if}
        </div>
    </Alert>
{:else if puzzle.use}
    <!-- ─── Use-an-item puzzle (locked or ready) ───────────────── -->
    {@const u = puzzle.use}
    {@const ready = hasItem(u.requires)}
    {#if u.previewImage}
        <ClueAlert
            src={u.previewImage}
            alt={puzzle.id}
            imageClass={u.previewImageClass ?? "clue-image"}
            onClose={closeAlert}
        >
            {#if ready}
                {#if u.useEmoji}
                    <span class="found-item-emoji">{u.useEmoji}</span>
                {/if}
                <button class="action-button" onclick={performItemUse}>
                    {u.useButtonText}
                </button>
            {:else}
                <p class="alert-text">{u.lockedText ?? u.useText}</p>
            {/if}
        </ClueAlert>
    {:else if ready}
        <ActionButtonAlert
            emoji={u.useEmoji ?? ""}
            text={u.useText}
            buttonText={u.useButtonText}
            onAction={performItemUse}
            onClose={closeAlert}
        />
    {:else}
        <TextAlert
            text={u.lockedText ?? u.useText}
            onClose={closeAlert}
        />
    {/if}
{:else}
    <!-- ─── Fallback: shouldn't normally happen ────────────────── -->
    <TextAlert text="Nothing happens." onClose={closeAlert} />
{/if}

<style>
    .lock-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .sliding-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 32px;
    }

    .found-item-emoji {
        font-size: 3.5rem;
        line-height: 1;
    }
</style>
