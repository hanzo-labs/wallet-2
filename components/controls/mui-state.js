import React from 'react'

import control from './control'
import { BaseMUIText } from './mui-text'
import { getLibrary } from '../../src/library'

let stateOpts

@control
export default class MUIState extends BaseMUIText{
  static defaultProps = {
    type: 'text',
    autoComplete: 'new-password',
    autoFocus: undefined,
    disabled: undefined,
    maxLength: undefined,
    readOnly: undefined,
    placeholder: '',
    label: '',
    instructions: '',
    wrap: '',
    spellCheck: '',
    rows: undefined,
    cols: undefined,
    showErrors: true,
    options: undefined,
    select: true,
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.country != nextProps.country) {
      this.options = stateOpts[nextProps.country] || {}

      if (!this.options) {
        this.disabled = true
      } else if(!this.options[this.props.value]) {
        this.props.onChange(Object.keys(this.options)[0])
      }
    }
    return true
  }

  constructor(props) {
    super(props)

    let { countries } = getLibrary()

    if (stateOpts) {
      return
    }

    stateOpts = {}

    for (let k in countries) {
      let country = countries[k]
      let cCode = country.code.toUpperCase()

      let c = stateOpts[cCode]
      if (!c) {
        c = stateOpts[cCode] = {}
      }

      let subdivisions = country.subdivisions.sort((a, b) => {
        if (a.name < b.name) { return -1 }
        if (a.name > b.name) { return 1 }
        return 0
      })

      for (let k2 in subdivisions) {
        let subdivision = country.subdivisions[k2]

        c[subdivision.code.toUpperCase()] = subdivision.name
      }
    }
  }
}

