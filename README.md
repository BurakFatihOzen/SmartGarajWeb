# 🚗 SmartGaraj - Akıllı Araç ve Bakım Takip Sistemi

[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B%20%2F%208.x-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**SmartGaraj**, bireysel araç sahipleri ve filo/garaj yöneticileri için geliştirilmiş web tabanlı bir **araç yönetim, periyodik bakım ve yasal süreç (muayene, sigorta, kasko) takip** platformudur.

---

## 📌 Temel Özellikler

- 🚘 **Araç Yönetimi:** Plaka, marka, model, motor tipi, model yılı ve güncel kilometre kaydı.
- 🛠️ **Periyodik Bakım Kayıtları:** Yapılan işlemler, değişen parçalar, kilometre ve maliyet takibi.
- 📅 **Yasal Süreç & Hatırlatıcılar:**
  - Muayene bitiş tarihi takibi
  - Zorunlu Trafik Sigortası bitiş tarihi takibi
  - Kasko poliçe bitiş tarihi takibi
- 👤 **Kullanıcı Giriş & Oturum Sistemi:** Güvenli oturum açma (`login.php`) ve kullanıcıya özel araç listesi.
- 📊 **Özet Dashboard:** Araç durumlarını, yaklaşan bakımları ve son işlemleri tek ekrandan görüntüleme.

---

## 🛠️ Kullanılan Teknolojiler

- **Backend:** PHP
- **Veritabanı:** MySQL / MariaDB
- **Frontend:** HTML5, CSS3, JavaScript
- **Web Sunucusu:** Apache / Nginx (XAMPP / Laragon / Canlı Hosting)

---

## 📂 Dosya & Dizin Yapısı

```plaintext
SmartGarajWeb/
│
├── index.php                      # Ana kontrol paneli ve gösterge tablosu
├── login.php                      # Kullanıcı giriş ve kimlik doğrulama
├── araclar.php                    # Kayıtlı araçların listelendiği sayfa
├── arac_ekle.php                  # Yeni araç ekleme ve düzenleme formu
├── bakim_ekle.php                 # Bakım ve servis kaydı oluşturma
├── islem.php                      # Form gönderimleri ve arka plan veri işlemleri
├── baglan.php                     # Veritabanı PDO / MySQLi bağlantı yapılandırması
├── if0_41799298_smartgaraj.sql   # Veritabanı şema ve örnek veri dökümü
└── README.md                      # Proje dokümantasyonu
```

---

## 🚀 Kurulum ve Yerel Ortamda Çalıştırma

Projeyi yerel bilgisayarınızda (Localhost) çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler
- [XAMPP](https://www.apachefriends.org/), [Laragon](https://laragon.org/) veya PHP & MySQL barındıran yerel bir sunucu ortamı.

### 2. Projeyi Klonlayın veya İndirin
```bash
git clone https://github.com/BurakFatihOzen/SmartGarajWeb.git
```
Proje klasörünü yerel sunucu dizininize taşıyın (Örn: `C:\xampp\htdocs\SmartGarajWeb` veya `C:\laragon\www\SmartGarajWeb`).

### 3. Veritabanını İçe Aktarın
1. Tarayıcınızdan `http://localhost/phpmyadmin` adresine gidin.
2. `smartgaraj` adında yeni bir veritabanı oluşturun (Karakter seti: `utf8mb4_turkish_ci` veya `utf8mb4_general_ci`).
3. Proje klasöründeki `if0_41799298_smartgaraj.sql` dosyasını **İçe Aktar (Import)** sekmesinden yükleyin.

### 4. Veritabanı Bağlantısını Yapılandırın
`baglan.php` dosyasını açarak yerel veritabanı bilgilerinizi girin:

```php
<?php
$host = "localhost";
$dbname = "smartgaraj";
$username = "root";
$password = ""; // Yerel sunucunuzun şifresi (varsayılan genellikle boştur)

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Veritabanı bağlantı hatası: " . $e->getMessage());
}
?>
```

### 5. Projeyi Başlatın
Tarayıcınızdan aşağıdaki adrese gidin:
```
http://localhost/SmartGarajWeb
```

---

## 👨‍💻 Geliştirici

- **Burak Fatih Özen** - [GitHub Profili](https://github.com/BurakFatihOzen)

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
