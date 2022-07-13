import Mail from '@ioc:Adonis/Addons/Mail'
export async function sendMail(email: string, name: string, template: string): Promise<void> {
  await Mail.send((message) => {
    message
      .from('merchandise_management@email.com')
      .to(email)
      .subject('Welcome to merchandise management!')
      .htmlView(template, { name })
  })
}
