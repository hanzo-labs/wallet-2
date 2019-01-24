let isPhone = (v) => {
  let num = parseInt(v, 10)
  if (!isNaN(v) && ('' + num === v) && v.length == 10) {
    return true
  }

  throw Error('Invalid phone number.')
}

export default isPhone
