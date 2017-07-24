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

export const page = {
  jeUk: '340627227551'
}

export const adAcount = {
  jeAppInstall: '1279122602099110',
  jeBrandStrategy: '1288521927825844',
  jeChatbot: '1343595992318437',
  jeConversion: '1148017655209606',
  jeCreditCardBackup: '1195129097165128',
  jeEngagement: '1411952492149453'
}
