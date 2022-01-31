<script>
  import { goto, params } from '@roxi/routify';
  export let list = [];
  export let component;
  export let prop = 'prop';
  export let maxItems = 10;
  export let properties = {};

  $: page = $params.page || 1;

  const changePage = (nr) => {
    page = nr || 1;
    $goto('./' + page);
  };

  $: next = page < maxPages;
  $: back = page > 1;

  $: maxPages = list.length / maxItems < 1 ? 1 : Math.ceil(list.length / maxItems);

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
  let pre = []; //before current page
  let pos = []; //after current page
</script>

<div class="row">
  {#each items as item}
    <svelte:component this={component} {...item} {item} {properties} />
  {/each}
</div>
<div class="button-group" style={maxPages == 1 ? 'display: none;' : ''}>
  <button disabled={!back} on:click={changePage(page - 1)}>◀ Back</button>
  {#each pre as l, i}
    <button>{i}</button>
  {/each}
  <button disabled>{page}/{maxPages}</button>
  {#each pos as l, i}
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
