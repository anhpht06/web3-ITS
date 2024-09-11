import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public txHash!: string

  @column()
  public metthod!: string

  @column()
  public Block!: string

  @column()
  public time!: string

  @column()
  public From!: string

  @column()
  public To!: string

  @column()
  public Amount!: string

  @column()
  public Fee!: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
