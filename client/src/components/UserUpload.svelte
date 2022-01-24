<script>
  const allowedFields = ['nsfw', 'tags', 'name', '_id'];
  import {
    backend,
    user,
    minTags,
    safeFileName,
    objectMap,
    maxTags,
  } from '../stores.js';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let gif;

  export let canDelete = false;

  const updateGif = async () => {
    const _nsfw = gif.nsfw != isnsfw;
    const _name = gif.name != filename;
    const _tags =
      JSON.stringify(gif.tags) !=
      JSON.stringify(tags.split(',').map((a) => a.trim()));

    let newGif = {
      changes: { nsfw: _nsfw, tags: _tags, name: _name },
      new: objectMap({ nsfw: isnsfw, tags, name: filename }, allowedFields),
    };

    if ([_name, _tags, _nsfw].every((x) => x == false)) {
      createMessage('Nothing changed');
      return;
    }

    const res = await PostUpdate(newGif);
    if (res.status == 'ok') createMessage(`Gif was updated`);
  };

  let { tags, name: filename, nsfw: isnsfw } = gif;

  tags = tags.join(', ');

  $: tagAmount = tags.length > 1 ? tags.split(',').length : 0;
  $: tags = safeFileName(tags);
  $: filename = safeFileName(filename);

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
  const PostUpdate = async (newGif) => {
    const response = await fetch(backend + '/update-upload/' + gif._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGif),
      credentials: 'include',
    });
    const res = await response.json();
    return res;
  };

  const deleteUpload = async () => {
    if (!canDelete) return;
    const c = confirm(`Are you sure you want to delete '${gif.name}'?`);

    if (c) {
      const response = await fetch(backend + '/update-upload/' + gif._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm: c }),
        credentials: 'include',
      });
      const res = await response.json();
      if (res.status == 'ok') {
        dispatch('deletegif', {
          gif,
        });
        createMessage('successfully deleted');
      }
    }
  };

  const validUpdate = () => {
    return filename.length >= 3 && tagAmount >= minTags;
  };
  let message,
    messageActive = false;
</script>

{#if messageActive}
  <div class="message toast top" class:active={messageActive}>{message}</div>
{/if}

<div class="card large col-lg">
  <form class="input-group" on:submit|preventDefault={updateGif}>
    <label for="name">Name: </label>
    <input
      class="input"
      type="text"
      name="name"
      placeholder="enter a name"
      bind:value={filename}
    />
    <img src={backend + gif.path} alt={gif.name} />
    <label for="nsfw">is NSFW</label>
    <input class="input" type="checkbox" name="nsfw" bind:checked={isnsfw} />
    <br />
    <label for="tags">tags: (split with ,) (min {minTags} max {maxTags})</label>
    <input type="text" id="tags" name="tags" bind:value={tags} />
    <br />
    <button class="tertiary" type="submit" tabindex="-1" enabled={validUpdate}
      >Update</button
    >
    {#if canDelete}
      <button
        type="button"
        tabindex="-1"
        class="secondary"
        on:click={deleteUpload}>Delete</button
      >
    {/if}
  </form>
</div>

<style>
  .card {
    padding: 0;
    margin: 0;
    border: none;
    max-width: 400px;
    min-width: 30%;
  }

  .input-group {
    border-radius: 5px;
    padding: 10px 15px;
  }
  input[type='text'] {
    width: 100%;
  }

  img {
    /*
    width: 250px;max-width: 500px;*/
    object-fit: contain;
  }
</style>
