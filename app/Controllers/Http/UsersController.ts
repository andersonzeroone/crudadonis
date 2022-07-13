import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { sendMail } from 'App/Services/sendMail'
import AccessAllowValidator from 'App/Validators/User/AccessAllowValidator'
// import Env from '@ioc:Adonis/Core/Env'

import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/updateValidator'
export default class UsersController {
  public async index({ response, request }: HttpContextContract) {
    const { page, perPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return User.query()
        .preload('address')
        .preload('roles', (roletable) => {
          roletable.select('id', 'name')
        })
        .filter(inputs)
    }

    try {
      const users = await User.query()
        .preload('address')
        .preload('roles', (roletable) => {
          roletable.select('id', 'name')
        })
        .filter(inputs)
        .paginate(page || 1, perPage || 10)

      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: 'error in list users', originalError: error.message })
    }
    // response.ok({ message: Env.get('EMAIL') })
  }

  public async store({ response, request }: HttpContextContract) {
    await request.validate(StoreValidator)

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

    const trx = await Database.beginGlobalTransaction()

    try {
      userCreate = await User.create(bodyUser, trx)

      const roleClient = await Role.findBy('name', 'client')

      if (roleClient) await userCreate.related('roles').attach([roleClient.id], trx)
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    try {
      await userCreate.related('address').create(bodyAddress)
    } catch (error) {
      trx.rollback()

      return response.badRequest({
        message: 'Error in create address',
        originalError: error.message,
      })
    }

    let user

    try {
      user = await User.query().where('id', userCreate.id).preload('roles').preload('address')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in find user',
        originalError: error.message,
      })
    }

    const { email, name } = userCreate
    try {
      await sendMail(email, name, 'email/welcome')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in send email welcome',
        user,
        originalError: error.message,
      })
    }

    trx.commit()

    return response.ok({ user })
  }

  public async show({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      const user = await User.query()
        .where('secure_id', userSecureId)
        .preload('address')
        .preload('roles')

      return response.ok(user)
    } catch (error) {
      return response.notFound({
        message: 'User not found',
        originalError: error.message,
      })
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userSecureId = params.id
    const bodyUser = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'addressId',
      'zip_code',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement',
    ])

    let userUpdate

    const trx = await Database.beginGlobalTransaction()

    try {
      userUpdate = await User.findByOrFail('secure_id', userSecureId)
      userUpdate.useTransaction(trx)
      await userUpdate.merge(bodyUser).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in update user', originalError: error.message })
    }

    try {
      const addressUpdate = await Address.findByOrFail('id', bodyAddress.addressId)

      addressUpdate.useTransaction(trx)

      delete bodyAddress.addressId

      await addressUpdate.merge(bodyAddress).save()
    } catch (error) {
      trx.rollback()

      return response.badRequest({
        message: 'Error in create address',
        originalError: error.message,
      })
    }

    let userFind

    try {
      userFind = await User.query().where('id', userUpdate.id).preload('roles').preload('address')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in find user',
        originalError: error.message,
      })
    }

    trx.commit()

    return response.ok({ userFind })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const userSecureId = params.id

    try {
      await User.query().where('secure_id', userSecureId).delete()

      return response.ok({ messega: 'User delete successfully' })
    } catch (error) {
      return response.notFound({ message: 'User not found', originalError: error.message })
    }
  }

  public async AccessAllow({ response, request }: HttpContextContract) {
    await request.validate(AccessAllowValidator)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { user_id, roles } = request.all()

    try {
      const userAllow = await User.findByOrFail('id', user_id)

      let roleIds: number[] = []
      await Promise.all(
        roles.map(async (roleName) => {
          const hasRole = await Role.findBy('name', roleName)
          if (hasRole) roleIds.push(hasRole.id)
        })
      )

      await userAllow.related('roles').sync(roleIds)
    } catch (error) {
      return response.badRequest({ message: 'Error in access allow', originalError: error.message })
    }

    try {
      return User.query().where('id', user_id).preload('roles').preload('address').firstOrFail()
    } catch (error) {
      return response.badRequest({
        message: 'Error in find user',
        originalError: error.message,
      })
    }
  }
}
