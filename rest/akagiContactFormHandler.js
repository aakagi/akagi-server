import mailgun from 'mailgun-js'

// TODO: Move to lib
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const emailDefaults = {
  from: 'Alex Akagi (Automated) <alex@akagi.co>',
}

function sendEmail(options) {
  return new Promise((resolve, reject) => {
    mg.messages().send({
      ...emailDefaults,
      ...options,
    }, (err, response) => {
      return err
        ? reject(err)
        : resolve(response)
    })
  })
}

export default function akagiContactFormHandler(e, ctx, cb) {
  const {
    email: submissionEmail,
    message: submissionMessage,
  } = JSON.parse(e.body)

  sendEmail({
    to: ['alex@akagi.co', submissionEmail],
    subject: `AKAGI.CO - ${submissionEmail}`,
    text: `
What's the context?:
${submissionMessage}


Hi, happy we've met!

This is an automated email saying ~ hey ~ and to exchange emails.

I also use this as a tool to give people I've just met an overview of who I am. Feel free to send me a blurb about yourself this way!

I'm based out of SF & down to meet whenever I'm free. I try to keep my location updated -> https://akagi.co/location

- Alex Akagi


Lifestyle - https://medium.com/@akagi/living-lavish-out-of-a-backpack-61a80401d6a4
Mission - https://medium.com/@akagi/heliocentric-ventures-master-plan-abd28eb3153a
Thoughts - https://akagi.co

    `,
  })
  .then(msg => {
    // TODO: Make this a class
    cb(null, {
      body: JSON.stringify({
        message: 'Email submitted! You should receive an email within the next few minutes. Mailgun free-tier can be slow sometimes...'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  })
  .catch(err => {
    // TODO: Figure out proper error objects and response codes
    cb(null, {
      body: {
        error: err.message,
      },
    })
  })
}
