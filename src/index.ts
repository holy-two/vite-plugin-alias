import { Plugin } from 'vite'

export default function vitePluginTemplate(): Plugin {
  return {
    name: 'vite-plugin-template',
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        '<title>vite-plugin-alias</title>'
      )
    }
  }
}