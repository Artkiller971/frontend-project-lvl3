import './styles.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import validate from './js/validate'
import onChange from 'on-change'
import i18next from 'i18next'
import ru from './locales/ru'
import axios from 'axios'
import parser from './js/parser'
import postsWatcher from './js/postsWatcher'
import feedsWatcher from './js/feedsWatcher'

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
      state: 'valid',
      message: '',
    },
    addedUrls: [],
    feeds: [],
    posts: [],
  }

  const form = document.querySelector('form')
  const input = document.getElementById('url-input')
  const feedbackField = document.querySelector('.feedback')
  const postsDiv = document.querySelector('.posts')
  const feedsDiv = document.querySelector('.feeds')

  const updateFormUI = () => {
    const { state, message } = watchedFormState.formState
    const submitButton = document.querySelector('[aria-label=add]')
    switch (state) {
      case 'valid': {
        feedbackField.classList.remove('text-danger')
        feedbackField.classList.add('text-success')
        input.classList.remove('is-invalid')
        feedbackField.textContent = message
        submitButton.disabled = false
        break
      }
      case 'invalid': {
        feedbackField.textContent = message
        feedbackField.classList.remove('text-success')
        feedbackField.classList.add('text-danger')
        input.classList.add('is-invalid')
        submitButton.disabled = false
        break
      }
      case 'processing': {
        feedbackField.textContent = message
        feedbackField.classList.remove('text-danger')
        submitButton.disabled = true
        break
      }
    }
  }

  const openModal = (item) => {
    item.seen = true

    const { title, description, link } = item
    const modalTitle = document.querySelector('.modal-title')
    const modalBody = document.querySelector('.modal-body')
    const modalFooter = document.querySelector('.modal-footer')
    const backdrop = document.createElement('div')
    backdrop.classList.add('modal-backdrop', 'fade', 'show')
    modalTitle.textContent = title
    modalBody.textContent = description
    modalFooter.querySelector('.full-article').setAttribute('href', link)
  }

  const watchedFormState = onChange(state.formState, updateFormUI)
  const watchedPosts = onChange(state.posts, () => {
    postsWatcher(postsDiv, watchedPosts, i18nextInstance, openModal)
  })
  const watchedFeeds = onChange(state.feeds, () => {
    feedsWatcher(feedsDiv, watchedFeeds, i18nextInstance)
  })

  const updatePosts = () => {
    const iter = () => {
      state.addedUrls.forEach((url) => {
        const corsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`
        axios.get(corsUrl)
          .then((response) => {
            const parser = new DOMParser()
            const parsed = parser.parseFromString(response.data.contents, 'application/xml')
            return parsed
          })
          .then((parsed) => {
            const { children } = parser(parsed)
            watchedPosts.unshift(...children.filter(({ title }) => !watchedPosts.find(post => post.title === title)))
          })
          .catch((error) => {
            console.error(error.message)
            throw new Error(error)
          })
      })

      return Promise.resolve()
    }

    iter()
      .catch((error) => {
        console.error(error)
        throw new Error(error)
      })
      .finally(() => {
        setTimeout(updatePosts, 5000)
      })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = formData.get('url')

    validate(state.addedUrls, url)
      .then(() => {
        const corsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`
        watchedFormState.formState = {
          state: 'processing',
          message: '',
        }
        return axios.get(corsUrl)
      })
      .then((response) => {
        const parser = new DOMParser()
        const parsed = parser.parseFromString(response.data.contents, 'application/xml')
        return parsed
      })
      .then((parsed) => {
        const { title, description, children } = parser(parsed)

        state.addedUrls.push(url)

        watchedFeeds.push({ title, description })
        watchedPosts.push(...children)
        watchedFormState.formState = {
          state: 'valid',
          message: i18nextInstance.t('validate.success'),
        }

        form.reset()
        input.focus()
      })
      .catch((error) => {
        watchedFormState.formState = {
          state: 'invalid',
          message: i18nextInstance.t(`errors.${error.message}`),
        }
      })
  })

  setTimeout(updatePosts, 5000)
}

init()
