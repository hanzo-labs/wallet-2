let isRequired = (name, value) => {
  if (value && value != '') {
    return value
  }

  throw new Error('Required')
}

export default isRequired
