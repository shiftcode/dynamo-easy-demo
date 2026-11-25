const isGlobalScopeWindow = typeof window !== 'undefined' && globalThis === window

export const print: (txt: string) => void = isGlobalScopeWindow
  ? (txt: string) => {
      document.body.insertAdjacentHTML('beforeend', `<pre style="margin: 0">${txt.split('\n').join('</br>')}</pre>`)
    }
  : console.log
