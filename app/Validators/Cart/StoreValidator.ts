import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from '../messagensCustom'

export default class StoreValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    product_id: schema.number([
      rules.exists({ table: 'products', column: 'id' }),
      rules.unsigned(),
    ]),
    quantity: schema.number.optional([rules.unsigned()]),
  })
}
