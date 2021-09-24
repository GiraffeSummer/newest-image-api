<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import { user } from "./stores.js";
  import { onMount } from "svelte";

  onMount(async () => {
    $user = await fetch("http://localhost:3000/data/user").then((a) => {
      return a.json();
    });
    console.log($user);
  });
</script>

<Router {routes} />
