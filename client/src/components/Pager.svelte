<script>
  import { goto } from '@roxi/routify';
  export let list = [];
  export let component;
  export let prop = 'prop';
  export let maxItems = 20;
  export let page;

  const changePage = (nr) => {
    page = nr;
    $goto('./' + page);
  };

  $: next = page < maxPages;
  $: back = page > 1;

  $: maxPages = list.length / maxItems < 1 ? 1 : list.length / maxItems;

  $: page = parseInt(page);
  changePage(page);

  $: proppedList = list.map((x) => {
    let t = {};
    t[prop] = x;
    return t;
  });

  $: items = proppedList.slice(
    maxItems * (page - 1) < 0 ? 0 : maxItems * (page - 1),
    maxItems * (page - 1) + maxItems
  );

  //this is for future expansion (direct clickable pages)
  let len = [];
</script>

<div class="row">
  {#each items as item}
    <svelte:component this={component} {...item} />
  {/each}
</div>
<div class="button-group" style={maxPages == 1 ? 'display: none;' : ''}>
  <button disabled={!back} on:click={changePage(page - 1)}>◀ Back</button>
  <button disabled>{page}</button>
  {#each len as l, i}
    <button>{i}</button>
  {/each}
  <button disabled={!next} on:click={changePage(page + 1)}>Next ▶ </button>
</div>

<style>
  .button-group {
    max-width: 20%;
  }
  button:disabled {
    pointer-events: none;
  }
  button:hover {
    border-radius: 5px;
  }
</style>
