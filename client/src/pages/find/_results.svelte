<script>
  import Pager from '../../components/Pager.svelte';
  import { gifImages, lastSearch, result } from './find.js';
  import SimpleGif from './SimpleGif.svelte';
</script>

{#if $gifImages.length > 0}
  <Pager list={$gifImages} component={SimpleGif} prop="gif" />
  <br />
  <h3>Raw:</h3>
  <div id="code"><pre>{$result}</pre></div>
{:else if $lastSearch != ''}
  <h6><i>Nothing found...</i></h6>
{/if}

<style>
  pre {
    overflow: scroll;
    height: 500px;
  }
</style>
