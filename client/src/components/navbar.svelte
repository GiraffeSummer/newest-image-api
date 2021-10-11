<script>
  import { isActive, url } from '@roxi/routify';

  import { user, backend } from '../stores.js';
</script>

<ul id="navbar">
  <li><img src={'/favicon.png'} alt="" /></li>
  <li><a href="/">Home</a></li>
  <li><a href="/find">Find</a></li>
  {#if $user?.permissions?.includes('upload')}
    <li><a href="/upload">Upload</a></li>
    <li><a href="/user/uploads">My uploads</a></li>
  {/if}
  {#if $user?.permissions?.includes('manage_user')}
    <li><a href="/user/admin">Admin</a></li>
  {/if}
  {#if $user == undefined || $user == null}
    <li><a target="_self" href={backend + '/auth/discord'}>Login</a></li>
  {:else}
    <li><a href="/user/me">Me</a></li>
    <li><a target="_self" href={backend + '/auth/logout'}>Logout</a></li>
  {/if}
</ul>

<style>
  a {
    color: var(--white);
  }
</style>
