const isGlobalScopeWindow = new Function('try { return this === window } catch(e) { return false }')()

export const print: (txt: string) => void = isGlobalScopeWindow
  ? (txt: string) => document.writeln(`<pre style="margin: 0">${txt.split('\n').join('</br>')}</pre>`)
  : console.log
