<script>
  import Results from './_results.svelte';
  export let page;
  import { params } from '@roxi/routify';
  $: page = $params.page;
</script>

<Results {page} />
