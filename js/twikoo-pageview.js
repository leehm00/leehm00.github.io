(function () {
  const SERVER_URL = 'https://sensational-valkyrie-859db2.netlify.app/.netlify/functions/twikoo'
  const target = document.getElementById('busuanzi_value_page_pv')

  if (!target || target.dataset.pageviewLoading === 'true') return

  target.dataset.pageviewLoading = 'true'

  const controller = new AbortController()
  const timeout = setTimeout(function () {
    controller.abort()
  }, 8000)

  fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: 'COUNTER_GET',
      url: window.location.pathname,
      href: window.location.href,
      title: document.title
    }),
    signal: controller.signal
  })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status)
      return response.json()
    })
    .then(function (result) {
      if (result.message) throw new Error(result.message)

      const previousCount = Number(result.time)
      target.textContent = Number.isFinite(previousCount) ? previousCount + 1 : 1
      target.dataset.pageviewLoaded = 'true'
    })
    .catch(function (error) {
      target.textContent = '--'
      target.title = '访问量暂时不可用'
      console.warn('Twikoo page-view counter failed:', error)
    })
    .finally(function () {
      clearTimeout(timeout)
      delete target.dataset.pageviewLoading
    })
})()
