import moment from 'moment-timezone'
import { getLanguage } from './language'

export let rfc3339  = 'YYYY-MM-DDTHH:mm:ssZ'
export let mmddyyyy = 'MM/DD/YYYY'
export let yyyymmdd = 'YYYY/MM/DD'
export let ddmmyyyy = 'DD/MM/YYYY'

export let defaultFormat = () => {
  if (getLanguage() == 'en-US') {
    return mmddyyyy
  } else {
    return ddmmyyyy
  }
}


export let renderDate = (date, format) => {
  if (!format) {
    format = defaultFormat()
  }

  return moment(date).format(format)
}

export let renderUIDate = (date) => {
  return renderDate(date)
}

export let renderJSONDate = (date)=> {
  return renderDate(date, rfc3339)
}
