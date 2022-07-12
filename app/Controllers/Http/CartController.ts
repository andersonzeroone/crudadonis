import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'

import StoreValidator from 'App/Validators/Cart/StoreValidator'
import UpdateValidator from 'App/Validators/Cart/UpdateValidator'

export default class CartController {
  public async index({}: HttpContextContract) {}

  public async store({ response, request, auth }: HttpContextContract) {
    await request.validate(StoreValidator)

    let bodyCart = request.only(['user_id', 'product_id', 'quantity'])

    bodyCart.user_id = auth.user?.id

    try {
      const cart = await Cart.create(bodyCart)
      return response.ok(cart)
    } catch (error) {
      return response.badRequest({
        message: 'Error register item in the cart',
        originalError: error.message,
      })
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({ response, request, auth }: HttpContextContract) {
    await request.validate(UpdateValidator)
  }

  public async destroy({}: HttpContextContract) {}
}
