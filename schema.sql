DROP TABLE IF EXISTS comments CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY ,
	game VARCHAR(30),
	score INTEGER,
    email VARCHAR(50) ,  
    username VARCHAR(50), 
    password_hash VARCHAR(100)
    );

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	comment VARCHAR(400),
	post VARCHAR(50),
	date VARCHAR(20),
	CONSTRAINT no_login 
		FOREIGN KEY(user_id)
		REFERENCES users(id)
	);