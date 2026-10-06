import path from 'node:path'
import { PrismaClient } from '../generated/prisma/client'

// グローバルスコープでPrismaインスタンスを保持できる場所を作る
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

// Next.js はサーバー用コードを .next 配下にまとめる。
// file:./dev.db のままだと、その出力先に空の SQLite が作られ、prisma/dev.db を見ない。
const datasourceUrl = `file:${path.join(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')}`

// Prismaインスタンスがあれば使う、なければ作成
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl })
// 開発環境でのみ使用
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma