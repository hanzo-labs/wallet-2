export default var isPromise = (maybePromise)=> {
  return maybePromise.then && maybePromise.catch
}
