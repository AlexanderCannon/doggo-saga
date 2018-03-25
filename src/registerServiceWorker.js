const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      const onupdatefound = () => {
        const installingWorker = registration.installing
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content is available please refresh.') // eslint-disable-line
            } else {
              console.log('Content is cached for offline use.') // eslint-disable-line
            }
          }
        }
      }
      return {
        ...registration,
        onupdatefound,
      }
    })
    .catch(error => console.error('Error during service worker registration:', error)) // eslint-disable-line
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl)
    .then(response => (response.status === 404
      || response.headers.get('content-type').indexOf('javascript') === -1
      ? navigator.serviceWorker.ready.then(registration => (
        registration.unregister().then(() => {
          window.location.reload()
        })
      ))
      : registerValidSW(swUrl)
    ))
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.') // eslint-disable-line
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => registration.unregister())
  }
}

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location)
    if (publicUrl.origin !== window.location.origin) {
      return
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      if (isLocalhost) {
        checkValidServiceWorker(swUrl)
        navigator.serviceWorker.ready.then(() => {
          console.log( // eslint-disable-line
            'This web app is being served cache-first by a service ',
            'worker. To learn more, visit https://goo.gl/SC7cgQ',
          )
        })
      } else {
        registerValidSW(swUrl)
      }
    })
  }
}
