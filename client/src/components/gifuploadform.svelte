<script>
  import { user, backend, safeFileName, minTags, maxTags } from '../stores.js';

  let isnsfw, filename, tagAmount, fileUpload;

  let tags = '';
  $: tagAmount = tags.length > 1 ? tags.split(',').length : 0;
  $: tags = safeFileName(tags);
  $: filename = safeFileName(filename);

  //test, if tags contain nsfw it will check nsfw, if nsfw is checked it will not uncheck
  $: isnsfw = [isnsfw, ...tags.split(',')].some((x) => {
    if (typeof x == 'string') return x.toLowerCase() == 'nsfw';
    else return x;
  });

  const createMessage = (content = 'message', delay = 3) => {
    message = content;
    messageActive = true;
    setTimeout(() => {
      messageActive = false;
    }, delay * 1000);
  };

  const validUpload = () => {
    return files?.length > 0 && filename.length >= 3 && tagAmount >= minTags;
  };

  let files, message;
  let messageActive = false;
  const onSubmit = async (e) => {
    if (validUpload()) {
      const formData = new FormData(e.target);

      const reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onload = async (a) => {
        formData.append('gif', a.target.result);

        const response = await fetch(backend + '/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const res = await response.json();
        const success = res.status == 'ok' || res.success;
        createMessage(
          `your upload ${success ? 'was successful' : 'failed try again!'}`
        );
        if (success) {
          fileUpload.value = null;
          files = [];
          filename = '';
          isnsfw = false;
          tags = '';
        } else {
          //upload fails
        }
      };
    } else {
      createMessage(`Invalid upload, please fill in all the required fields!`);
    }
  };
</script>

{#if messageActive}
  <div class="message toast top" class:active="{messageActive}">{message}</div>
{/if}

<form class="form input-group " on:submit|preventDefault={onSubmit}>
  <label for="name">Name: </label>
  <input
    class="input"
    type="text"
    name="name"
    placeholder="enter a name"
    bind:value={filename}
  />
  <label for="gif">Gif:</label>
  <input
    type="file"
    accept=".gif"
    class="input form-control-file"
    name="gif"
    bind:files
    bind:this={fileUpload}
  />
  <label for="nsfw">is NSFW</label>
  <input class="input" type="checkbox" name="nsfw" bind:checked={isnsfw} /><br
  />
  <label for="tags">tags: (split with ,) (min {minTags} max {maxTags})</label>
  <input type="text" id="tags" name="tags" bind:value={tags} />
  {tagAmount}
  <br />
  <button type="submit" tabindex="-1" class="tertiary">Upload</button>
</form>