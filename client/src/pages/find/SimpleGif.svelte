<script>
  //simple template for get gifs
  import Card from '../../components/Card.svelte';
  export let gif;
</script>

<Card {...gif}>
  <div slot="header">
    {gif.name}
  </div>
</Card>
