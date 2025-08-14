import './styles.scss'
import validate from './js/validate'
import onChange from 'on-change'
import i18next from 'i18next'
import ru from './locales/ru'
import axios from 'axios'
import parser from './js/parser'

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

  const updatePostsUI = () => {
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
      .map(({ title, /* description, */ link, seen }, index) => {
        const li = document.createElement('li')
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

        const a = document.createElement('a')
        if (seen) {
          a.classList.add('fw-normal', 'link-secondary')
        }
        else {
          a.classList.add('fw-bold')
        }

        a.setAttribute('href', link)
        a.setAttribute('data-id', index)
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
        a.textContent = title

        const button = document.createElement('button')
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
        button.setAttribute('data-id', index)
        button.setAttribute('type', 'button')
        button.setAttribute('data-bs-toggle', 'modal')
        button.setAttribute('data-bs-target', '#modal')
        button.textContent = i18nextInstance.t('button')
        // event listener for modal

        li.append(a, button)
        return li
      })

    postsUl.append(...items)
  }

  const updateFeedsUI = () => {
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

  const watchedFormState = onChange(state.formState, updateFormUI)
  const watchedPosts = onChange(state.posts, updatePostsUI)
  const watchedFeeds = onChange(state.feeds, updateFeedsUI)

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
        console.log(parsed)
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
        console.error(error)
        watchedFormState.formState = {
          state: 'invalid',
          message: i18nextInstance.t(`errors.${error.message}`),
        }
      })
  })
}

init()
