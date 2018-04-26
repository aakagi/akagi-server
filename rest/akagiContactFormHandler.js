import mailgun from 'mailgun-js'

// TODO: Move to lib
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const emailDefaults = {
  from: 'Alex Akagi (bot) <i-am-a-robot@akagi.co>',
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



Hi, thanks for adding your email!

This is an automated email saying ~ hey ~ to give you my email & some info about me.

I'm based out of SF & down to meet if I'm free.

- Alex Akagi



Lifestyle - https://medium.com/@akagi/living-lavish-out-of-a-backpack-61a80401d6a4
Mission - https://medium.com/@akagi/heliocentric-ventures-master-plan-abd28eb3153a
Location Calendar - https://akagi.co/location
Thoughts - https://akagi.co

    `,
  })
  .then(msg => {
    // TODO: Make this a class
    cb(null, {
      body: JSON.stringify({
        message: 'Email submission successful! You should receive an email at any moment.'
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
