import type { HttpContext } from '@adonisjs/core/http'
import Transactions from '#models/transactions'

export default class HandleGetDataDatabaseController {
  public async getDataByUser(ctx: HttpContext) {
    const currentPage = ctx.request.input('page', 1)
    const data = await Transactions.query().orderBy('timestamp', 'desc').paginate(currentPage, 10)
    return ctx.response.json({ data })
  }
}
