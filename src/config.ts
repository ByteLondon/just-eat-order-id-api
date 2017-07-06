if (!process.env.DYNO) require('dotenv').config()

const env = name => {
  const a = process.env[name]
  if (!a) {
    throw new Error(`missing environment variable: ${name}`)
  }
  return a
}

export const facebookAccessToken = env('FACEBOOK_ACCESS_TOKEN')

export const databaseUrl = env('DATABASE_URL')
