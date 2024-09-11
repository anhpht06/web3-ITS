import type { HttpContext } from '@adonisjs/core/http'

export default class HandleGetDataDatabaseController {
  public async getDataByUser(ctx: HttpContext) {
    return ctx.response.json({ data: 'Hello Tuaans Anh' })
  }
}
