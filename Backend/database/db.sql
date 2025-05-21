CREATE DATABASE fitlog_app;
USE fitlog_app;

CREATE TABLE users (
    id INT(11) AUTO_INCREMENT NOT NULL,
    username VARCHAR(20) NOT NULL,
    email TEXT(320) NOT NULL,
    psw VARCHAR(255) NOT NULL,
    refreshToken VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);