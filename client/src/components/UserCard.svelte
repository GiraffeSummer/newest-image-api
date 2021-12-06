<script>
  import { backend, user as _user, HighestPermission } from '../stores.js';

  export let user;
  export let permissions;

  let message,
    messageActive = false;
  const updateUser = async () => {
    const response = await fetch(backend + '/user/' + user._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions: perms }),
      credentials: 'include',
    });
    const res = await response.json();

    if(res?.success == true){
      createMessage(`Success`)
    } else createMessage(`Failed`);
  };
  const createMessage = (content = 'message', delay = 3) => {
    message = content;
    messageActive = true;
    setTimeout(() => {
      messageActive = false;
    }, delay * 1000);
  };

  let perms = {};
  for (const key in permissions) {
    perms[key] = user.permissions.includes(key);
  }
  const higherPerms =
    HighestPermission($_user).index > HighestPermission(user).index;
</script>

{#if messageActive}
  <div class="message toast top">{message}</div>
{/if}

<div class="card">
  <h3>{user.username}</h3>
  <form class="form" on:submit|preventDefault={updateUser}>
    <img src={user.avatar} alt={user.username} />
    <h5><b>Permissions:</b></h5>
    <ul>
      {#each Object.entries(permissions) as [perm, desc]}
        {#if higherPerms}
          <input
            class="input"
            type="checkbox"
            name={perm}
            bind:checked={perms[perm]}
          />
        {:else}
          {perms[perm] ? '✅' : '❌'}
        {/if}
        <b>{perm}</b> <br />
        <i>{desc}</i>
        <br />
      {/each}
    </ul>
    {#if higherPerms}
      <button type="submit" tabindex="-1" class="create">Update</button>
    {/if}
  </form>
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
  ul {
    background-color: var(--code-background);
  }

  img {
    width: 128px;
    object-fit: contain;
    border-radius: 15px;
  }
</style>
