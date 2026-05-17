import mysql from "mysql2/promise";

declare global {
	// eslint-disable-next-line no-var
	var _mysqlPool: mysql.Pool | undefined;
}

function getPool(): mysql.Pool {
	if (!global._mysqlPool) {
		global._mysqlPool = mysql.createPool({
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT ?? 3306),
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 20,
			connectTimeout: 5000,
			decimalNumbers: true,
		});
	}
	return global._mysqlPool;
}

export default getPool;
