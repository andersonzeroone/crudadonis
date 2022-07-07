import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.ok({ message: 'Lista todos os users' })
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
