<script>
  import Card from '../components/Card.svelte';
  import Pagination from '../components/Pagination.svelte';
  import { metatags } from '@roxi/routify';
  import { backend, safeFileName, user } from '../stores.js';

  let tags = '';
  let showNsfw = false;

  $: tags = safeFileName(tags);

  let lastSearch = '';
  let gifImages = [];
  let result = {};

  //reduce spam of API requests
  let canSearch = true;
  $: canSearch = lastSearch != tags;

  metatags.title = 'Find';
  metatags.description = '';
  const getData = async () => {
    if (!canSearch) return;

    lastSearch = `${tags}`;
    const res = await fetch(
      backend + '/api/find/' + tags + `${showNsfw ? '?nsfw=true' : ''}`,
      {
        credentials: 'include',
      }
    );
    const json = await res.json();
    let gifs = json.gifs.map((a) => {
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

    gifImages = gifs.map((gif) => {
      return { name: gif.name, alt: gif.originalname, src: gif.url };
    });
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

{#if gifImages.length > 0}
  <Pagination items={gifImages} maxItems={10}>
    <Card slot="body" let:prop={gif} alt={gif.name} src={gif.src}>
      <div slot="header">
        {gif.name}
      </div>
    </Card>
  </Pagination>
  <br />
  <h3>Raw:</h3>
  <div id="code"><pre>{result}</pre></div>
{:else if lastSearch != ''}
  <h6><i>Nothing found...</i></h6>
{/if}

<style>
  pre {
    overflow: scroll;
    height: 500px;
  }
</style>
