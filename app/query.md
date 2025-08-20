-- Users Management Table
CREATE TABLE data_user (
id_user BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
email_user VARCHAR(100) NOT NULL UNIQUE,
kata_sandi VARCHAR(255) NOT NULL,
role_user TEXT CHECK (role_user IN ('admin', 'sales')) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO data_user (email_user, kata_sandi, role_user) VALUES
('admin@pln.co.id', '123', 'admin'),
('sales@pln.co.id', '123', 'sales');

-- Services Management Table
CREATE TABLE data_layanan (
id_layanan BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
nama_layanan VARCHAR(100) NOT NULL,
wilayah_hjt VARCHAR(50) NOT NULL,
satuan VARCHAR(50) NOT NULL,
backbone DECIMAL(15,2) NOT NULL DEFAULT 0.00,
port DECIMAL(15,2) NOT NULL DEFAULT 0.00,
tarif_akses DECIMAL(15,2) NOT NULL DEFAULT 0.00,
tarif DECIMAL(15,2) NOT NULL DEFAULT 0.00,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotations Management Tables
CREATE TABLE data_penawaran (
id_penawaran BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
id_user BIGINT NOT NULL,
tanggal_dibuat DATE NOT NULL,
nama_pelanggan VARCHAR(100) NOT NULL,
pekerjaan VARCHAR(100),
nomor_kontrak VARCHAR(50),
kontrak_tahun INT,
wilayah_hjt VARCHAR(50),
diskon DECIMAL(5,2),
durasi_kontrak INT,
target_irr DECIMAL(5,2),
diskon_thdp_backbone DECIMAL(5,2),
diskon_thdp_port DECIMAL(5,2),
status TEXT CHECK (status IN ('Menunggu', 'Disetujui', 'Ditolak')) DEFAULT 'Menunggu',
catatan TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_user) REFERENCES data_user(id_user) ON DELETE CASCADE
);

CREATE TABLE data_penawaran_layanan (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
id_penawaran BIGINT NOT NULL,
id_layanan BIGINT NOT NULL,
keterangan TEXT,
kapasitas VARCHAR(50),
qty INT,
akses_existing VARCHAR(100),
harga_final_sebelum_ppn DECIMAL(15,2),
satuan VARCHAR(50),
backbone DECIMAL(15,2),
port DECIMAL(15,2),
tarif_akses DECIMAL(15,2),
tarif DECIMAL(15,2),
tarif_akses_terbaru DECIMAL(15,2),
tarif_terbaru DECIMAL(15,2),
harga_dasar_icon DECIMAL(15,2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_penawaran) REFERENCES data_penawaran(id_penawaran) ON DELETE CASCADE,
FOREIGN KEY (id_layanan) REFERENCES data_layanan(id_layanan) ON DELETE CASCADE
);

CREATE TABLE data_pengeluaran (
id_pengeluaran BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
id_penawaran BIGINT NOT NULL,
item VARCHAR(100) NOT NULL,
keterangan TEXT,
harga_satuan DECIMAL(15,2) NOT NULL,
jumlah INT NOT NULL,
total_harga DECIMAL(15,2) GENERATED ALWAYS AS (harga_satuan \* jumlah) STORED,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_penawaran) REFERENCES data_penawaran(id_penawaran) ON DELETE CASCADE
);

CREATE TABLE hasil_penawaran (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
id_penawaran BIGINT NOT NULL UNIQUE,
total_per_bulan_harga_dasar_icon DECIMAL(15,2),
total_per_bulan_harga_final_sebelum_ppn DECIMAL(15,2),
grand_total_12_bulan_harga_dasar_icon DECIMAL(15,2),
grand_total_12_bulan_harga_final_sebelum_ppn DECIMAL(15,2),
discount DECIMAL(15,2),
total_pengeluaran_lain_lain DECIMAL(15,2),
grand_total_disc_lain2_harga_dasar_icon DECIMAL(15,2),
grand_total_disc_lain2_harga_final_sebelum_ppn DECIMAL(15,2),
profit_dari_hjt_excl_ppn DECIMAL(15,2),
margin_dari_hjt DECIMAL(15,2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_penawaran) REFERENCES data_penawaran(id_penawaran) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX idx_data_penawaran_id_user ON data_penawaran(id_user);
CREATE INDEX idx_data_penawaran_status ON data_penawaran(status);
CREATE INDEX idx_data_penawaran_tanggal_dibuat ON data_penawaran(tanggal_dibuat);
CREATE INDEX idx_data_penawaran_layanan_id_penawaran ON data_penawaran_layanan(id_penawaran);
CREATE INDEX idx_data_penawaran_layanan_id_layanan ON data_penawaran_layanan(id_layanan);
CREATE INDEX idx_data_pengeluaran_id_penawaran ON data_pengeluaran(id_penawaran);
CREATE INDEX idx_data_user_email_user ON data_user(email_user);
CREATE INDEX idx_data_layanan_wilayah_hjt ON data_layanan(wilayah_hjt);
CREATE INDEX idx_hasil_penawaran_id_penawaran ON hasil_penawaran(id_penawaran);

Note:

1. Admin Membuat User dan Layanan
   Tabel terlibat:
   data_user

data_layanan

Proses:
Admin login sebagai role_user = 'admin'.
Admin membuat akun Sales → data masuk ke data_user.
Admin menambahkan layanan → data masuk ke data_layanan.
Setelah itu, Sales tinggal pilih layanan yang sudah dibuat Admin saat membuat penawaran. 2. Sales Membuat Penawaran
Tabel terlibat:
data_penawaran

data_penawaran_layanan

Proses:
Sales login sebagai role_user = 'sales'.
Sales isi form penawaran → masuk ke data_penawaran
Sales pilih layanan yang tersedia dari data_layanan untuk dimasukkan ke penawaran. Setiap layanan yang dipilih Sales akan disimpan di data_penawaran_layanan
Karena satu penawaran bisa punya banyak layanan, hubungan data_penawaran → data_penawaran_layanan adalah one-to-many.

3. Sales Menambahkan Pengeluaran Lain-Lain
   Tabel terlibat:
   data_pengeluaran

Proses:
Sales memasukkan biaya tambahan di luar harga layanan
Data tersebut masuk ke data_pengeluaran dengan id_penawaran yang sesuai.
Karena satu penawaran bisa punya banyak pengeluaran, hubungan data_penawaran → data_pengeluaran adalah one-to-many.

4. Sistem Menghitung Hasil Penawaran
   Tabel terlibat:
   hasil_penawaran

Proses:
Controller di backend mengambil data:

Semua layanan (data_penawaran_layanan) untuk penawaran tersebut.
Semua pengeluaran (data_pengeluaran) untuk penawaran tersebut.

Backend menghitung
Masuk hasil_penawaran
