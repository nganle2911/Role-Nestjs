DROP DATABASE IF EXISTS db_roles;
CREATE DATABASE db_roles;
USE db_roles;

CREATE TABLE users(
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(250),
	pass_word VARCHAR(100),
	full_name VARCHAR(250),
	gender BOOLEAN,
	user_role VARCHAR(250)
);