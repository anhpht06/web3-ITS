import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('tx_hash').notNullable() // txHash
      table.string('metthod').notNullable() // Method
      table.string('block').notNullable() // Block
      table.string('time').notNullable() // Time
      table.string('from').notNullable() // From
      table.string('to').notNullable() // To
      table.string('amount').notNullable() // Amount
      table.string('fee').notNullable() // Fee

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
