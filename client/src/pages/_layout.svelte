<script>
  import '../../node_modules/mini.css/dist/mini-dark.min.css';
  import Analytics from '../../../components/Analytics.svelte';
  import Navbar from '../components/navbar.svelte';
</script>

<svelte:head>
  <Analytics />
</svelte:head>
<Navbar />
<slot />
