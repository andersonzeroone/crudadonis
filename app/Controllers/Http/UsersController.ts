import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
// import Env from '@ioc:Adonis/Core/Env'

import StoreValidator from 'App/Validators/User/StoreValidator'
export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.status(200).json({ message: 'success' })
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

    let userFind

    try {
      userFind = await User.query().where('id', userCreate.id).preload('roles').preload('address')
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

  public async show({ response }: HttpContextContract) {
    response.ok({ message: 'mostra um  user (id)' })
  }

  public async update({ response, request, params }: HttpContextContract) {
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

  public async destroy({ response }: HttpContextContract) {
    response.ok({ message: 'deleta dados' })
  }
}
