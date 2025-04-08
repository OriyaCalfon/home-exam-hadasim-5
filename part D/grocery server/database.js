require('dotenv').config(); 
const sql = require('msnodesqlv8');

const connectionString = `server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=yes;Driver=${process.env.DB_DRIVER};`;

const connectToDatabase = async () => {
  return new Promise((resolve, reject) => {
    sql.open(connectionString, (err, connection) => {
      if (err) {
        console.error('Database connection failed:', err);
        reject(err); 
      } else {
        console.log('Connected to SQL Server');
        resolve(connection); 
      }
    });
  });
};

module.exports = { sql, connectToDatabase };