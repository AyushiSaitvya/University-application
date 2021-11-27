
// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {
  confirm: id => ({
    subject: 'React Confirm Email',
    html: `
      <a href='https://wizardly-fermat-183e21.netlify.app/confirm/${id}'>
        click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: https://wizardly-fermat-183e21.netlify.app/confirm/${id}`
  }),
  
  resetPassword: id => ({
    subject: 'React Reset Passowrd Email',
    html: `
      <a href='https://wizardly-fermat-183e21.netlify.app/resetPassword/${id}'>
        click to reset password
      </a>
    `,      
    text: `Copy and paste this link: https://wizardly-fermat-183e21.netlify.app/resetPassword/${id}`
  })

  
}
