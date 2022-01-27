<script>
  import Chip from "./chip.svelte";
  export let chips;
</script>

<div>
  {#if chips.length > 0}
    {#each chips as chip}
      <Chip src={chip.src} alt={chip.alt}>
        {typeof chip == "string" ? chip : chip.text}
      </Chip>
    {/each}
  {/if}
</div>
