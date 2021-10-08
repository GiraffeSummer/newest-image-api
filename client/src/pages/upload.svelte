<script>
  import { metatags } from "@roxi/routify";
  import Navbar from "../components/navbar.svelte";  
  import UploadForm from "../components/gifuploadform.svelte";

  metatags.title = "Upload";
</script>

<Navbar />

<UploadForm />
