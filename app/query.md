# Database Schema for PLN Icon Plus Application

## 1. Create Database

```sql
CREATE DATABASE pln_icon_plus;
USE pln_icon_plus;
```

## 2. Users Management Table

```sql
-- Tabel untuk manajemen user (admin dan sales)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'sales') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert default admin and sales users
INSERT INTO users (email, password, role) VALUES
('admin@pln.co.id', '$2b$10$encrypted_password_hash', 'admin'),
('sales@pln.co.id', '$2b$10$encrypted_password_hash', 'sales');
```

## 3. Service Categories and Services Table

```sql
-- Tabel untuk kategori layanan
CREATE TABLE service_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert service categories
INSERT INTO service_categories (name, description) VALUES
('IP VPN', 'IP VPN Services with various bandwidth options'),
('Metronet', 'Metronet connectivity services'),
('Inet Corp', 'Internet Corporate services with IX&IIX options'),
('IP Transit', 'IP Transit services with various configurations'),
('i-WIN', 'Wireless internet services'),
('MSR', 'Managed Service Router solutions'),
('I-See', 'Video surveillance and monitoring services'),
('CCTV', 'Closed-circuit television services'),
('IBBC', 'Indonesia Broadband services'),
('Cloud', 'Cloud computing services'),
('Additional', 'Additional services and installations');

-- Tabel untuk daftar layanan lengkap
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(500) NOT NULL,
    hjt ENUM('Sumatra', 'Jawa Bali', 'Jabodetabek', 'Intim') NOT NULL,
    satuan ENUM('Mbps', 'Units') NOT NULL,
    backbone DECIMAL(15,2) DEFAULT 0.00,
    port DECIMAL(15,2) DEFAULT 0.00,
    tarif_akses DECIMAL(15,2) DEFAULT 0.00,
    tarif DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id)
);

-- Sample service insertions (abbreviated for brevity)
INSERT INTO services (category_id, name, hjt, satuan, backbone, port, tarif_akses, tarif) VALUES
(1, 'IP VPN (1 sd 10 Mbps)', 'Jawa Bali', 'Mbps', 1500000.00, 800000.00, 500000.00, 2000000.00),
(1, 'IP VPN (11 sd 50 Mbps)', 'Jawa Bali', 'Mbps', 3000000.00, 1500000.00, 750000.00, 4500000.00),
(2, 'Metronet (1 sd 10 Mbps)', 'Jabodetabek', 'Mbps', 1200000.00, 600000.00, 400000.00, 1800000.00),
(3, 'Inet Corp IX&IIX (1 sd 10 Mbps)', 'Sumatra', 'Mbps', 2000000.00, 1000000.00, 600000.00, 3000000.00);
```

## 4. Customers Table

```sql
-- Tabel untuk data pelanggan
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    company_type ENUM('BUMN', 'BUMD', 'Swasta', 'Pemerintah') DEFAULT 'Swasta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert sample customers
INSERT INTO customers (name, address, phone, email, contact_person) VALUES
('PT. ABC Teknologi', 'Jakarta Selatan', '021-12345678', 'contact@abc.co.id', 'Budi Santoso'),
('PT. XYZ Corporation', 'Bandung', '022-87654321', 'info@xyz.co.id', 'Sari Dewi'),
('CV. Digital Solutions', 'Surabaya', '031-11223344', 'admin@digital.co.id', 'Ahmad Rahman');
```

## 5. Quotations (Penawaran) Table

