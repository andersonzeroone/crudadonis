import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
// import Env from '@ioc:Adonis/Core/Env'
export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.status(200).json({ message: 'success' })
    // response.ok({ message: Env.get('EMAIL') })
  }

  public async store({ response, request }: HttpContextContract) {
    const bodyUser = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'zip_code',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement',
    ])

    let userCreate

    try {
      userCreate = await User.create(bodyUser)

      const roleClient = await Role.findBy('name', 'client')

      if (roleClient) await userCreate.related('roles').attach([roleClient.id])
    } catch (error) {
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    try {
      await userCreate.related('address').create(bodyAddress)
    } catch (error) {
      return response.badRequest({
        message: 'Error in create address',
        originalError: error.message,
      })
    }

    let userFind

    try {
      userFind = await User.query().where('id', userCreate.id).preload('roles').preload('address')
    } catch (error) {
      return response.badRequest({
        message: 'Error in find user',
        originalError: error.message,
      })
    }

    response.ok({ userFind })
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
