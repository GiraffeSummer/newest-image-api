<script>
  import { user, backend } from '../stores.js';
</script>

<ul id="navbar">
  <li><img src={backend + '/logo.png'} alt="" /></li>
  <li><a href="/">Home</a></li>
  <li><a href="/find">Find</a></li>
  {#if $user?.permissions?.includes('upload')}
    <li><a href="/upload">Upload</a></li>
  {/if}
  {#if $user == undefined || $user == null}
    <li><a href={backend + '/auth/discord'}>Login</a></li>
  {:else}
    <li><a href={backend + '/auth/logout'}>Logout</a></li>
  {/if}
  <!--<li><a href="/account">Account</a></li>-->
</ul>

<style>
  a:visited {
    color: white;
  }
</style>
