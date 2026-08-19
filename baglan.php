<?php
try {
    // InfinityFree Güncel Veritabanı Bilgileri
    $host = "sql313.byetcluster.com"; // MySQL Host Name
    $veritaban_adi = "if0_41799298_smartgaraj"; // MySQL DB Name
    $kullanici_adi = "if0_41799298"; // MySQL User Name
    
    // Şifre kısmına InfinityFree panelindeki Account Details'den baktığın şifreyi yaz
    $sifre = "dE7WZhRspi"; 

    $db = new PDO("mysql:host=$host;dbname=$veritaban_adi;charset=utf8", $kullanici_adi, $sifre);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Bağlantı hatası: " . $e->getMessage();
}
?>