import * as yup from 'yup'

const schema = yup
  .string()
  .required('Пожалуйста вставьте ссылку')
  .url('Ссылка должна быть валидным URL')

export default (urls, url) => {
  return Promise.resolve(url)
    .then((url) => {
      if (urls.includes(url)) {
        throw new Error('RSS уже существует')
      }
    })
    .then(() => schema.validate(url))
}
