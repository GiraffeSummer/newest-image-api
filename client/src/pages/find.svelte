<script>
  import Pagination from '../components/Pagination.svelte';
  import { metatags } from '@roxi/routify';
  import { backend, safeFileName, user } from '../stores.js';

  metatags.title = 'Find';
  metatags.description = 'search for gifs';

  let tags = '';
  let showNsfw = false;

  $: tags = safeFileName(tags);

  let lastSearch = '';
  let gifs = [];
  let result = {};

  //reduce spam of API requests
  let canSearch = true;
  $: canSearch = lastSearch != tags;

  const getData = async () => {
    if (!canSearch) return;

    lastSearch = `${tags.trim()}`;
    const res = await fetch(
      backend + '/api/find/' + tags.trim() + `${showNsfw ? '?nsfw=true' : ''}`,
      {
        credentials: 'include',
      }
    );
    const json = await res.json();
    gifs = json.gifs.map((a) => {
      delete a._id;
      delete a.__v;
      return a;
    });

    /*
        for (let i = 0; i < gifs.length; i++) {
          gifs[i].path = `<a href='${gifs[i].path}'>${gifs[i].name}</a>`;
        }
        //make avatar link
        gifs = gifs.map((a) => {
          a.user.avatar = `<a href='${a.user.avatar}'>${a.user.avatar}</a>`;
          return a;
        });*/

    /*gifImages = gifs.map((gif) => {
      return { name: gif.name, alt: gif.originalname, src: gif.url };
    });*/
    result = JSON.stringify(gifs, null, 2);
  };

  $: tags, getData();

  const checkEnter = (e, cb) => {
    if (e.key === 'Enter') cb(e);
  };
</script>

<form class="form input-group" on:submit|preventDefault={() => {}}>
  <input
    type="text"
    id="search"
    placeholder="Search..."
    bind:value={tags}
    on:keydown={(e) => {
      checkEnter(e, getData);
    }}
  />
  <label for="showNsfw">
    <input
      id="showNsfw"
      type="checkbox"
      bind:checked={showNsfw}
      on:change={getData}
    />
    Show Nsfw?
  </label>
  <button class="tertiary" on:click={getData} id="searchBtn">Search</button>
</form>
<br /><br />

{#if gifs.length > 0}
  <Pagination items={gifs} maxItems={10}>
    <div class="card" slot="body" let:prop={gif}>
      <figure>
        <h5 class="section">{gif.name}</h5>
        <img src={gif.url} alt={gif.originalname} class="section media dark" />
      </figure>

      <div class="card">
        <b>Tags:</b>
        {#each gif.tags as tag}
          {tag}<br />
        {/each}
      </div>
    </div>
  </Pagination>
  <br />
  <h3>Raw:</h3>
  <div id="code"><pre>{result}</pre></div>
{:else if lastSearch != ''}
  <h6><i>Nothing found...</i></h6>
{/if}

<style>
  h5 {
    cursor: default;
  }
  pre {
    overflow: scroll;
    height: 500px;
  }
  figure > img {
    object-fit: contain;
    min-width: 300px;
  }
</style>
