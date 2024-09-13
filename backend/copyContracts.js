import fs from 'fs-extra'
import path from 'path'

const source = path.join(process.cwd(), 'app', 'contracts')
const destination = path.join(process.cwd(), 'build/app', 'contracts')

async function copyContracts() {
  try {
    await fs.copy(source, destination)
    console.log('Contracts copied successfully!')
  } catch (err) {
    console.error('Error copying contracts:', err)
  }
}

copyContracts()
