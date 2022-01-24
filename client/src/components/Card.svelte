<script>
  export let src = "";
  export let alt = "";
</script>

<div class="card small col-lg">
  <h2>
    <slot name="header">Unknown header</slot>
  </h2>
  <div><img {alt} {src} class="section media" /></div>
  <div class="footer">
    <slot name="footer" />
  </div>
</div>

<style>
  .card {
    border-radius: 10px;
    padding: 10px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);

    /*max-width: 350px;*/
    min-width: 20%;
  }

  h2 {
    margin: 0;
  }
  img {
    /*
    width: 250px;max-width: 500px;*/
    width: 100%;
    object-fit: contain;
    margin: 0;
  }
</style>
