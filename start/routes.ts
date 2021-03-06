/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.where('id', /^[0-9]+$/) //valida params
Route.where('id', {
  match: /^[0-9]+$/,
  cast: (id) => Number(id),
}) // converte o valor do param

Route.where('id', Route.matchers.number()) // elemina os dois de cima

// Route.group(() => {
//   Route.get('users', 'UsersController.index')
//   Route.post('users/', 'UsersController.store')
//   Route.get('users/:id', 'UsersController.show')
//   Route.put('users/:id', 'UsersController.update')
//   Route.delete('users/:id', 'UsersController.destroy')
// }).prefix('v1/api')

Route.group(() => {
  Route.resource('users/', 'UsersController')
}).prefix('v1/api')

//todos exeto destroy
// Route.group(() => {
//   Route.resource('users/', 'UsersController').except(['destroy'])
// }).prefix('v1/api')
