<script>
  export let src = '';
  export let alt = '';
</script>

<div class="card">
  <h2>
    <slot name="header">Unknown header</slot>
  </h2>
  <div><img {alt} {src} /></div>
  <div class="footer">
    <slot name="footer" />
  </div>
</div>

<style>
  .card {
    /*width: 300px;
    padding: 1em;
    margin: 0 0 1em 0;*/
    border: 1px solid #aaa;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
    
  }

  img {
    width: 250px;
    object-fit: contain;
  }
</style>
