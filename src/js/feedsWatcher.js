export default (feedsDiv, watchedFeeds, i18nextInstance) => {
  let feedsUl = feedsDiv.getElementsByTagName('ul')[0]

  if (!feedsUl) {
    const divCardBorder = document.createElement('div')
    divCardBorder.classList.add('card', 'border-0')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    feedsUl = document.createElement('ul')
    feedsUl.classList.add('list-group', 'border-0', 'rounded-0')
    const header = document.createElement('h2')
    header.classList.add('card-title', 'h4')
    header.textContent = i18nextInstance.t('feeds')

    cardBody.append(header)
    divCardBorder.append(cardBody, feedsUl)
    feedsDiv.append(divCardBorder)
  }

  feedsUl.innerHTML = ''

  const items = watchedFeeds
    .map(({ title, description }) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'border-0', 'border-end-0')
      const h3 = document.createElement('h3')
      h3.classList.add('h6', 'm-0')
      h3.textContent = title
      const p = document.createElement('p')
      p.classList.add('m-0', 'small', 'text-black-50')
      p.textContent = description

      li.append(h3, p)
      return li
    })

  feedsUl.append(...items)
}
