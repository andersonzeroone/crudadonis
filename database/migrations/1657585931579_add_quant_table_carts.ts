import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'carts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('quantity').defaultTo(1).unsigned().notNullable().after('product_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('quantity')
    })
  }
}
