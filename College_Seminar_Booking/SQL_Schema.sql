use edi_database;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY ,
    FullName VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    PRN INT UNIQUE NOT NULL,
    Branch VARCHAR(100) NOT NULL,
    Password VARCHAR(500) NOT NULL
);

CREATE TABLE MasterTable(
	Request_id VARCHAR(10) PRIMARY KEY,
    user_id INT NOT NULL,
    Club_Name VARCHAR(100) NOT NULL,
    Club_No  VARCHAR(100) NOT NULL,
    Postion VARCHAR(50) NOT NULL,
    EventTitle VARCHAR(200) NOT NULL,
    EventType VARCHAR(50) NOT NULL,
    EventDate DATE NOT NULL,
    StartTime time NOT NULL,
    EndTime time NOT NULL,
    Subject VARCHAR(200) NOT NULL,
    Description VARCHAR(1000) NOT NULL,
    Status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE Guest_data(
	id INT AUTO_INCREMENT PRIMARY KEY,
	Request_id VARCHAR(10) NOT NULL,
    GuestName VARCHAR(100),
    GuestDesignation VARCHAR(200),
    GuestContact VARCHAR(1000),
    Buget_income INT NOT NULL, 
    Buget_Expenditure INT NOT NULL,
    SourceFund VARCHAR(100),
	FOREIGN KEY (Request_id) REFERENCES MasterTable(Request_id) ON DELETE CASCADE
);

CREATE TABLE AdminUser(
	id INT AUTO_INCREMENT PRIMARY KEY,
	FullName VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(500) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

use railway;
DELIMITER $$

CREATE TRIGGER before_request_insert
BEFORE INSERT ON MasterTable
FOR EACH ROW
BEGIN
    DECLARE next_id INT;
    DECLARE year_prefix CHAR(2);

    -- Get last 2 digits of the current year (e.g., '25' for 2025)
    SET year_prefix = DATE_FORMAT(NOW(), '%y');

    -- Find the max number for this year's requests
    SELECT IFNULL(MAX(CAST(SUBSTRING(Request_id, 3) AS UNSIGNED)), 0) + 1
    INTO next_id
    FROM MasterTable
    WHERE SUBSTRING(Request_id, 1, 2) = year_prefix;

    -- Build new Request ID: YY + 4-digit padded number
    SET NEW.Request_id = CONCAT(year_prefix, LPAD(next_id, 4, '0'));
END$$

DELIMITER ;

SELECT * FROM users;
SELECT * FROM MasterTable;
SELECT * FROM Guest_data;
SELECT * FROM AdminUser;