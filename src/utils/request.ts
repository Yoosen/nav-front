import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    console.log('Response:', response.data)
    return response.data
  },
  error => {
    console.error('Request failed:', error)
    return Promise.reject(error)
  }
)

export default request 