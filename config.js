const config = { 
    DB_CONNECT: process.env.DB_CONNECT || 'mongodb://localhost:27017/horror-time',
    JWT_SECRET: process.env.JWT_SECRET || 'temp_jwt_secret'
}

module.exports = config;