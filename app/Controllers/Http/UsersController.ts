import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.ok({ message: Env.get('EMAIL') })
  }

  public async store({ response }: HttpContextContract) {
    response.ok({ message: 'Cadastra um user' })
  }

  public async show({ response }: HttpContextContract) {
    response.ok({ message: 'mostra um  user (id)' })
  }

  public async update({ response }: HttpContextContract) {
    response.ok({ message: 'Altera dados' })
  }

  public async destroy({ response }: HttpContextContract) {
    response.ok({ message: 'deleta dados' })
  }
}
