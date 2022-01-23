<script>
  import { isActive, url } from '@roxi/routify';
  import { user, backend } from '../stores.js';

  const HasPermissions = (perm) => $user?.permissions?.includes(perm) == true;
  const isLoggedIn = () => !($user == undefined || $user == null);

  const navitems = [
    { label: 'Home', href: '/' },
    { label: 'Find', href: '/find' },
    {
      label: 'Upload',
      href: '/upload',
      enabled: HasPermissions('upload'),
    },
    {
      label: 'My uploads',
      href: '/user/uploads',
      enabled: HasPermissions('upload'),
    },
    {
      label: 'Admin',
      href: '/user/admin',
      enabled: HasPermissions('manage_user'),
    },
    {
      label: 'Me',
      href: '/user/me',
      enabled: isLoggedIn(),
    },
    {
      label: 'Login',
      href: backend + '/auth/discord',
      enabled: !isLoggedIn(),
    },
    {
      label: 'Logout',
      href: backend + '/auth/logout',
      enabled: isLoggedIn(),
    },
  ];
</script>

<ul id="navbar">
  <li><img src={'/favicon.png'} alt="" /></li>
  {#each navitems as nav}
    {#if nav.enabled == undefined || nav.enabled == true}
      <li>
        <a href={nav.href}>{nav.label}</a>
      </li>
    {/if}
  {/each}
</ul>

<style>
  a {
    color: var(--white);
  }
</style>
