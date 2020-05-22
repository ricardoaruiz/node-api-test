const env = {
    name: process.env.ENV_NAME || 'local',
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        namespace: process.env.DB_NAME_SPACE || 'api-test',
        user: process.env.DB_USER,
        pwd: process.env.DB_PWD 
    }
};

export default env;