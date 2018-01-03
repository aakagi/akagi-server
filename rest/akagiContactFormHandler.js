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
    name: submissionName,
    message: submissionMessage,
  } = JSON.parse(e.body)

  sendEmail({
    to: [submissionEmail],
    bcc: ['alexanderakagi@gmail.com'],
    subject: `AKAGI.CO - ${submissionName}`,
    text: `
      Contact Form Submitted:
      Submission Email: ${submissionEmail}
      Submission Name: ${submissionName}
      Submission Message: ${submissionMessage}
    `,
  })
  .then(msg => {
    // TODO: Make this a class
    cb(null, {
      body: {
        message: 'Email submission successful!',
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
