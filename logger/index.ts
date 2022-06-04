import chalk from 'chalk'
import { appendFile, readFile } from 'fs/promises'
import { join } from 'path'

type Cause = 'Error' | 'Warning' | 'Info'

const _error = chalk.bold.red
const _warning = chalk.hex('#FFA500')
const _info = chalk.green

const fPath = join(__dirname, 'pizza-legends.log')

const read = async () => {
  return await readFile(fPath, 'utf8')
}

const write = async (
  title: string,
  message: string,
  cause: Cause
) => {
  switch (cause) {
    case 'Error':
      title = _error(title)
      break
    case 'Warning':
      title = _warning(title)
      break
    case 'Info':
      title = _info(title)
      break
    default:
      title = chalk.white(title)
      break
  }

  const d = new Date().toJSON()
  const ds = d.split('T')

  let log = ''

  const logHistory = await read()

  if (logHistory.indexOf(ds[0]) === -1) {
    log += `
${ds[0]}
`
  }

  log += `
---
➦ [ ${title} ] [ ${ds[1].split('.')[0]} ]
${message}
---
`
  console.log(log)
  await appendFile(fPath, log, 'utf8')
}

const error = (title: string, message: string) => {
  return write(title, message, 'Error')
}

const warning = (title: string, message: string) => {
  return write(title, message, 'Warning')
}

const info = (title: string, message: string) => {
  return write(title, message, 'Info')
}

export default {
  write,
  read,
  error,
  warning,
  info
}
