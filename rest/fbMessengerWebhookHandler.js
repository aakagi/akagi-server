export default function fbMessengerWebhookHandler(event, context, callback) {
  const queryParams = event.queryStringParameters
  const mode = queryParams['hub.mode']
  const verifyToken = queryParams['hub.verify_token']
  const challenge = queryParams['hub.challenge']

  if (mode === 'subscribe' && verifyToken === process.env.WEBHOOK_VERIFICATION) {
    console.log('Validating webhook')
    callback(null, {
      body: challenge,
    })
  } else {
    console.error('Failed validation. Make sure the validation tokens match.')
    callback(null, {
      status: 403,
    })
  }
}
