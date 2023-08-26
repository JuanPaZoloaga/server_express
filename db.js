import { createPool } from 'mysql2/promise';
const db = createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: 3306,
    database: 'proyectofinal'
});
export default db;
 
// module.exports = db; // commonjs
 // module
