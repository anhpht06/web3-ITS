// import type { HttpContext } from '@adonisjs/core/http'
import { BigNumber, ethers } from 'ethers'
import {
  getDepositContractABI,
  getDepositContractAddress,
  getLatestBlock,
} from '../services/read_json_file_service.js'
import Transactions from '#models/transactions'
import LatestBlock from '#models/latest_block'
import env from '#start/env'

export default class HandleGetDataBlockchainsController {
  private provider: ethers.providers.JsonRpcProvider
  public eventNames = [
    'TokenADeposit',
    'WithdrawTokenA',
    'ClaimTokenA',
    'DepositNFTB',
    'WithdrawNFTB',
    'MintedNFTB',
  ]
  private fromBlock = Number(getLatestBlock())
  private stepBlock = 5000

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(env.get('CHAIN_TMX_TESTNET'))
  }

  public async getLatestBlock() {
    const latestBlock = await LatestBlock.query().orderBy('id', 'desc').first()
    return latestBlock?.latestBlock ?? this.fromBlock
  }

  public async updateLatestBlock(latestBlock: number) {
    let block = await LatestBlock.first()

    if (block) {
      block.latestBlock = latestBlock
      await block.save()
    } else {
      await LatestBlock.create({ latestBlock })
    }
  }

  public async fetchData() {
    console.log('getDepositContractAddress', getDepositContractAddress())
    console.log('getLatestBlock', getLatestBlock())

    const contract = new ethers.Contract(
      getDepositContractAddress(),
      getDepositContractABI(),
      this.provider
    )

    const newBlockInBlockchain = await this.provider.getBlockNumber()
    const startBlock = await this.getLatestBlock()
    if (newBlockInBlockchain < startBlock) {
      console.log('No new block in blockchain')
      return
    }
    const endBlock = startBlock + this.stepBlock

    const getTransactionData = async (eventNames: string[], fromBlock: number, toBlock: number) => {
      for (const eventName of eventNames) {
        const events = await contract.queryFilter(eventName, fromBlock, toBlock)

        for (const event of events) {
          const block = await this.provider.getBlock(event.blockNumber)
          const transaction = await this.provider.getTransaction(event.transactionHash)
          const gasPrice = transaction.gasPrice ?? ethers.BigNumber.from(0)
          const txnFee = gasPrice.mul(transaction.gasLimit ?? 0)

          const index = event.logIndex
          const transactionHash = event.transactionHash
          const method = eventName
          console.log('dataTest:::', method)

          const blockNumber = String(event.blockNumber)
          const timestamp = String(block.timestamp)
          const from = event.args?._from
          const to = event.args?._to
          const fee = ethers.utils.formatEther(txnFee)
          let amount = event.args?._amount

          const alreadySaved = await Transactions.query()
            .where('txHash', transactionHash)
            .andWhere('logIndex', index)
            .first()

          if (alreadySaved) {
            console.log('Transaction already saved, skipping...')
            continue
          }

          if (
            eventName === 'TokenADeposit' ||
            eventName === 'WithdrawTokenA' ||
            eventName === 'ClaimTokenA'
          ) {
            amount = ethers.utils.formatEther(amount)
          } else {
            amount = BigNumber.from(amount).toString()
          }

          await Transactions.create({
            logIndex: index,
            txHash: transactionHash,
            method: method,
            block: blockNumber,
            timestamp: timestamp,
            from: from,
            to: to,
            amount: amount,
            fee: fee,
          })
        }
      }
    }
    console.log('chain: ', env.get('CHAIN_TMX_TESTNET'))
    console.log('BlockNumber: ', { newBlockInBlockchain, startBlock, endBlock })
    await getTransactionData(this.eventNames, startBlock, endBlock)
    if (endBlock >= newBlockInBlockchain) {
      return await this.updateLatestBlock(newBlockInBlockchain)
    }

    await this.updateLatestBlock(endBlock)
  }
}
