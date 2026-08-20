-- ==============================================================================
-- SmartGaraj - Modern PostgreSQL 18 Production Schema
-- ==============================================================================

-- 1. Eklentiler (Gelişmiş UUID ve Kripto Desteği)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. KULLANICILAR TABLOSU (Users)
CREATE TABLE IF NOT EXISTS kullanicilar (
    id SERIAL PRIMARY KEY,
    ad_soyad VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    telefon VARCHAR(30) DEFAULT NULL,
    rol VARCHAR(30) DEFAULT 'kullanici' CHECK (rol IN ('kullanici', 'admin', 'filo_yoneticisi', 'sofor')),
    remember_token VARCHAR(100) DEFAULT NULL,
    kayit_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. ARAÇLAR TABLOSU (Vehicles)
CREATE TABLE IF NOT EXISTS araclar (
    id SERIAL PRIMARY KEY,
    kullanici_id INT NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
    plaka VARCHAR(30) NOT NULL,
    marka VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    motor VARCHAR(120) DEFAULT NULL,
    yil INT DEFAULT NULL CHECK (yil IS NULL OR (yil >= 1900 AND yil <= 2100)),
    guncel_km INT DEFAULT 0 CHECK (guncel_km >= 0),
    ruhsat_tipi VARCHAR(50) DEFAULT 'otomobil',
    muayene_bitis DATE DEFAULT NULL,
    sigorta_bitis DATE DEFAULT NULL,
    kasko_bitis DATE DEFAULT NULL,
    sasi_no VARCHAR(50) DEFAULT NULL,
    notlar TEXT DEFAULT NULL,
    kayit_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. BAKIMLAR TABLOSU (Maintenances)
CREATE TABLE IF NOT EXISTS bakimlar (
    id SERIAL PRIMARY KEY,
    arac_id INT NOT NULL REFERENCES araclar(id) ON DELETE CASCADE,
    islem_tarihi DATE NOT NULL,
    islem_turu VARCHAR(150) NOT NULL,
    islem_km INT DEFAULT 0 CHECK (islem_km >= 0),
    maliyet_tl NUMERIC(12,2) DEFAULT 0.00 CHECK (maliyet_tl >= 0),
    aciklama TEXT DEFAULT NULL,
    fatura_url VARCHAR(255) DEFAULT NULL,
    kayit_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. YAKIT VE TÜKETİM TAKİBİ (Fuel Logs - Yeni Özellik Altyapısı)
CREATE TABLE IF NOT EXISTS yakit_kayitlari (
    id SERIAL PRIMARY KEY,
    arac_id INT NOT NULL REFERENCES araclar(id) ON DELETE CASCADE,
    tarih DATE NOT NULL DEFAULT CURRENT_DATE,
    km INT NOT NULL CHECK (km >= 0),
    litre NUMERIC(8,2) NOT NULL CHECK (litre > 0),
    birim_fiyat NUMERIC(8,2) NOT NULL CHECK (birim_fiyat > 0),
    toplam_tutar NUMERIC(10,2) NOT NULL CHECK (toplam_tutar > 0),
    depo_doldu BOOLEAN DEFAULT TRUE,
    yakit_turu VARCHAR(50) DEFAULT 'Benzin',
    notlar TEXT DEFAULT NULL,
    kayit_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. OTOMATİK HATIRLATICILAR (Reminders - WhatsApp / SMS / Push Bildirim Altyapısı)
CREATE TABLE IF NOT EXISTS hatirlaticilar (
    id SERIAL PRIMARY KEY,
    arac_id INT NOT NULL REFERENCES araclar(id) ON DELETE CASCADE,
    tur VARCHAR(50) NOT NULL CHECK (tur IN ('muayene', 'sigorta', 'kasko', 'periyodik_bakim', 'lastik_degisimi', 'vergi', 'ozel')),
    baslik VARCHAR(150) NOT NULL,
    hedef_tarih DATE DEFAULT NULL,
    hedef_km INT DEFAULT NULL,
    bildirildi BOOLEAN DEFAULT FALSE,
    bildirim_tarihi TIMESTAMPTZ DEFAULT NULL,
    kayit_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. MOBİL & WEB REST API TOKENLARI (Personal Access Tokens for Mobile App & SPA)
CREATE TABLE IF NOT EXISTS api_tokens (
    id SERIAL PRIMARY KEY,
    kullanici_id INT NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    cihaz_adi VARCHAR(100) DEFAULT 'Mobil Uygulama',
    son_kullanim TIMESTAMPTZ DEFAULT NULL,
    olusturma_tarihi TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 8. PERFORMANS İNDEKSLERİ (High-Performance Indexes)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_kullanicilar_email ON kullanicilar(email);
CREATE INDEX IF NOT EXISTS idx_araclar_kullanici_id ON araclar(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_araclar_plaka ON araclar(plaka);
CREATE INDEX IF NOT EXISTS idx_bakimlar_arac_id ON bakimlar(arac_id);
CREATE INDEX IF NOT EXISTS idx_bakimlar_tarih ON bakimlar(islem_tarihi);
CREATE INDEX IF NOT EXISTS idx_yakit_arac_id ON yakit_kayitlari(arac_id);
CREATE INDEX IF NOT EXISTS idx_hatirlaticilar_arac_id ON hatirlaticilar(arac_id);
CREATE INDEX IF NOT EXISTS idx_hatirlaticilar_hedef_tarih ON hatirlaticilar(hedef_tarih);
CREATE INDEX IF NOT EXISTS idx_api_tokens_user ON api_tokens(kullanici_id);
