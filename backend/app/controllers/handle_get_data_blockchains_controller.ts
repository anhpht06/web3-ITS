import type { HttpContext } from '@adonisjs/core/http'
import { ethers } from 'ethers'

export default class HandleGetDataBlockchainsController {
  public async fetchData({}: HttpContext) {
    const provider = new ethers.providers.JsonRpcProvider('https://your_rpc_provider')
    const contractAddress = 'your_contract_address'
    const abi = [
      /* your contract ABI */
    ]
    const contract = new ethers.Contract(contractAddress, abi, provider)
  }
}