```sql
-- Tabel untuk data penawaran
CREATE TABLE quotations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sales_id INT NOT NULL,
    customer_id INT,
    customer_name VARCHAR(255), -- For cases where customer is not in customers table
    tanggal DATE NOT NULL,
    nomor_kontrak VARCHAR(255),
    kontrak_tahun_ke INT DEFAULT 1,
    referensi_hjt ENUM('sumatera', 'kalimantan', 'jawa-bali', 'intim'),
    discount ENUM('0', 'MB Niaga', 'GM SBU') DEFAULT '0',
    durasi_kontrak INT NOT NULL, -- in years
    target_irr VARCHAR(50),
    disc_backbone VARCHAR(20) DEFAULT '0,00%',
    disc_port VARCHAR(20) DEFAULT '0,00%',
    pilih_layanan VARCHAR(500),
    keterangan TEXT,
    kapasitas VARCHAR(100),
    qty VARCHAR(50),
    akses_existing ENUM('ya', 'tidak') DEFAULT 'tidak',
    harga_final_sebelum_ppn DECIMAL(15,2),
    harga_final_setelah_ppn DECIMAL(15,2),
    status ENUM('draft', 'submitted', 'approved', 'rejected', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

## 6. Expenditures (Pengeluaran) Table

```sql
-- Tabel untuk pengeluaran lain-lain
CREATE TABLE expenditures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sales_id INT NOT NULL,
    tanggal DATE NOT NULL,
    pelanggan VARCHAR(255),
    nomor_kontrak VARCHAR(255),
    kontrak_ke INT,
    referensi_hjt VARCHAR(100),
    discount VARCHAR(50),
    durasi_kontrak INT,
    target_irr VARCHAR(50),
    one_time_booking DECIMAL(15,2) DEFAULT 0.00,
    one_time_start DECIMAL(15,2) DEFAULT 0.00,
    item VARCHAR(255),
    keterangan TEXT,
    harga DECIMAL(15,2),
    jumlah DECIMAL(15,2),
    total_amount DECIMAL(15,2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_id) REFERENCES users(id)
);
```

## 7. Profit Reports (Laporan Laba) Table

```sql
-- Tabel untuk laporan laba
CREATE TABLE profit_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    period_month INT NOT NULL,
    period_year INT NOT NULL,
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    total_expenditure DECIMAL(15,2) DEFAULT 0.00,
    gross_profit DECIMAL(15,2) DEFAULT 0.00,
    net_profit DECIMAL(15,2) DEFAULT 0.00,
    profit_margin DECIMAL(5,2) DEFAULT 0.00,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY unique_period (period_month, period_year)
);
```

## 8. Audit Trail Table

```sql
-- Tabel untuk audit trail dan logging aktivitas
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW') NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 9. System Settings Table

```sql
-- Tabel untuk pengaturan sistem
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_system) VALUES
('app_name', 'PLN Icon Plus', 'string', 'Application name', TRUE),
('company_name', 'PT PLN Icon Plus', 'string', 'Company name', TRUE),
('tax_percentage', '11', 'number', 'PPN percentage', FALSE),
('default_currency', 'IDR', 'string', 'Default currency', FALSE);
```

## 10. User Sessions Table

```sql
-- Tabel untuk manajemen session user
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 11. Indexes for Performance

```sql
-- Create indexes for better performance
CREATE INDEX idx_quotations_sales_id ON quotations(sales_id);
CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_tanggal ON quotations(tanggal);
CREATE INDEX idx_quotations_status ON quotations(status);

CREATE INDEX idx_expenditures_sales_id ON expenditures(sales_id);
CREATE INDEX idx_expenditures_tanggal ON expenditures(tanggal);
CREATE INDEX idx_expenditures_status ON expenditures(status);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_hjt ON services(hjt);
CREATE INDEX idx_services_is_active ON services(is_active);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
```

## 12. Views for Common Queries

```sql
-- View untuk laporan penawaran dengan detail user dan customer
CREATE VIEW quotation_details AS
SELECT
    q.id,
    q.tanggal,
    u.email as sales_email,
    COALESCE(c.name, q.customer_name) as customer_name,
    q.nomor_kontrak,
    q.pilih_layanan,
    q.harga_final_sebelum_ppn,
    q.harga_final_setelah_ppn,
    q.status,
    q.created_at
FROM quotations q
LEFT JOIN users u ON q.sales_id = u.id
LEFT JOIN customers c ON q.customer_id = c.id;

