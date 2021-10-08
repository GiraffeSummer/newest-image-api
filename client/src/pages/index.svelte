<script>
  import { metatags } from '@roxi/routify';
  import {backend} from '../stores.js'
  import Navbar from '../components/navbar.svelte';

  metatags.title = 'Gif Monkey';
  metatags.description = 'Api for (reaction) gifs';
</script>

<Navbar />
<h1>Gif Monkey</h1>
<p>
  Hello this is work in progress, but please try to log in upload something,
  then see if you can find it on the /find page
</p>
