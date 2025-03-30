# database-visualizer

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
role ENUM('admin', 'user') DEFAULT 'user',
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE db_connections (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
db_type ENUM('mysql', 'mongodb') NOT NULL,
name VARCHAR(100), -- user-friendly display name
host TEXT, -- MySQL host or Mongo URI
port VARCHAR(10), -- MySQL only
user VARCHAR(100), -- MySQL only
password TEXT, -- MySQL only
database_name VARCHAR(100), -- Optional
is_active BOOLEAN DEFAULT FALSE, -- <== NEW FIELD
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE activity_logs (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
action VARCHAR(255),
metadata JSON,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE saved_views (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
connection_id INT NOT NULL,
db_name VARCHAR(100),
table_name VARCHAR(100),
view_name VARCHAR(100),
chart_type VARCHAR(50),
config JSON, -- contains chart config, filters, fields etc.
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (connection_id) REFERENCES db_connections(id) ON DELETE CASCADE
);
