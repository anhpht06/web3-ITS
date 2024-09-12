import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
export function getDepositContractABI() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const contractPath = path.resolve(__dirname, '../contracts/ContractHandle.json')
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  return contract.abi
}

export function getDepositContractAddress() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const contractPath = path.resolve(__dirname, '../contracts/contract-address.json')
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  return contract.contractHandle
}

export function getLatestBlock() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const contractPath = path.resolve(__dirname, '../contracts/contract-address.json')
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  return contract.blockNumber
}
