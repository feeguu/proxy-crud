import { QueryResult } from "pg"
import { PostgresDatabase } from "../config/database/PostgresDatabase"
import { Admin } from "../models/Admin"
import { Repository } from "./Repository"

export class PostgresAdminRepository extends Repository<Admin> {
	constructor(private database: PostgresDatabase) {
		super()
	}

	async findOne(id: string): Promise<Admin | null> {
		const res = (await this.database
			.getClient()
			.query(`SELECT * FROM admins WHERE id = ${id}`)) as QueryResult<any>
		if (res.rowCount === 0) {
			return null
		}
		const admin = res.rows[0]
		return new Admin(admin.id, admin.email, admin.password)
	}

	async find(): Promise<Admin[]> {
		const admins: Admin[] = []

		const res = (await this.database.getClient().query("SELECT * FROM admins")) as QueryResult<Admin>
		for (const admin of res.rows) {
			admins.push(new Admin(admin.id, admin.email, admin.password))
		}

		return admins
	}

	async save(entity: Admin) {
		const query = `INSERT INTO admins (email, password) VALUES ('${entity.email}', '${entity.password}') RETURNING *`
		const res = await this.database.getClient().query(query)
		const admin = res.rows[0]
		return new Admin(admin.id, admin.email, admin.password)
	}

	async update(id: string, entity: Admin): Promise<void> {
		const query = `UPDATE admins SET email = '${entity.email}', password = '${entity.password}' WHERE id = ${id}`
		await this.database.getClient().query(query)
	}

	async delete(id: string): Promise<void> {
		await this.database.getClient().query(`DELETE FROM admins WHERE id = ${id}`)
	}

	async findByColumn(column: string, value: string): Promise<Admin | null> {
		const res = (await this.database
			.getClient()
			.query(`SELECT * FROM admins WHERE ${column} = '${value}'`)) as QueryResult<any>
		if (res.rowCount === 0) {
			return null
		}
		const admin = res.rows[0]
		return new Admin(admin.id, admin.email, admin.password)
	}
}
