<script>
  import { backend, user } from '../../stores.js';
  import ClipboardCopy from '../../components/ClipboardCopy.svelte';

  import ChipManager from '../../../WIP/chipManager.svelte';
  let show = false;

  const GetApiKey = async () => {
    const res = await fetch(backend + '/api/key', {
      credentials: 'include',
    });

    return res.json();
  };

  const copy = (name) => {
    console.log(name);
    const app = new ClipboardCopy({
      target: document.querySelector('.row'),
      props: { name },
    });
    app.$destroy();
  };
</script>

<div class="card">
  <h3>{$user.username}</h3>
  <img src={$user.avatar} alt={$user.username} />
  <h5><b>Permissions:</b></h5>
  <ul>
    {#each $user.permissions as perm}
      <li>{perm}</li>
      <br />
    {/each}
  </ul>
  {#if $user.permissions.includes('api_access')}
    <h5 class="api">API:</h5>
    <button on:click={() => (show = !show)}>{show ? 'hide' : 'show'}</button>
    {#if show}
      {#await GetApiKey() then apikey}
        <div class="row">
          <div style="flex: 50%;">Uses:</div>
          <div style="flex: 50%;">
            <samp>{apikey.uses}</samp>
          </div>
        </div>
        <div class="row">
          <div style="flex: 80%;">
            <ul class="api"><samp>{apikey.key}</samp></ul>
          </div>
          <div style="flex: 10%;height: 100%">
            <button on:click={() => copy(apikey.key)}>copy</button>
          </div>
        </div>
      {/await}
    {/if}
  {/if}
</div>

<style>
  .card {
    border-radius: 10px;
    padding: 15px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
  }
  h5 {
    margin: 0;
    padding: 0;
  }

  img {
    width: 128px;
    object-fit: contain;
    border-radius: 15px;
  }

  .api {
    text-align: center;
  }
</style>
