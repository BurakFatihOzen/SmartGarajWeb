<?php
try {
    // Ortam Tespiti: Localhost / Laragon mu yoksa Canlı Sunucu (InfinityFree) mu?
    $is_localhost = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']) || 
                    (isset($_SERVER['HTTP_HOST']) && (
                        strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
                        strpos($_SERVER['HTTP_HOST'], '.test') !== false ||
                        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false
                    ));

    if ($is_localhost) {
        // Yerel PostgreSQL 18 Ayarları
        $host = "localhost";
        $port = "5432";
        $veritaban_adi = "smartgaraj";
        $kullanici_adi = "postgres";
        $sifre = "1234";
        
        $db = new PDO("pgsql:host=$host;port=$port;dbname=$veritaban_adi", $kullanici_adi, $sifre);
    } else {
        // Canlı Sunucu (InfinityFree) Ayarları
        $host = "sql313.byetcluster.com";
        $veritaban_adi = "if0_41799298_smartgaraj";
        $kullanici_adi = "if0_41799298";
        $sifre = "dE7WZhRspi";
        
        $db = new PDO("mysql:host=$host;dbname=$veritaban_adi;charset=utf8mb4", $kullanici_adi, $sifre);
    }

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    die("Veritabanı Bağlantı Hatası: " . $e->getMessage());
}
?>
