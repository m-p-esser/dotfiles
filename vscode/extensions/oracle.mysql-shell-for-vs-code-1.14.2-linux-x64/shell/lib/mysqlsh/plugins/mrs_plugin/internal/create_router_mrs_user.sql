-- -----------------------------------------------------
-- Create MySQL user 'mysqlrouter_mrs'@'%'

CREATE USER 'mysqlrouter_mrs'@'%' IDENTIFIED BY 'MySQLR0cks!';
GRANT 'mysql_rest_service_meta_provider', 'mysql_rest_service_data_provider' 
    TO 'mysqlrouter_mrs'@'%';
SET DEFAULT ROLE 'mysql_rest_service_meta_provider', 'mysql_rest_service_data_provider' 
    TO 'mysqlrouter_mrs'@'%';
