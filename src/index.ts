import { config } from "dotenv"
config()

import express from "express"
import { DatabaseFactory, DatabaseType } from "./config/database/DatabaseFactory"
import { PostgresUserRepository } from "./repository/PostgresUserRepository"
import { UserController } from "./controllers/user-controller"
import bodyParser from "body-parser"
import { CepService, CepServiceProxy } from "./services/cep-service"
import { PostgresDatabase } from "./config/database/PostgresDatabase"
import { RedisDatabase } from "./config/database/RedisDatabase"
import { PostgresAdminRepository } from "./repository/PostgresAdminRepository"
import { AuthController } from "./controllers/auth-controller"
import { authMiddleware } from "./middlewares/auth"
import { TokenService } from "./services/token-service"

const app = express()

// CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if (req.method === "OPTIONS") {
		return res.sendStatus(200)
	}

	next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const database = DatabaseFactory.createDatabase(DatabaseType.POSTGRES)
const cacheDatabase = DatabaseFactory.createDatabase(DatabaseType.REDIS)

database.connect()
cacheDatabase.connect()

const cepService = new CepService()
const cepServiceProxy = new CepServiceProxy(cepService, cacheDatabase as RedisDatabase)

const tokenService = new TokenService(process.env.SECRET ?? "")

const userRepository = new PostgresUserRepository(database as PostgresDatabase)
const adminRepository = new PostgresAdminRepository(database as PostgresDatabase)

const userController = new UserController(userRepository, cepServiceProxy)
const authController = new AuthController(adminRepository, tokenService)

app.post("/auth/login", authController.login.bind(authController))
app.post("/auth/register", authController.register.bind(authController))

app.use("/users", authMiddleware)

app.get("/users", userController.find.bind(userController))
app.get("/users/:id", userController.findOne.bind(userController))
app.post("/users", userController.save.bind(userController))
app.patch("/users/:id", userController.update.bind(userController))
app.delete("/users/:id", userController.delete.bind(userController))

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})
