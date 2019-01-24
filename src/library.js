import akasha from './mjs-fix/akasha'
import { renderDate, rfc3339 } from './util/date'

let lastChecked, countries, taxRates, shippingRates, currency

export let loadLibrary = (client) => {
  // fetch library data
  lastChecked   = akasha.get('library.lastChecked')
  countries     = akasha.get('library.countries') || []
  taxRates      = akasha.get('library.taxRates')
  shippingRates = akasha.get('library.shippingRates')
  currency      = akasha.get('library.currency')

  lastChecked = renderDate(new Date(), rfc3339)

  return client.library.shopjs({
    hasCountries:       !!countries && countries.length != 0,
    hasTaxRates:        !!taxRates,
    hasShippingRates:   !!shippingRates,
    lastChecked:        renderDate(lastChecked || '2000-01-01', rfc3339),
  }).then((res) => {
    countries = res.countries || countries
    taxRates = res.taxRates || taxRates
    shippingRates = res.shippingRates || shippingRates
    currency = res.currency || currency

    akasha.set('library.lastChecked', lastChecked)
    akasha.set('library.countries', countries)
    akasha.set('library.taxRates', taxRates)
    akasha.set('library.shippingRates', shippingRates)
    akasha.set('library.currency', currency)
  })
}

export let getLibrary = () => {
  return {
    lastChecked,
    countries,
    taxRates,
    shippingRates,
    currency,
  }
}
