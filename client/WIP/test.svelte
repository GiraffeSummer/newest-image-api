<script>
  /* USe this page for testing (move to /WIP if not needed)*/
  import ChipManager from '../../WIP/chipManager.svelte';
  let chips = ['a', 'b', 'c'];

  let chipText = 'test123';
</script>

<ChipManager bind:chips />

<input value={chipText} />
<button
  on:click={() => {
    console.log(chips);
    chips.push(chipText);
    chipText = '';
  }}
>
  Add
</button>
