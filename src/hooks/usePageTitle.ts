import { useEffect } from 'react'

const DEFAULT_TITLE = 'Fortunas — Next-Generation Technology & AI'

// Sets the document title for a page and puts the site default back on the way out,
// so a shared link (the App Store privacy URL, for one) names what it opens.
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title])
}

export default usePageTitle
