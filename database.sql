DROP TABLE IF EXISTS comments CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	comment VARCHAR(400),
	post VARCHAR(50),
	CONSTRAINT no_login 
		FOREIGN KEY(user_id)
		REFERENCES users(id)
	);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY , 
    email VARCHAR(50) ,  
    username VARCHAR(50), 
    password_hash VARCHAR(100)
    );
