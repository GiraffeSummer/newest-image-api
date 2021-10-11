<script>
  import { user, backend, SetPermKeys } from '../../stores.js';
  import UserCard from '../../components/UserCard.svelte';
  import { onMount } from 'svelte';
  let users = [];
  let permissions;

  onMount(async () => {
    const res = await fetch(backend + '/user/all', {
      credentials: 'include',
    });
    let data = await res.json();
    users = data.users;
    permissions = data.permissions;
    
    SetPermKeys(data.PermissionKeys);
  });
</script>

{#if users.length > 0}
  {#each users as user}
    <UserCard {user} {permissions} />{/each}
{/if}