-- View untuk dashboard summary
CREATE VIEW dashboard_summary AS
SELECT
    DATE_FORMAT(CURDATE(), '%Y-%m') as current_month,
    (SELECT COUNT(*) FROM quotations WHERE status = 'submitted' AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')) as pending_quotations,
    (SELECT COUNT(*) FROM quotations WHERE status = 'approved' AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')) as approved_quotations,
    (SELECT SUM(harga_final_setelah_ppn) FROM quotations WHERE status = 'approved' AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')) as monthly_revenue,
    (SELECT SUM(total_amount) FROM expenditures WHERE status = 'approved' AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')) as monthly_expenses;
```

## 13. Triggers for Audit Trail

```sql
-- Trigger untuk audit trail pada tabel quotations
DELIMITER //
CREATE TRIGGER quotations_audit_insert
    AFTER INSERT ON quotations
    FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, new_values)
    VALUES (NEW.sales_id, 'quotations', NEW.id, 'CREATE', JSON_OBJECT(
        'tanggal', NEW.tanggal,
        'customer_name', NEW.customer_name,
        'nomor_kontrak', NEW.nomor_kontrak,
        'status', NEW.status
    ));
END//

CREATE TRIGGER quotations_audit_update
    AFTER UPDATE ON quotations
    FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values, new_values)
    VALUES (NEW.sales_id, 'quotations', NEW.id, 'UPDATE',
        JSON_OBJECT(
            'tanggal', OLD.tanggal,
            'customer_name', OLD.customer_name,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'tanggal', NEW.tanggal,
            'customer_name', NEW.customer_name,
            'status', NEW.status
        )
    );
END//
DELIMITER ;
```

## 14. Sample Data Insertions

```sql
-- Insert sample quotations
INSERT INTO quotations (sales_id, customer_name, tanggal, nomor_kontrak, kontrak_tahun_ke, referensi_hjt, discount, durasi_kontrak, target_irr, pilih_layanan, keterangan, kapasitas, qty, akses_existing, harga_final_sebelum_ppn, harga_final_setelah_ppn, status) VALUES
(2, 'PT. Teknologi Maju', '2024-12-01', 'KTR/2024/001', 1, 'jawa-bali', '0', 3, '15%', 'IP VPN (1 sd 10 Mbps)', 'Koneksi untuk kantor pusat', '10 Mbps', '1', 'tidak', 2000000.00, 2220000.00, 'submitted'),
(2, 'CV. Digital Prima', '2024-12-02', 'KTR/2024/002', 1, 'sumatera', 'MB Niaga', 2, '12%', 'Metronet (11 sd 50 Mbps)', 'Upgrade bandwidth existing', '25 Mbps', '1', 'ya', 4500000.00, 4995000.00, 'approved');

-- Insert sample expenditures
INSERT INTO expenditures (sales_id, tanggal, pelanggan, nomor_kontrak, kontrak_ke, item, keterangan, harga, jumlah, total_amount) VALUES
(2, '2024-12-01', 'PT. Teknologi Maju', 'KTR/2024/001', 1, 'Instalasi Perangkat', 'Biaya instalasi router dan konfigurasi', 1500000.00, 1, 1500000.00),
(2, '2024-12-02', 'CV. Digital Prima', 'KTR/2024/002', 1, 'Maintenance Bulanan', 'Biaya maintenance rutin', 500000.00, 1, 500000.00);
```

## 15. Common Stored Procedures

```sql
-- Stored procedure untuk generate laporan laba bulanan
DELIMITER //
CREATE PROCEDURE GenerateMonthlyProfitReport(IN report_month INT, IN report_year INT)
BEGIN
    DECLARE total_rev DECIMAL(15,2) DEFAULT 0.00;
    DECLARE total_exp DECIMAL(15,2) DEFAULT 0.00;
    DECLARE gross_prof DECIMAL(15,2) DEFAULT 0.00;
    DECLARE net_prof DECIMAL(15,2) DEFAULT 0.00;
    DECLARE prof_margin DECIMAL(5,2) DEFAULT 0.00;

    -- Calculate total revenue
    SELECT COALESCE(SUM(harga_final_setelah_ppn), 0) INTO total_rev
    FROM quotations
    WHERE status = 'approved'
      AND MONTH(tanggal) = report_month
      AND YEAR(tanggal) = report_year;

    -- Calculate total expenditure
    SELECT COALESCE(SUM(total_amount), 0) INTO total_exp
    FROM expenditures
    WHERE status = 'approved'
      AND MONTH(tanggal) = report_month
      AND YEAR(tanggal) = report_year;

    -- Calculate profits
    SET gross_prof = total_rev - total_exp;
    SET net_prof = gross_prof * 0.9; -- Assuming 10% operational cost
    SET prof_margin = CASE WHEN total_rev > 0 THEN (net_prof / total_rev) * 100 ELSE 0 END;

    -- Insert or update profit report
    INSERT INTO profit_reports (period_month, period_year, total_revenue, total_expenditure, gross_profit, net_profit, profit_margin, created_by)
    VALUES (report_month, report_year, total_rev, total_exp, gross_prof, net_prof, prof_margin, 1)
    ON DUPLICATE KEY UPDATE
        total_revenue = total_rev,
        total_expenditure = total_exp,
        gross_profit = gross_prof,
        net_profit = net_prof,
        profit_margin = prof_margin,
        updated_at = CURRENT_TIMESTAMP;

END//
DELIMITER ;
```

## Notes:

1. Password hashes should use bcrypt or similar secure hashing algorithm
2. All monetary values are stored in Indonesian Rupiah (IDR)
3. The schema supports both admin and sales user roles with appropriate permissions
4. Audit trails are maintained for important data changes
5. Indexes are created for frequently queried columns
6. Views provide simplified access to complex joined data
7. Stored procedures help with complex business logic calculations
