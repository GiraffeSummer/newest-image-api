<script>
  import { Router ,metatags} from '@roxi/routify';
  import { routes } from '../.routify/routes';
  import { user, backend } from './stores.js';
  import { onMount } from 'svelte';

  onMount(async () => {
    const res = await fetch(backend + '/data/user', {
      credentials: 'include',
    });
    const usr = await res.json();

    $user = usr.user != undefined ? usr.user : undefined;
  });

  metatags.description = "gifmonkey gif monkey - (anime) reaction gif API and platform";
  metatags.robots = "index, follow";
</script>

<Router {routes} />
