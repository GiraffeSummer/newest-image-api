<script>
  import { user } from '../../stores.js';
</script>

<div class="card">
  <h3>{$user.username}</h3>
  <img src={$user.avatar} alt={$user.username} />
  <h5><b>Permissions:</b></h5>
  <ul>
    {#each $user.permissions as perm}
      <li>{perm}</li>
      <br />
    {/each}
  </ul>
</div>

<style>
  .card {
    border-radius: 10px;
    padding: 15px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
  }
  h5 {
    margin: 0;
    padding: 0;
  }
  ul {
    background-color: var(--code-background);
  }

  img {
    width: 128px;
    object-fit: contain;
    border-radius: 15px;
  }
</style>
