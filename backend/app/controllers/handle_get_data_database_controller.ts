import type { HttpContext } from '@adonisjs/core/http'
import Transactions from '#models/transactions'

export default class HandleGetDataDatabaseController {
  public async getDataByUser(ctx: HttpContext) {
    const data = await Transactions.query()
    return ctx.response.json({ data })
  }
}
