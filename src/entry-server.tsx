import { renderToString } from 'react-dom/server'
import { StartServer } from '@tanstack/start/server'
import { createRouter } from './router'

export async function render(url: string) {
  const router = createRouter()

  await router.load(url)

  const html = renderToString(<StartServer router={router} />)

  return { html }
}
