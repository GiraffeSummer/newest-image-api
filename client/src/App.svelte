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


    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function () {
      let u = "//matomo.cripplerick.com/";
      _paq.push(['setTrackerUrl', u + 'matomo.php']);
      _paq.push(['setSiteId', '2']);
      let d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
    })();
</script>

<Router {routes} />
