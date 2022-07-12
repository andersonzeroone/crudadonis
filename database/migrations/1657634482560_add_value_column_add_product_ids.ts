import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('cart_id').dropColumn('cart_id')

      table
        .integer('product_id')
        .references('id')
        .inTable('products')
        .notNullable()
        .onDelete('CASCADE')
        .unsigned()
        .after('user_id')

      table.decimal('price_paid', 8, 0).defaultTo(0).unsigned().after('product_id')

      table.integer('quantity').defaultTo(1).unsigned().notNullable().after('price_paid')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('cart_id')
        .unsigned()
        .references('id')
        .inTable('carts')
        .after('user_id')
        .notNullable()
        .onDelete('CASCADE')

      table.dropForeign('product_id').dropColumn('product_id')

      table.dropColumn('price_paid')

      table.dropColumn('quantity')
    })
  }
}
