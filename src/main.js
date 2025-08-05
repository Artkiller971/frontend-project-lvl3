import './styles.scss'
import validate from './js/validate'
import onChange from 'on-change'
import i18next from 'i18next'
import ru from './locales/ru'

const init = async () => {
  const i18nextInstance = i18next.createInstance()
  await i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  })

  const state = {
    formState: {
      isValid: true,
      message: '',
    },
    posts: {
      addedUrls: [],
    },
  }

  // TODO: Сделать добавление урлов во второй <section>

  const form = document.querySelector('form')
  const input = document.getElementById('url-input')
  const feedbackField = document.querySelector('.feedback')
  const postsDiv = document.querySelector('.posts')
  // const feedsDiv = document.querySelector('.feeds')

  const updateFormUI = () => {
    const { isValid, message } = watchedFormState.formState

    if (isValid) {
      feedbackField.classList.remove('text-danger')
      feedbackField.classList.add('text-success')
      input.classList.remove('is-invalid')
      feedbackField.textContent = message
    }
    else {
      feedbackField.textContent = message
      feedbackField.classList.remove('text-success')
      feedbackField.classList.add('text-danger')
      input.classList.add('is-invalid')
    }
  }

  const updatePostsUI = () => {
    postsDiv.innerHTML = ''
    const divCardBorder = document.createElement('div')
    divCardBorder.classList.add('card', 'border-0')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const postsUl = document.createElement('ul')
    postsUl.classList.add('list-group', 'border-0', 'rounded-0')

    const items = watchedPosts.addedUrls
      .map((item, index) => {
        const li = document.createElement('li')
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

        const a = document.createElement('a')
        a.classList.add('fw-bold')
        a.setAttribute('href', item)
        a.setAttribute('data-id', index)
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
        a.textContent = item

        const button = document.createElement('button')
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
        button.setAttribute('data-id', index)
        button.setAttribute('type', 'button')
        button.setAttribute('data-bs-toggle', 'modal')
        button.setAttribute('data-bs-target', '#modal')
        button.textContent = i18nextInstance.t('feed.button')
        // event listener for modal

        li.append(a, button)
        return li
      })

    postsUl.append(...items)
    divCardBorder.append(cardBody, postsUl)
    postsDiv.append(divCardBorder)
  }

  const watchedFormState = onChange(state.formState, updateFormUI)
  const watchedPosts = onChange(state.posts, updatePostsUI)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = formData.get('url')

    validate(watchedPosts.addedUrls, url)
      .then(() => {
        watchedPosts.addedUrls.push(url)
        watchedFormState.formState = {
          isValid: true,
          message: i18nextInstance.t('validate.success'),
        }

        form.reset()
        input.focus()
      })
      .catch((error) => {
        watchedFormState.formState = {
          isValid: false,
          message: i18nextInstance.t(`errors.${error.message}`),
        }
      })
  })
}

init()
