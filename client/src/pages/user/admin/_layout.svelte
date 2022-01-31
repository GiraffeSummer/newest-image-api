<script>
  import { user, backend, SetPermKeys, objectMap } from '../../../stores.js';
  import UserCard from '../../../components/UserCard.svelte';
  import Pager from '../../../components/Pager.svelte';
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
  <Pager
    prop="user"
    list={users}
    properties={{ permissions }}
    component={UserCard}
    maxItems={6}
  />
{/if}
