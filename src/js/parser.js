export default (data) => {
  if (data.querySelector('parsererror')) {
    throw new Error('invalidRSS')
  }

  const feed = {}

  feed.title = data.querySelector('title').textContent
  feed.description = data.querySelector('description').textContent

  feed.children = Array.from(data.querySelectorAll('item'))
    .map((item) => {
      const title = item.getElementsByTagName('title')[0].textContent
      const description = item.getElementsByTagName('description')[0].textContent
      const link = item.getElementsByTagName('link')[0].textContent
      const seen = false
      return { title, description, link, seen }
    })

  return feed
}
