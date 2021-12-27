document
  .getElementById('vacationPhotoContestForm')
  .addEventListener('submit', evt => {
    evt.preventDefault()

    const body = new FormData(evt.target)
    const container = document.getElementById(
      'vacationPhotoContestFormContainer',
    )
    //const url = '/api/vacation-photo-ajax/{{year}}/{{month}}'
    fetch(url, { method: 'post', body })
      .then(res => {
        if (res.status < 200 || res.status >= 300)
          throw new Error(`Request failed with status code ${res.status}`)
        return res.json()
      })
      .then(_json => {
        container.innerHTML = '<b>Thank you for submitting your photo!</b>'
      })
      .catch(_err => {
        container.innerHTML =
          "<b>We're sorry, we had a problem processing " +
          "your submission. Please <a href='/contest/vacation-photo-ajax'>try again</a>"
      })
  })
