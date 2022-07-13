import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestRedisController {
  public async store({ response }: HttpContextContract) {
    const myName = await Redis.set('name', 'anderson')

    return response.ok({ myName })
  }

  public async show({ response }: HttpContextContract) {
    const myName = await Redis.get('name')

    return response.ok({ myName })
  }

  public async destroy({ response }: HttpContextContract) {
    const myName = await Redis.del('name')

    return response.ok({ myName })
  }
}
