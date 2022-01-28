<script>
  import { metatags, goto } from '@roxi/routify';
  import { backend, safeFileName, user } from '../../stores.js';
  import { gifImages, lastSearch, result } from './find.js';
  let tags = '';
  let showNsfw = false;

  $: tags = safeFileName(tags);

  //reduce spam of API requests
  let canSearch = true;
  $: canSearch = $lastSearch != tags;

  metatags.title = 'Find';
  metatags.description = '';
  const getData = async () => {
    if (!canSearch) return;

    $lastSearch = `${tags}`;
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

    $gifImages = gifs.map((gif) => {
      return { name: gif.name, alt: gif.originalname, src: gif.url };
    });
    $result = JSON.stringify(gifs, null, 2);

    $goto('./1');
  };

  $: tags, getData();

  const checkEnter = (e, cb) => {
    if (e.key === 'Enter') cb(e);
  };
</script>

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
    on:change={() => (canSearch = true)}
  />
  Show Nsfw?
</label>
<button on:click={getData} id="searchBtn">Search</button>
<br /><br />
<slot />
