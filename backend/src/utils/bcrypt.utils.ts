import { compare, genSalt, hash } from 'bcrypt'

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10)

  return hash(password + process.env.PASSWORD_SECRET, salt)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return compare(password + process.env.PASSWORD_SECRET, hashedPassword)
}
