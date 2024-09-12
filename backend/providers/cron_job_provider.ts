import type { ApplicationService } from '@adonisjs/core/types'
import { CronJob } from 'cron'
import HandleGetDataBlockchainsController from '#controllers/handle_get_data_blockchains_controller'
export default class CronJobProvider {
  private handleGetDataBlockchainsController: HandleGetDataBlockchainsController
  private cronJob: CronJob | undefined
  constructor(protected app: ApplicationService) {
    this.handleGetDataBlockchainsController = new HandleGetDataBlockchainsController()
  }

  /**
   * Register bindings to the container
   */
  register() {
    console.log('object')
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    // console.log('chay diiiii')
    // this.cronJob = new CronJob('*/10 * * * * *', async () => {
    //   console.log('Cron job is running...')
    //   try {
    //     await this.handleGetDataBlockchainsController.fetchData()
    //     console.log('Data fetch completed successfully.')
    //   } catch (error) {
    //     console.error('Error fetching data:', error)
    //   }
    // })
    // this.cronJob.start()
  }

  /**
   * The process has been started
   */
  async ready() {
    this.cronJob = new CronJob('*/10 * * * * *', async () => {
      console.log('Cron job is running...')
      try {
        await this.handleGetDataBlockchainsController.fetchData()
        console.log('Data fetch completed successfully.')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    })
    this.cronJob.start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    if (this.cronJob) {
      this.cronJob.stop() // Dừng cron job nếu có
    }
    console.log('Cron job has been stopped.')
  }
}
