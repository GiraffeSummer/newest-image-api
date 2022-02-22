<script>
  import { user, backend, SetPermKeys, objectMap } from '../../stores.js';
  import UserCard from '../../components/UserCard.svelte';
  import Pagination from '../../components/Pagination.svelte';
  import { onMount } from 'svelte';
  let users = [];
  let permissions;

  onMount(async () => {
    const res = await fetch(backend + '/user/all', {
      credentials: 'include',
    });
    let data = await res.json();
    users = data.users;
    permissions = objectMap(data.permissions, $user.permissions);
    SetPermKeys(data.PermissionKeys);
  });
</script>

{#if users.length > 0}
  <Pagination items={users} maxItems={6}>
    <div slot="body" let:prop={user}>
      <UserCard {permissions} {user} />
    </div>
  </Pagination>
{/if}
