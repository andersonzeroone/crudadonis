/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  name(value: string) {
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  createdAt(value: string) {
    this.$query.where('created_at', 'LIKE', `%${value}%`)
  }

  city(value: string) {
    this.$query.whereHas('address', (AddressModel) => {
      AddressModel.where('city', 'LIKE', `%${value}%`)
    })
  }

  state(value: string) {
    this.$query.whereHas('address', (AddressModel) => {
      AddressModel.where('state', 'LIKE', `%${value}%`)
    })
  }
}
