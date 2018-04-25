import mailgun from 'mailgun-js'

// TODO: Move to lib
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

const emailDefaults = {
  from: "Robot Akagi <i-am-a-robot@akagi.co>",
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
Email Context: ${submissionMessage}


Hi, thanks for adding your email!

This is just an automated email saying hey so you have my contact info.

I'm primarily based out of SF, down to meet up whenever I have room in my schedule.

Feel free to check out my stuff at https://akagi.co

My lifestyle: https://medium.com/@akagi/living-lavish-out-of-a-backpack-61a80401d6a4
My mission: https://medium.com/@akagi/heliocentric-ventures-master-plan-abd28eb3153a
My location: https://akagi.co/location

- Alex Akagi

    `,
  })
  .then(msg => {
    // TODO: Make this a class
    cb(null, {
      body: JSON.stringify({
        message: 'Email submission successful!'
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
