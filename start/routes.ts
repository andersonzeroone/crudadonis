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

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

// Route.where('id', /^[0-9]+$/) //valida params
// Route.where('id', {
//   match: /^[0-9]+$/,
//   cast: (id) => Number(id),
// }) // converte o valor do param

// Route.where('id', Route.matchers.number()) // elemina os dois de cima

Route.get('teste_db', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health

    if (healthy) response.ok({ message })

    return response.status(500).json({ message })
  })
})

// Route.group(() => {
//   Route.get('users', 'UsersController.index')
//   Route.post('users/', 'UsersController.store')
//   Route.get('users/:id', 'UsersController.show')
//   Route.put('users/:id', 'UsersController.update')
//   Route.delete('users/:id', 'UsersController.destroy')
// }).prefix('v1/api')

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('users', 'UsersController.store')
}).prefix('v1/api')

// Route.group(() => {
//   Route.resource('users', 'UsersController').except['store']
// }).prefix('v1/api')

Route.group(() => {
  Route.post('testAuth', ({ response }) => {
    return response.ok({ message: 'voce esta autenticado' })
  })
})
  .prefix('v1/api')
  .middleware(['auth', 'is:admin,client'])
