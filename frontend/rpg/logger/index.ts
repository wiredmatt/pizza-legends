type Cause = 'Error' | 'Warning' | 'Info'
type Log = {
  title: string
  message: string
  cause: Cause | ''
}

let lastLog: Log = { title: '', message: '', cause: '' }

const setLastLog = (log: Log) => {
  lastLog = log
}

const getLastLog = () => {
  return lastLog
}

const read = async () => {
  return await fetch('/api/logger/read')
}

const write = async (incomingLog: Log) => {
  if (getLastLog().title !== incomingLog.title) {
    setLastLog(incomingLog)
    return await fetch('/api/logger/write', {
      method: 'PATCH',
      body: JSON.stringify(incomingLog),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const error = async (title: string, message: string) => {
  return await write({ title, message, cause: 'Error' })
}

const warning = async (title: string, message: string) => {
  return await write({ title, message, cause: 'Warning' })
}

const info = async (title: string, message: string) => {
  return await write({ title, message, cause: 'Info' })
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
