<script>
  import Card from '../../../components/Card.svelte';
  import { backend, safeFileName, debounce, user } from '../../../stores.js';
  export let image;

  let gifPromise = null;

  import { onMount } from 'svelte';
  onMount(async () => {
    gifPromise = (
      await fetch(backend + `/api/image/${image}`, {
        credentials: 'include',
      })
    ).json();
  });
</script>

{#await gifPromise}
  <p>...waiting</p>
{:then gif}
  <Card src={gif?.url} alt={gif?.name}>
    <span slot="header">{gif?.name}</span>
    <span slot="footer">{gif?.tags}</span>
  </Card>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
