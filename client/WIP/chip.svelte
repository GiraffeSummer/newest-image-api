<script>
    import './chip.css'
  export let src;
  export let alt;
</script>

<div class="chip">
  {#if src != undefined}
    <img {src} {alt} width="96" height="96" />
  {/if}
  <slot />
  <span class="closebtn" onclick="this.parentElement.style.display='none'"
    >&times;</span
  >
</div>
