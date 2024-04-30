
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE || 'test',
      user: process.env.DB_USER,
      port: process.env.POSTGRES_PORT || 5432,
      host: process.env.POSTGRES_HOST || 'localhost'
    },
  }
}