browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received request: ', request)

  if (request.type == 'code') {
    browser.runtime.sendNativeMessage({ request: 'code' }, (response) => {
      console.log('Received native response: ', response)
      sendResponse({
        code: response['code'],
      })
    })

    return true
  } else {
    return Promise.resolve({
      error: 'Unknown request type',
    })
  }
})
