import router from '@adonisjs/core/services/router'
import HandleGetDataDatabaseController from '#controllers/handle_get_data_database_controller'

router
  .group(() => {
    router.get('/getDataByUser', [HandleGetDataDatabaseController, 'getDataByUser'])
  })
  .prefix('/blockchain')
