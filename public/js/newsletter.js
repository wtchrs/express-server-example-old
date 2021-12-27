document
  .getElementById('newsletterSignupForm')
  .addEventListener('submit', evt => {
    evt.preventDefault()

    const form = evt.target
    const body = JSON.stringify({
      _csrf: form.elements._csrf.value,
      name: form.elements.name.value,
      email: form.elements.email.value,
    })

    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('newsletterSignupFormContainer')

    fetch('/api/newsletter-signup', { method: 'post', body, headers })
      .then(res => {
        if (res.status < 200 || res.status >= 300)
          throw new Error(`Request failed with status code ${res.status}`)
        return res.json()
      })
      .then(_json => {
        container.innerHTML = '<b>Thank you for signing up!</b>'
      })
      .catch(_err => {
        container.innerHTML =
          "<b>We're sorry, we had a problem signing you up. " +
          "Please <a href='/newsletter'>try again</a></b>"
      })
  })
