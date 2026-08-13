INSERT IGNORE INTO users
(first_name, last_name, email, password, role, enabled, created_at, updated_at)
VALUES
('Madan', 'Gouda', 'madan@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Rahul', 'Sharma', 'rahul@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ROLE_CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Priya', 'Singh', 'priya@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldLZdL17lhWy',
 'ROLE_CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Arjun', 'Kumar', 'arjun@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldLZdL17lhWy',
 'ROLE_CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Sneha', 'Patel', 'sneha@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldLZdL17lhWy',
 'ROLE_CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);