import { Unit } from './types'

export interface ILog {
  log(message: string, ...optionalParams: unknown[]): Unit
  error(message: string, ...optionalParams: unknown[]): Unit
}

export default function getLogger(): ILog {
  return consoleLogger
}

const consoleLogger: ILog = {
  log: (message: string, ...optionalParams: unknown[]) => {
    console.log(message, optionalParams)
    return Unit.done
  },
  error: (message: string, ...optionalParams: unknown[]) => {
    console.error(message, optionalParams)
    return Unit.done
  },
}
