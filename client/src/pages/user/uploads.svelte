<script>
  import { metatags } from '@roxi/routify';
  import { backend, user } from '../../stores.js';
  import Upload from '../../components/UserUpload.svelte';
  import { onMount } from 'svelte';

  let users = [];

  let selected;

  let userData = {};

  metatags.title = 'Uploads';
  metatags.description = 'User uploads';

  onMount(async () => {
    const res = await fetch(backend + '/user/file-uploads', {
      credentials: 'include',
    });
    let data = await res.json();
    userData = data;
    selected = data.user._id;

    const getUsers = await fetch(backend + '/user/all/content', {
      credentials: 'include',
    });
    users = await getUsers.json();
    users = users.users;
  });

  let request = undefined;
  const GetUserUploads = async () => {
    const res = await fetch(backend + '/user/uploads/' + selected, {
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  };
</script>

{#if userData != {} && Array.isArray(userData?.uploads) && users.length >= 0}
  {#if userData.user.permissions.includes('manage_user')}
    <select
      bind:value={selected}
      on:change={() => {
        console.log(selected);
        if (userData.user._id != selected) request = GetUserUploads();
      }}
    >
      {#each users as user}
        <option value={user._id}>
          {user.username}
        </option>
      {/each}
    </select>'s uploads
  {:else}
    <h3>{userData.user.username}'s uploads</h3>
  {/if}

  {#if userData.user._id == selected}
    {#each userData.uploads as gif}
      <Upload {gif} />
    {/each}
  {:else}
    {#await request then userUploads}
      {#each userUploads.uploads as gif}
        <Upload {gif} />
      {:else}
        <br />
        <b>{userUploads.uploader.username} has no uploads</b>
      {/each}
    {/await}
  {/if}
{/if}
