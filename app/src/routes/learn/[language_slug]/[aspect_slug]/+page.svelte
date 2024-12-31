<script lang="ts">
  import Rich_Text from '$components/rich_text.svelte'

  export let data

  let rich_text = data.content
</script>

<h1 class="@heading +1 @content +text @spaced">{data.title}</h1>

<Rich_Text content={rich_text} />
