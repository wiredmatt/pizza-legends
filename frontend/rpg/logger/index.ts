type Cause = 'Error' | 'Warning' | 'Info'

const read = async () => {
  return await fetch('/api/logger/read')
}

const write = async (
  title: string,
  message: string,
  cause: Cause
) => {
  return await fetch('/api/logger/write', {
    method: 'PATCH',
    body: JSON.stringify({ title, message, cause })
  })
}

const error = async (title: string, message: string) => {
  return await write(title, message, 'Error')
}

const warning = async (title: string, message: string) => {
  return await write(title, message, 'Warning')
}

const info = async (title: string, message: string) => {
  return await write(title, message, 'Info')
}

const setup = async () => {
  fetch('/api/logger/setup', {
    method: 'POST'
  })
}

export default {
  write,
  read,
  error,
  warning,
  info,
  setup
}
