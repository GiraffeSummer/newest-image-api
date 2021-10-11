<script>
  import { metatags } from '@roxi/routify';
  import { backend, user } from '../../stores.js';
  import Upload from '../../components/UserUpload.svelte';
  import { onMount } from 'svelte';

  let userData = {};

  metatags.title = 'Uploads';
  metatags.description = 'User uploads';

  onMount(async () => {
    const res = await fetch(backend + '/user/uploads', {
      credentials: 'include',
    });
    let data = await res.json();
    userData = data;
  });
</script>

{#if userData != {} && Array.isArray(userData?.uploads)}
  <h3>{userData.user.username.split('#')[0]}'s uploads</h3>
  {#each userData.uploads as gif}
    <Upload {gif} />
  {/each}
{/if}
