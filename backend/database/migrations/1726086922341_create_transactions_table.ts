import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('logIndex').notNullable()
      table.index('logIndex')
      table.string('txHash').notNullable() // txHash
      table.index('txHash')
      table.string('method').notNullable() // Method
      table.string('block').notNullable() // Block
      table.string('timestamp').notNullable() // Time
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
