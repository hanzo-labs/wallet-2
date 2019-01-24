export let getLanguage = () => {
  if (typeof window != 'undefined') {
    return window.navigator.userLanguage || window.navigator.languages[0] || window.navigator.language
  }
}
