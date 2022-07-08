import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

import { v4 as uuidV4 } from 'uuid'

import Address from './Address'
import Purchase from './Purchase'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidV4
  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Address)
  public address: HasMany<typeof Address>

  @hasMany(() => Purchase)
  public purchase: HasMany<typeof Purchase>
}
