import { INestApplication } from '@nestjs/common'
import { appConfig } from '@nuclent/be-core'
import { buildTestModule } from '@nuclent/be-testing'
import { AppModule } from './app.module'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await buildTestModule({ imports: [AppModule] })
    app = module.createNestApplication()
    await appConfig(app)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => expect(app).toBeDefined())
})
