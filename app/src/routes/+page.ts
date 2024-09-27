import { redirect } from '@sveltejs/kit'
const moved_permanently = 301

export const load = ({ url }) => {
  // the search is now permanently at /dictionary. we redirect all bookmarks, search engines, etc. there.
  if (url.searchParams.has('query')) {
    const redirect_url = new URL(url)
    redirect_url.pathname = '/dictionary'

    redirect(moved_permanently, redirect_url)
  }
}
