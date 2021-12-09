<script>
  import { metatags } from '@roxi/routify';
  import { backend, user } from '../../stores.js';
  import Upload from '../../components/UserUpload.svelte';
  import { onMount } from 'svelte';

  let users = [];

  let selected;
  let showNsfw = false;

  let userData = {};

  
  let canDelete = (user._id == selected) ? true : user.permissions.includes('delete_content');

  metatags.title = 'Uploads';
  metatags.description = 'User uploads';

  onMount(async () => {
    //no not need to get user uploads anymore
    const res = await fetch(backend + '/user/file-uploads' + `${(showNsfw) ? '?nsfw=true' : ''}` , {
      credentials: 'include',
    });
    let data = await res.json();
    userData = data;
    selected = userData.user._id;

    request = GetUserUploads();

    const getUsers = await fetch(backend + '/user/all/content', {
      credentials: 'include',
    });
    users = await getUsers.json();
    users = users.users;
  });

  let request = undefined;
  //+ `${(showNsfw) ? '?nsfw=true' : ''}`
  const GetUserUploads = async () => {
    const res = await fetch(backend + '/user/uploads/' + selected + `${(showNsfw) ? '?nsfw=true' : ''}`, {
      credentials: 'include',
    });
    const data = await res.json();
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
</script>
candelete
<input type=checkbox bind:checked={canDelete} on:click={()=>{return false}} />
{#if userData != {} && Array.isArray(userData?.uploads) && users.length >= 0}
  {#if userData.user.permissions.includes('manage_user')}
    <select
      bind:value={selected}
      on:change={() => request = GetUserUploads()} >
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
    <input id="showNsfw" type=checkbox bind:checked={showNsfw} on:change={() => request = GetUserUploads() } />
    Show Nsfw?      
  </label >
  

{#await request then userUploads}
  {#each userUploads.uploads as gif}
    <Upload {gif} on:deletegif={deleteGif} {canDelete} />
    
  {:else}
    <br />
    <b>{userUploads.uploader.username} has no uploads {(userUploads.nsfwResults) ? `${userUploads.nsfwResults} Nsfw uploads` : '' }</b>
  {/each}
  {#if userUploads.nsfwResults != undefined && !showNsfw && userUploads.uploads.length >= 1 }
    {userUploads.nsfwResults} more Nsfw uploads
      {/if}
{/await}
  {/if}