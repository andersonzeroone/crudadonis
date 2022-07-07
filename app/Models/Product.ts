import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import { v4 as uuidV4 } from 'uuid'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidV4

  @column()
  public name: string

  @column()
  public code: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}