import React from 'react'
import EosApi from './eos/api'
import EthApi from './eth/api'
import BigNumber from 'bignumber.js'
import { getIdentity } from './wallet'
import {
  generateNthEthereumKeys,
  generateNthEOSKeys,
} from './wallet'
import {
  EOS_TOKEN_ACCOUNT,
  EOS_TEST_ACCOUNT,
  ETH_TOKEN_ADDRESS,
  ETH_REGISTRY_ADDRESS,
} from './settings'

export let BalanceContext = React.createContext({
  ethKey: '',
  ethBalance: '0.0000',
  eosKey: '',
  eosBalance: '0.0000',
  totalBalance: '0.0000',
})

const ETH_CONVERSION = new BigNumber(10e17)

export default class BalanceProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ethKey: '',
      ethBalance: '0.0000',
      eosKey: '',
      eosBalance: '0.0000',
      totalBalance: '0.0000',
    }
  }

  componentDidMount() {
    this.fn = () => {
      try {
        let identity = getIdentity()

        if (!identity) {
          setTimeout(this.fn, 5000)
          return
        }

        let ethKey = this.state.ethKey || generateNthEthereumKeys(1)[0]
        let eosKey = this.state.eosKey || generateNthEOSKeys(1)[0]

        this.setState({
          ethKey: ethKey,
          eosKey: eosKey,
        })

        // Load EOS Balance
        let eosApi = new EosApi(EOS_TOKEN_ACCOUNT, eosKey.privateKey, EOS_TEST_ACCOUNT)

        let eosP = eosApi.balanceOf()
          .then(([res]) => {
            let amount = new BigNumber(res.split(' ')[0])
            this.setState({
              eosBalance:   amount.toFormat(4),
              totalBalance: new BigNumber(this.state.ethBalance).plus(amount).toFormat(4),
            })
            console.log(res)

            return amount
          }).catch((err) => {
            console.log('Error on balanceOf', err)
          })

        // Load ETH Balance
        let ethApi = new EthApi(ETH_TOKEN_ADDRESS, ETH_REGISTRY_ADDRESS, ethKey.privateKey, ethKey.address)

        let ethP = ethApi.balanceOf()
          .then((res) => {
            console.log('eth res', res)
            let amount = new BigNumber(res).dividedBy(ETH_CONVERSION)
            this.setState({
              ethBalance: amount.toFormat(4),
              totalBalance: amount.plus(new BigNumber(this.state.eosBalance)).toString(),
            })
            return res
          }).catch((err) => {
            console.log('Error on balanceOf', err)
          })
      } catch (err) {
        console.log('Error on getCurrencyBalance', err)
      }

      setTimeout(this.fn, 10000)
    }

    console.log('Balance Provider Mounted')
    this.setState({ appIsMounted: true });

    this.fn()
  }

  render() {
    return <BalanceContext.Provider value={ this.state }>
        { this.state.appIsMounted ? (
            this.props.children
          ) : (
            <div />
          )
        }
      </BalanceContext.Provider>
  }
}

export let withBalance = (WrappedComponent) => {
  return class WatchedComponent extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return <BalanceContext.Consumer>
          { (values) => {
            let props = Object.assign({}, this.props, values)
            return <WrappedComponent {...props} />
          }}
        </BalanceContext.Consumer>
    }
  }
}
