import React from 'react'
import { Field, Submit } from 'components/Forms'
import { withFormik } from 'formik'
import yup from 'yup'
import api from 'api'

const statusMessage = status =>
  status
    ? {
        success: 'Success!',
        error: 'Something went wrong 🚨'
      }[status]
    : 'Post your project'
const statusColor = status =>
  status === 'success' || status === 'error' ? status.toString() : 'info'
const InnerForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  status
}) => (
  <form onSubmit={handleSubmit}>
    <Field
      label="Name"
      name="name"
      placeholder="My Project"
      value={values.name}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.name && errors.name}
      bg="white"
      mb={2}
    />
    <Field
      label="Description"
      name="description"
      placeholder="Write something about your project…"
      value={values.description}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.description && errors.description}
      bg="white"
      mb={2}
    />
    <Field
      label="URL"
      name="url"
      placeholder="https://my-project.glitch.me"
      value={values.url}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.url && errors.url}
      bg="white"
      mb={3}
    />
    <Submit
      disabled={isSubmitting}
      onClick={handleSubmit}
      value={statusMessage(status)}
      bg={statusColor(status)}
      f={2}
      w={1}
    />
  </form>
)
const PostForm = withFormik({
  mapPropsToValues: ({ params }) => ({ ...params }),
  validationSchema: yup.object().shape({
    name: yup.string().required('required'),
    description: yup.string(),
    url: yup
      .string()
      .url()
      .required('required')
  }),
  enableReinitialize: true,
  handleSubmit: (data, { setSubmitting, setStatus, resetForm }) => {
    console.log(data)
    api // TODO: embed real challenge ID here
      .post(`v1/challenges/1/posts`, {
        body: JSON.stringify(data)
      })
      .then(res => {
        console.log(res)
        resetForm()
        setStatus('success')
      })
      .catch(e => {
        console.error(e)
        setSubmitting(false)
        setStatus('error')
      })
  },
  displayName: 'PostForm'
})(InnerForm)
export default PostForm
