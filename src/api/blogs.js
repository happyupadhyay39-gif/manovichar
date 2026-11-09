const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://manovichar-backend-1.onrender.com'
const BLOGS_ENDPOINT = `${API_BASE_URL}/api/blogs`
const ADMIN_BLOGS_ENDPOINT = `${API_BASE_URL}/api/admin/blogs`
const REQUEST_TIMEOUT = 60_000

async function getErrorMessage(response) {
  const body = await response.text()
  if (!body) return `Request failed (${response.status}).`

  try {
    const payload = JSON.parse(body)
    if (payload && typeof payload === 'object') {
      const message = payload.detail ?? payload.message
      if (typeof message === 'string') return message
      if (message !== undefined) return JSON.stringify(message)
    }
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
  }

  return body
}

async function requestJson(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(await getErrorMessage(response))
  if (response.status === 204) return null

  try {
    return await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('The server returned an invalid JSON response.')
    }
    throw error
  }
}

function requestJsonWithTimeout(url, options, timeoutMessage) {
  const controller = new AbortController()
  let timedOut = false
  const { signal, ...requestOptions } = options
  const abortRequest = () => controller.abort(signal.reason)

  if (signal?.aborted) {
    abortRequest()
  } else {
    signal?.addEventListener('abort', abortRequest, { once: true })
  }

  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT)

  return requestJson(url, { ...requestOptions, signal: controller.signal })
    .catch(error => {
      if (timedOut) {
        throw new Error(timeoutMessage)
      }
      if (error instanceof TypeError) {
        throw new Error(
          'Could not connect to the blog server. It may still be waking up, or the connection may be blocked by server settings. Please retry shortly.'
        )
      }
      throw error
    })
    .finally(() => {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', abortRequest)
    })
}

export function fetchBlogs(signal) {
  return requestJsonWithTimeout(
    BLOGS_ENDPOINT,
    { signal },
    'The stories service is taking longer than expected. Please retry.'
  )
}

export function createBlog(blog, adminToken = '') {
  const headers = {
    'Content-Type': 'application/json',
  }
  const token = adminToken.trim()
  if (token) headers.MANOVICHAR_ADMIN_TOKEN = token

  return requestJsonWithTimeout(
    ADMIN_BLOGS_ENDPOINT,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(blog),
    },
    'Publishing is taking longer than expected. Please retry.'
  )
}

export function uploadBlogImage(file, adminToken = '', onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('image', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${ADMIN_BLOGS_ENDPOINT}/images`)
    xhr.timeout = REQUEST_TIMEOUT

    const token = adminToken.trim()
    if (token) xhr.setRequestHeader('MANOVICHAR_ADMIN_TOKEN', token)

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      let payload
      try {
        payload = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('The image service returned an invalid response.'))
        return
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        const message = payload?.detail ?? payload?.message
        reject(new Error(typeof message === 'string' ? message : `Image upload failed (${xhr.status}).`))
        return
      }

      const imageUrl = payload?.image_url ?? payload?.url
      try {
        if (typeof imageUrl !== 'string' || new URL(imageUrl).protocol !== 'https:') {
          throw new Error()
        }
      } catch {
        reject(new Error('The image service did not return a valid secure image URL.'))
        return
      }

      resolve(imageUrl)
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Could not connect to the image service. Please retry.'))
    })
    xhr.addEventListener('timeout', () => {
      reject(new Error('Image upload is taking longer than expected. Please retry.'))
    })
    xhr.send(formData)
  })
}

export function deleteBlog(blogId, adminToken) {
  const token = adminToken?.trim()
  if (!token) throw new Error('An admin token is required to delete a blog post.')

  return requestJsonWithTimeout(
    `${ADMIN_BLOGS_ENDPOINT}/${encodeURIComponent(blogId)}`,
    {
      method: 'DELETE',
      headers: {
        MANOVICHAR_ADMIN_TOKEN: token,
      },
    },
    'Deleting is taking longer than expected. Please retry.'
  )
}
