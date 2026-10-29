const API_BASE_URL = 'https://manovichar-backend.onrender.com'
const BLOGS_ENDPOINT = `${API_BASE_URL}/api/blogs`
const ADMIN_BLOGS_ENDPOINT = `${API_BASE_URL}/api/admin/blogs`

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

export function fetchBlogs(signal) {
  return requestJson(BLOGS_ENDPOINT, { signal })
}

export function createBlog(blog, adminToken = '') {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (adminToken) headers.MANOVICHAR_ADMIN_TOKEN = adminToken

  return requestJson(ADMIN_BLOGS_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(blog),
  })
}

export function deleteBlog(blogId, adminToken) {
  const token = adminToken?.trim()
  if (!token) throw new Error('An admin token is required to delete a blog post.')

  return requestJson(`${ADMIN_BLOGS_ENDPOINT}/${encodeURIComponent(blogId)}`, {
    method: 'DELETE',
    headers: {
      MANOVICHAR_ADMIN_TOKEN: token,
    },
  })
}
