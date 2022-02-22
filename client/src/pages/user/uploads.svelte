<script>
  import Pagination from '../../components/Pagination.svelte';
  import { metatags } from '@roxi/routify';
  import { backend, user, addListener } from '../../stores.js';
  import Upload from '../../components/UserUpload.svelte';
  import { onMount } from 'svelte';

  let users = [];

  let selected;
  let showNsfw = false;

  let userData = {};

  export let canDelete = false;

  metatags.title = 'Uploads';
  metatags.description = 'User uploads';

  onMount(async () => {
    //no not need to get user uploads anymore
    const res = await fetch(
      backend + '/user/file-uploads' + `${showNsfw ? '?nsfw=true' : ''}`,
      {
        credentials: 'include',
      }
    );
    let data = await res.json();
    userData = data;
    selected = userData.user._id;

    getNew();

    const getUsers = await fetch(backend + '/user/all/list', {
      credentials: 'include',
    });
    users = await getUsers.json();
    users = users.users;
  });

  let request = undefined;
  //+ `${(showNsfw) ? '?nsfw=true' : ''}`
  const GetUserUploads = async () => {
    const res = await fetch(
      backend +
        '/user/get-uploads/' +
        selected +
        `${showNsfw ? '?nsfw=true' : ''}`,
      {
        credentials: 'include',
      }
    );
    const data = await res.json();
    canDelete =
      userData.user._id == selected
        ? true
        : userData.user.permissions.includes('delete_content');
    console.log('candelete ' + canDelete ? '✅' : '❌');
    return data;
  };

  const deleteGif = (evt) => {
    const filter = (g) => {
      return g._id != evt.detail.gif._id;
    };
    if (userData.user._id == selected) {
      userData.uploads = userData.uploads.filter(filter);
    } else {
      userUploads.uploads = userUploads.uploads.filter(filter);
    }
  };

  addListener('deletegif', (gif) => {
    const filter = (g) => {
      return g._id != gif._id;
    };
    if (userData.user._id == selected) {
      userData.uploads = userData.uploads.filter(filter);
    } else {
      userUploads.uploads = userUploads.uploads.filter(filter);
    }
  });

  const getNew = () => {
    request = GetUserUploads();
  };
</script>

{#if userData != {} && Array.isArray(userData?.uploads) && users.length >= 0}
  {#if userData.user.permissions.includes('manage_user')}
    <select bind:value={selected} on:change={getNew}>
      {#each users as user}
        <option value={user._id}>
          {user.username}
        </option>
      {/each}
    </select>'s uploads
  {:else}
    <h3>{userData.user.username}'s uploads</h3>
  {/if}
  <label for="showNsfw">
    <input
      id="showNsfw"
      type="checkbox"
      bind:checked={showNsfw}
      on:change={getNew}
    />
    Show Nsfw?
  </label>

  {#await request then userUploads}
    {#if userUploads.uploads.length > 0}
      <Pagination items={userUploads.uploads} maxItems={6} key={'_id'}>
        <Upload {canDelete} slot="body" let:prop={gif} {gif} />
      </Pagination>
    {:else}
      <br />
      <b>
        {userUploads.uploader.username} has no uploads {userUploads.nsfwResults
          ? `${userUploads.nsfwResults} Nsfw uploads`
          : ''}
      </b>
    {/if}
    {#if userUploads.nsfwResults != undefined && !showNsfw && userUploads.uploads.length >= 1}
      {userUploads.nsfwResults} more Nsfw uploads
    {/if}
  {/await}
{/if}
