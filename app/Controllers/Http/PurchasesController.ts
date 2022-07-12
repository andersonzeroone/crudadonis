import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Categorie'
import Product from 'App/Models/Product'

import StoreValidator from 'App/Validators/Product/StoreValidator'
export default class PurchasesController {
  public async index({}: HttpContextContract) {}

  public async store({ response, request }: HttpContextContract) {
    await request.validate(StoreValidator)
    const body = request.only(['name', 'code', 'price'])
    const { categories } = request.all()

    let productCreated

    const trx = await Database.beginGlobalTransaction()

    try {
      productCreated = await Product.create(body, trx)

      await Promise.all(
        categories.map(async (categoryName) => {
          const hasCategory = await Category.findBy('name', categoryName)
          if (hasCategory) await productCreated.related('categories').attach([hasCategory.id], trx)
        })
      )
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in create product',
        originalError: error.message,
      })
    }

    let product
    try {
      product = await Product.query()
        .where('id', productCreated.id)
        .preload('categories')
        .firstOrFail()
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in find product',
        originalError: error.message,
      })
    }

    trx.commit()

    return response.ok(product)
  }

  public async show({}: HttpContextContract) {}
}
