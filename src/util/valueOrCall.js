export default var valueOrCall = (valueOrFunc) {
  if(typeof valueOrFunc == 'function') {
    return valueOrFunc()
  }

  return valueOrFunc
}

