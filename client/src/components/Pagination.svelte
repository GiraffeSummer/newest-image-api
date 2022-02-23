<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';

  export let currentPage = 1;
  export let maxItems = 10;
  export let items = [];
  export let key = null;

  if (!(key in items[0])) key = null;

  const dispatch = createEventDispatcher();
  /*afterUpdate(() => {
    if (currentPage > buttons.length) {
      currentPage = buttons.length;
    } else if (currentPage < 1) {
      currentPage = 1;
    }
  });*/

  function changePage(pageID) {
    currentPage = pageID;
    dispatch('pageChanged');
  }

  //these are for later
  let pre = [];
  let pos = [];

  /*  $: maxPages = items.slice(
    (currentPage - 1) * maxItems,
    currentPage * maxItems
  ).length;*/

  $: maxPages =
    items.length / maxItems < 1 ? 1 : Math.ceil(items.length / maxItems);

  $: next = currentPage < maxPages;
  $: back = currentPage > 1;
</script>

<div class="row {$$props.class}">
  {#if key == null}
    {#each items.slice((currentPage - 1) * maxItems, currentPage * maxItems) as item}
      <slot name="body" prop={item} />
    {/each}
  {:else}
    {#each items.slice((currentPage - 1) * maxItems, currentPage * maxItems) as item (item[key])}
      <slot name="body" prop={item} />
    {/each}
  {/if}
</div>
<div class="row {$$props.class}">
  <div
    class="button-group col-md-3 center"
    style={maxPages == 1 ? 'display: none;' : ''}
  >
    <button disabled={!back} on:click={changePage(currentPage - 1)}
      >◀ Back</button
    >
    {#each pre as l, i}
      <button>{i}</button>
    {/each}
    <button disabled>{currentPage}/{maxPages}</button>
    {#each pos as l, i}
      <button>{i}</button>
    {/each}
    <button disabled={!next} on:click={changePage(currentPage + 1)}
      >Next ▶
    </button>
  </div>
</div>

<style>
  button:disabled {
    pointer-events: none;
  }
</style>
