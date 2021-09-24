<script>
</script>

<form class="form" method="POST" action="/upload" enctype="multipart/form-data">
  <label for="name">Name: </label><br />
  <input class="input" type="text" name="name" placeholder="enter a name" /><br
  />
  <label for="gif">Gif:</label><br />
  <input type="file" class="input form-control-file" name="gif" /><br /><br />
  <label for="nsfw">is NSFW</label>
  <input class="input" type="checkbox" name="nsfw" /><br />
  <label for="tags">tags: (split with ,)</label><br />
  <input type="text" id="tags" name="tags" />
  <button type="submit" tabindex="-1" class="create">Upload</button>
</form>
