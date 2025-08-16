export default (postsDiv, watchedPosts, i18nextInstance, openModal) => {
  let postsUl = postsDiv.getElementsByTagName('ul')[0]

  if (!postsUl) {
    const divCardBorder = document.createElement('div')
    divCardBorder.classList.add('card', 'border-0')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    postsUl = document.createElement('ul')
    postsUl.classList.add('list-group', 'border-0', 'rounded-0')
    const header = document.createElement('h2')
    header.classList.add('card-title', 'h4')
    header.innerHTML = i18nextInstance.t('posts')

    cardBody.append(header)
    divCardBorder.append(cardBody, postsUl)
    postsDiv.append(divCardBorder)
  }

  postsUl.innerHTML = ''

  const items = watchedPosts
    .map((item, index) => {
      const { title, link, seen } = item

      const li = document.createElement('li')
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

      const a = document.createElement('a')
      if (seen) {
        a.classList.add('fw-normal', 'link-secondary')
      }
      else {
        a.classList.add('fw-bold')
      }

      const id = watchedPosts.length - index

      a.setAttribute('href', link)
      a.setAttribute('data-id', id)
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      a.textContent = title

      const button = document.createElement('button')
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.setAttribute('data-id', id)
      button.setAttribute('type', 'button')
      button.setAttribute('data-bs-toggle', 'modal')
      button.setAttribute('data-bs-target', '#modal')
      button.textContent = i18nextInstance.t('button')
      button.addEventListener('click', () => {
        openModal(item)
      })

      li.append(a, button)
      return li
    })

  postsUl.append(...items)
}
