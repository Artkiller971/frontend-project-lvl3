import * as yup from 'yup'

const schema = yup
  .string()
  .required('required')
  .url('notValidUrl')

export default (urls, url) => {
  return Promise.resolve(url)
    .then((url) => {
      if (urls.includes(url)) {
        throw new Error('duplicate')
      }
    })
    .then(() => schema.validate(url))
}
