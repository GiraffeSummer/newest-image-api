<script>
  import { isActive, url } from "@roxi/routify";
  import { user, backend } from "../stores.js";

  const HasPermissions = (perm) => $user?.permissions?.includes(perm) == true;
  const isLoggedIn = () => !($user == undefined || $user == null);

  const navitems = [
    { label: "Home", href: "/" },
    { label: "Find", href: "/find" },
    {
      label: "Upload",
      href: "/upload",
      enabled: HasPermissions("upload"),
    },
    {
      label: "My uploads",
      href: "/user/uploads",
      enabled: HasPermissions("upload"),
    },
    {
      label: "Admin",
      href: "/user/admin",
      enabled: HasPermissions("manage_user"),
    },
    {
      label: "Me",
      href: "/user/me",
      enabled: isLoggedIn(),
    },
    /*  {
      label: 'Login',
      href: backend + '/auth/discord',
      enabled: !isLoggedIn(),
    },
    {
      label: 'Logout',
      href: backend + '/auth/logout',
      enabled: isLoggedIn(),
    },*/
  ];
</script>

<header>
  <div class="hidden-md hidden-lg ">
    <label for="drawer-control" class="drawer-toggle" />
    <input type="checkbox" id="drawer-control" class="drawer" />
    <div class="container">
      <label for="drawer-control" class="drawer-close" />

      {#each navitems as nav}
        {#if nav.enabled == undefined || nav.enabled == true}
          <a class="row" href={nav.href}>{nav.label}</a>
        {/if}
      {/each}
      {#if isLoggedIn()}
        <a class="row" target="_self" href={backend + "/auth/logout"}>Logout</a>
      {:else}
        <a class="row" target="_self" href={backend + "/auth/discord"}>Login</a>
      {/if}
    </div>
  </div>
  <div />

  <div class="visually-hidden-sm">
    <li>
      <img src={"/favicon.png"} alt="" />
    </li>
    {#each navitems as nav}
      {#if nav.enabled == undefined || nav.enabled == true}
        <li class:active={$isActive("." + nav.href)}>
          <a class="button" href={nav.href}>{nav.label}</a>
        </li>
      {/if}
    {/each}
    {#if isLoggedIn()}
      <li>
        <a target="_self" class="button" href={backend + "/auth/logout"}
          >Logout</a
        >
      </li>
    {:else}
      <li>
        <a target="_self" class="button" href={backend + "/auth/discord"}
          >Login</a
        >
      </li>
    {/if}
  </div>
</header>

<style>
  li {
    list-style: none;
  }
  img {
    margin: 0;
    width: 40px;
    padding-left: 5px;
  }
  a {
    color: var(--white);
  }

  .active {
    color: var(--main-color);
  }
</style>
