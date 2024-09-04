CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  age int NOT NULL,
  gender varchar(255) NOT NULL,
  cep varchar(255) NOT NULL
);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email varchar(255) NOT NULL,
  password TEXT NOT NULL
);
