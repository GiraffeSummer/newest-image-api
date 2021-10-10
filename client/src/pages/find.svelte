<script>
  import { metatags } from '@roxi/routify';
  import { backend, safeFileName, user } from '../stores';
  import Navbar from '../components/navbar.svelte';
  import Card from '../components/Card.svelte';

  let tags = '';
  let result = '';

  $: tags = safeFileName(tags);

  let gifImages = [];

  //reduce spam of API requests
  let lastSearch = '';
  let canSearch = true;
  $: canSearch = lastSearch != tags;

  metatags.title = 'Find';
  metatags.description = '';
  const getData = async () => {
    if (!canSearch) return;

    lastSearch = `${tags}`;
    const res = await fetch(backend + '/find/' + tags, {
      credentials: 'include',
    });
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

  const checkEnter = (e, cb) => {
    if (e.key === 'Enter') cb(e);
  };
</script>

<Navbar />

<input
  type="text"
  id="search"
  placeholder="Search..."
  bind:value={tags}
  on:keydown={(e) => {
    checkEnter(e, getData);
  }}
/>
<button on:click={getData} id="searchBtn">Search</button>
<br /><br />
{#if gifImages.length > 0}
  {#each gifImages as gif}
    <Card src={gif.src} alt={gif.alt}>
      <div slot="header">
        {gif.name}
      </div>
    </Card>
  {/each}
  <br />
  <h3>Raw:</h3>
  <div id="code"><pre>{result}</pre></div>
{:else if lastSearch != ''}
  <h6><i>Nothing found...</i></h6>
{/if}

<style>
  pre {
    color: var(--ui-color);
    font-weight: 500;
  }
</style>
