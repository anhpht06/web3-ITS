import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class transactions extends BaseModel {
  public static table = 'transactions'

  @column({ isPrimary: true })
  public id?: number

  @column({ columnName: 'logIndex' })
  public logIndex?: number

  @column({ columnName: 'txHash' })
  public txHash?: string

  @column({ columnName: 'method' })
  public method?: string

  @column({ columnName: 'block' })
  public block?: string

  @column({ columnName: 'timestamp' })
  public timestamp?: string

  @column({ columnName: 'from' })
  public from?: string

  @column({ columnName: 'to' })
  public to?: string

  @column({ columnName: 'amount' })
  public amount?: string

  @column({ columnName: 'fee' })
  public fee?: string

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt?: DateTime
}
