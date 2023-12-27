<script>
  import Head from '$components/head.svelte'
  import Tabs from '$components/tabs.svelte'

  export let data

  $: title = data.active_chapter
    ? `Browse expressions starting with &quot;${data.active_chapter.label}&quot;`
    : 'Browse English meanings alphabetically'
</script>

<Head
  {title}
  description="Phrases starting with &quot;{'asd'}&quot;"
/>

<Tabs
  tabs={data.chapters}
  active_tab={data.active_chapter}
>
  {JSON.stringify(data.phrases)}
</Tabs>
