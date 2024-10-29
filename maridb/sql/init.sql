CREATE DATABASE IF NOT EXISTS docker_management;
USE docker_management;

CREATE TABLE IF NOT EXISTS containers (
    id VARCHAR(255) PRIMARY KEY,
    ip VARCHAR(255),
    port INT,
    password VARCHAR(255),
    status VARCHAR(50)
);
