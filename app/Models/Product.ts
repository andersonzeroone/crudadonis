import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Categorie from './Categorie'

import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import ProductFilter from './Filters/ProductFilter'

import { v4 as uuidv4 } from 'uuid'

export default class Product extends compose(BaseModel, Filterable) {
  public static $filter = () => ProductFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidv4

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Categorie, { pivotTable: 'products_categories' })
  public categories: ManyToMany<typeof Categorie>

  @beforeCreate()
  public static defineUUID(product: Product) {
    product.secureId = uuidv4()
  }
}
