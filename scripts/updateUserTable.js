// const mysql = require('mysql2/promise');
// const dbConfig = require('../dbConfig'); // Adjust the path to your dbConfig file

// async function updateUserTable() {
   // let connection;
   // try {
      // connection = await mysql.createConnection(dbConfig);

     // const query = `
       //  ALTER TABLE users
       //  ADD COLUMN resetAttempts INT DEFAULT 0,
       //  ADD COLUMN lastAttempt DATETIME;
      // `;

      //  await connection.execute(query);
      //   console.log('Users table updated successfully!');
   // } catch (error) {
  //      console.error('Error updating users table:', error);
  //  } finally {
// if (connection) {
//          await connection.end();
//       }
//  }
// }

 // updateUserTable();