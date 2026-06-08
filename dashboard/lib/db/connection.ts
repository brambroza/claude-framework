import sql from 'mssql'

const config: sql.config = {
  server: process.env.MSSQL_HOST || 'localhost',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  database: process.env.MSSQL_DATABASE || 'claude_framework',
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || '',
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 15000,
  requestTimeout: 30000,
}

// Singleton pool — Next.js hot reload safe
declare global {
  var _mssqlPool: sql.ConnectionPool | undefined
}

export async function getPool(): Promise<sql.ConnectionPool> {
  if (global._mssqlPool && global._mssqlPool.connected) {
    return global._mssqlPool
  }
  try {
    const pool = new sql.ConnectionPool(config)
    await pool.connect()
    global._mssqlPool = pool
    console.log('✅ MSSQL connected:', config.server, config.database)
    return pool
  } catch (err) {
    console.error('❌ MSSQL connection failed:', err)
    throw err
  }
}

export async function query<T = any>(
  queryStr: string,
  params?: Record<string, any>
): Promise<T[]> {
  const pool = await getPool()
  const request = pool.request()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }
  const result = await request.query(queryStr)
  return result.recordset as T[]
}

export async function queryOne<T = any>(
  queryStr: string,
  params?: Record<string, any>
): Promise<T | null> {
  const rows = await query<T>(queryStr, params)
  return rows[0] ?? null
}

export async function execute(
  queryStr: string,
  params?: Record<string, any>
): Promise<sql.IResult<any>> {
  const pool = await getPool()
  const request = pool.request()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }
  return request.query(queryStr)
}

export { sql }
