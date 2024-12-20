import { ReadUser } from './data-access'

export const getUser = (email: string, dataAccess: ReadUser) =>
  dataAccess.readUser(email)
