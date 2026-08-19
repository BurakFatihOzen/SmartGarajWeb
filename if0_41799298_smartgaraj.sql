-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: sql313.infinityfree.com
-- Üretim Zamanı: 19 Ağu 2026, 17:30:09
-- Sunucu sürümü: 11.4.12-MariaDB
-- PHP Sürümü: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `if0_41799298_smartgaraj`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `araclar`
--

CREATE TABLE `araclar` (
  `id` int(11) NOT NULL,
  `plaka` varchar(20) DEFAULT NULL,
  `marka` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `motor` varchar(100) DEFAULT NULL,
  `yil` int(11) DEFAULT NULL,
  `guncel_km` int(11) DEFAULT NULL,
  `kullanici_id` int(11) DEFAULT NULL,
  `ruhsat_tipi` varchar(20) DEFAULT 'otomobil',
  `muayene_bitis` date DEFAULT NULL,
  `sigorta_bitis` date DEFAULT NULL,
  `kasko_bitis` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `araclar`
--

INSERT INTO `araclar` (`id`, `plaka`, `marka`, `model`, `motor`, `yil`, `guncel_km`, `kullanici_id`, `ruhsat_tipi`, `muayene_bitis`, `sigorta_bitis`, `kasko_bitis`) VALUES
(15, '06 CEV 425', 'Fiat', 'Albea (2002-2012)', '1.3 JTD', 2020, 45466, 2, 'otomobil', NULL, NULL, NULL),
(21, '06 1872 18281', 'Jaguar', 'F-Pace', '3.0 D', 2018, 1, 5, 'otomobil', NULL, NULL, NULL),
(22, 'Selam gencler', 'Alfa Romeo', 'Tonale', '1.6 JTDm', 1, -5, 5, 'otomobil', NULL, NULL, NULL),
(29, '06 BU 857', 'Ford', 'Escort (1995-2000)', '1.6 Zetec CLX', 1997, 282000, 1, 'otomobil', '2027-09-22', '2026-06-17', '2026-11-17'),
(33, '06 efe 12', 'BMW', '5 Serisi (E60/F10)', '530d', 2019, 110000, 17, 'otomobil', '2027-12-23', '2026-12-24', '2028-12-24'),
(34, '06 efe 18', 'Toyota', 'Land Cruiser Prado', '', 2025, 10000, 17, 'otomobil', '2026-12-23', '2027-06-12', '2027-12-23'),
(36, '06 BRK 06', 'Alfa Romeo', '159', '2.4 JTDm', 2018, 125000, 19, 'otomobil', '2026-05-03', '2026-05-03', NULL),
(38, '06 MR 26', 'Aston Martin', 'Vantage', '4.0 V8', 2009, 120000, 20, 'otomobil', '2030-02-20', '2027-03-30', '2027-04-23'),
(39, '44 BBF 444', 'Bentley', 'Bentayga', '4.0 V8 Petrol', 2016, 14500, 1, 'otomobil', '2026-05-31', '2026-06-30', NULL),
(40, '65 BR 6546', 'Dacia', 'Jogger', '1.0 TCe ECO-G', 2026, 55000, 1, 'otomobil', '2029-05-04', '2027-05-04', '2027-06-24'),
(42, '06 MC 2398', 'Toyota', 'Corolla (E140/150 2007-13)', '1.33 Dual VVT-i', 2013, 315000, 1, 'otomobil', '2027-09-24', '2026-12-29', NULL),
(44, '45 YU 1589', 'Toyota', 'Avensis', '2.0 D-4D', 2004, 300000, 16, 'otomobil', '2026-05-29', '2026-05-27', '2026-05-24'),
(45, '06 BRK 005', 'Mercedes-Benz', 'E-Serisi (W212/W213)', 'E 250', 2014, 180000, 1, 'otomobil', '2027-06-30', '2026-05-30', '2029-06-04'),
(46, '06 ASD 060', 'Alfa Romeo', 'Giulietta', '1.6 JTDm', 2018, 2000, 16, 'otomobil', '2027-10-04', '2028-06-16', '2026-12-25'),
(48, '06 HUR 06', 'BYD', 'Atto 3', '150 kW (204 PS) Elektrikli', 2025, 5000, 1, 'otomobil', '2026-05-28', '2026-05-30', NULL),
(50, '06 JTD 223', 'Chevrolet', 'Cruze', '2.0 VCDi', 2014, 124999, 1, 'otomobil', '2026-05-27', '2026-05-22', NULL),
(51, '81 EEE 555', 'Cupra', 'Formentor', '2.0 TSI (310hp)', 2021, 25000, 1, 'otomobil', '2026-05-20', '2026-05-28', '2026-05-29'),
(53, '06 BG 2360', 'Aston Martin', 'Vantage', '4.0 V8', 2020, 123000, 1, 'otomobil', '2026-05-26', '2026-06-06', '2026-05-19'),
(54, '34 AYD 223', 'Honda', 'Civic FB7 (2012-2016)', '1.6 i-VTEC Eco (LPG)', 2013, 65000, 1, 'otomobil', '2026-05-20', '2026-05-25', NULL),
(55, '58 SRT 223', 'Renault', 'Megane IV (2016-2022)', '1.5 Blue dCi', 2019, 165000, 1, 'otomobil', '2028-04-18', '2027-05-18', '2027-05-26'),
(56, 'calismiyor', 'Volvo', 'S40', '2.0 D', 1900, 122222, 6, 'otomobil', '2026-05-20', '2026-05-29', NULL),
(57, '06 HGS 99', 'Volvo', 'S40', '2.0 D', 1900, 122222, 6, 'otomobil', '2026-05-20', '2026-05-29', NULL),
(58, 'Bayram ENES Atay', 'Alfa Romeo', '159', '1.9 JTDm', 2019, 111, 6, 'konyali', '2026-06-01', '2026-05-29', '2026-05-29'),
(59, '06 HGS 99', 'Alfa Romeo', '159', '1.9 JTDm', 2099, 0, 6, 'otomobil', '2026-06-06', '2026-05-28', NULL),
(60, '06 HGS 99', 'Alfa Romeo', '159', '1.9 JTDm', 2099, -10000, 6, 'otomobil', '2026-06-06', '2026-05-28', NULL),
(61, '03 FUC 022', 'Mercedes-Benz', 'C-Serisi (W204/W205)', 'C 180', 2016, 92000, 22, 'otomobil', '2028-06-03', '2028-06-03', '2029-03-02');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bakimlar`
--

CREATE TABLE `bakimlar` (
  `id` int(11) NOT NULL,
  `arac_id` int(11) DEFAULT NULL,
  `islem_tarihi` date DEFAULT NULL,
  `islem_turu` varchar(100) DEFAULT NULL,
  `islem_km` int(11) DEFAULT NULL,
  `maliyet_tl` decimal(10,2) DEFAULT NULL,
  `aciklama` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `bakimlar`
--

INSERT INTO `bakimlar` (`id`, `arac_id`, `islem_tarihi`, `islem_turu`, `islem_km`, `maliyet_tl`, `aciklama`) VALUES
(11, 11, '2026-04-24', 'Periyodik Bakım', 55000, '17500.00', NULL),
(17, 21, '2026-05-01', 'Periyodik Bakım', 1, '-5.00', ''),
(18, 17, '2026-05-22', 'Alt Takım/Süspansiyon', 222222, '35550.00', ''),
(20, 36, '2026-05-03', 'Alt Takım/Süspansiyon', 164616, '164919.00', ''),
(21, 38, '2026-06-20', 'Periyodik Bakım', 120000, '10000.00', ''),
(22, 39, '2026-06-24', 'Ağır Bakım', 14500, '2600.00', ''),
(23, 30, '2026-05-14', 'Klima Gazı / Radyatör İşlemleri (Parça: Motorcraft (Ford OEM))', 54444, '45000.00', ''),
(24, 30, '2026-05-14', 'Baskı Balata (Debriyaj Seti) Değişimi (Parça: Motorcraft (Ford OEM))', 54444, '45000.00', ''),
(25, 30, '2026-05-08', 'Standart Periyodik Bakım (Yağ + Filtreler) (Parça: Liqui Moly)', 90000, '56500.00', ''),
(26, 42, '2026-04-22', 'Standart Periyodik Bakım (Yağ + Filtreler) (Parça: Liqui Moly)', 300000, '5500.00', ''),
(27, 42, '2026-05-30', 'Antifriz / Soğutma Sıvısı Yenileme (Parça: Shell)', 305000, '2500.00', ''),
(29, 44, '2026-05-01', 'Amortisör / Helezon Yay Değişimi (Parça: PSA Orijinal)', 50000, '50000.00', ''),
(30, 45, '2026-04-27', 'Ağır Bakım (Triger Seti / Zincir Değişimi) (Parça: LuK)', 175000, '85000.00', ''),
(31, 45, '2026-04-08', 'Antifriz / Soğutma Sıvısı Yenileme (Parça: Castrol)', 160000, '10000.00', ''),
(32, 50, '2026-04-29', 'Fren Balatası Değişimi (Ön/Arka) (Parça: Valeo)', 124000, '20000.00', ''),
(33, 50, '2026-04-30', 'Fren Diski Değişimi / Torna İşlemi (Parça: LuK)', 124000, '10000.00', ''),
(34, 50, '2026-04-27', 'Standart Periyodik Bakım (Yağ + Filtreler) (Parça: Liqui Moly)', 124000, '9500.00', ''),
(35, 50, '2026-04-29', 'Ağır Bakım (Triger Seti / Zincir Değişimi) (Parça: Valeo)', 124000, '85000.00', ''),
(36, 51, '2026-05-01', 'Turbo Revizyonu / Değişimi (Parça: INA)', 20000, '60000.00', ''),
(37, 54, '2026-04-30', 'Standart Periyodik Bakım (Yağ + Filtreler) (Parça: Mann Filter)', 62000, '5000.00', ''),
(38, 55, '2026-04-14', 'V Kayışı / Gergi Rulmanı Değişimi (Parça: SKF)', 155000, '55000.00', ''),
(39, 55, '2026-02-11', 'Standart Periyodik Bakım (Yağ + Filtreler) (Parça: Shell)', 162000, '5000.00', ''),
(40, 40, '2026-04-28', 'Standart Periyodik Bakım (Yağ + Filtreler) (Parça: Castrol)', 52000, '9500.00', '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kullanicilar`
--

CREATE TABLE `kullanicilar` (
  `id` int(11) NOT NULL,
  `ad_soyad` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `sifre` varchar(255) NOT NULL,
  `kayit_tarihi` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `kullanicilar`
--

INSERT INTO `kullanicilar` (`id`, `ad_soyad`, `email`, `sifre`, `kayit_tarihi`) VALUES
(1, 'Burak Fatih Özen', 'brkfatih2016@gmail.com', '$2y$10$yn31L1kR06SMgazG4L89A..1OOdDgFOPjw5.qaAVvURzd6nIFUV2a', '2026-04-26 15:07:26'),
(2, 'Selim Hür', 'beamcrashes4@gmail.com', '$2y$10$h0K/htO0Unvxbw2YGqORx.WORGLcNPdb5Uojnlt/xO8NF.PVJ7M4u', '2026-04-26 16:04:25'),
(3, 'Burak Fatih Atik', 'brkfatih@gmail.com', '$2y$10$LLCH/tTe/iGBUJyKdTa3qOYxWZ4eOH3ECYOlDokWnI7lKoyAqszTK', '2026-05-01 12:27:47'),
(4, 'milli etkisi olan', 'etkisiolmayan@gmail.com', '$2y$10$I4e8CX87bfWunQQUGPmT2.bbsVG9gTvU3zyGQn0D6bie6pRY22Vya', '2026-05-01 12:28:40'),
(5, 'Bayram Enes Atay ', 'bayrameness4242@gmail.com', '$2y$10$kxBHZnLEcveukESKsqjPROtXosqQ801sseoFcgrzLNgHIfeNNuaee', '2026-05-01 12:40:49'),
(6, 'Tester', 'hasta1@test.com', '$2y$10$Jkj9ugrhE7X9fXDqYzFnr.fuEWHEVDCvRyQjgaYMjXeE5eVW7ImAu', '2026-05-01 22:44:24'),
(7, '&lt;script&gt;alert(1)&lt;/script&gt;', 'hasta2@test.com', '$2y$10$GkqWjDwP6XdcrQZiEPL7tucS0yeQHPspTCCe8Kdgm7iTBrtEFc3Mi', '2026-05-01 22:48:50'),
(8, 'Senih Örs', 'burayagercekmailyaziyimmi@gmail.com', '$2y$10$BNJwNeiuQG4N6ZrR4rqOreh3pw71SVhFcPcANKYx7huTMvU2tznWK', '2026-05-01 22:52:45'),
(14, 'Gemini', 'bennur2992@gmail.com', '$2y$10$37DmKIASE6ZoZ1wcPTc4nesmmF0uFe4mRVGtobth3wEa/2SqS28F.', '2026-05-02 11:34:48'),
(15, '333', 'yepyeni_test2026@gmail.com', '$2y$10$IG6IVhgrg4eQe/fPPsY3SeiE1Q51qvjFpnZJDKgdAhCpyRG33BcQC', '2026-05-02 11:47:50'),
(16, 'hamdi', '23181616605@gazi.edu.tr', '$2y$10$uC1eyOikMDaN/aS5RQqzfu8qvT39Aq2dhO0PdNP.RyL5RYqry.P92', '2026-05-03 08:51:25'),
(17, 'sancar', 'sanjarakyyev05@gmail.com', '$2y$10$dwXotGqsgU3byu8ADANiNOJgbu.sVpZv5hVSAEAcTYW56DiW0.3ZS', '2026-05-03 09:38:00'),
(18, 'Gemini', 'mail@mail.com', '$2y$10$nZuh80FhdXljHaxmXwMzduzaTE1jELHhGSEgrNgG5LlHxKEEl9UnG', '2026-05-03 10:01:13'),
(19, 'Burak Enes Atay', 'brkenes@fuckme.com', '$2y$10$fg4CWemuTU0jzgvBvXclJOTxDADOsqFi/9ItizYbMAWB2Eqg/3wz2', '2026-05-03 12:31:02'),
(20, 'Isa', 'isayegeleyev@gmail.com', '$2y$10$7iQfTmIgkRgmm9u8SZ.3BOXFQL3/8TsZFy8VEpYZ8v/vLGe.eQQju', '2026-05-03 19:43:45'),
(21, 'Cristian Ronaldo', 'cristianronaldo@gmail.com', '$2y$10$v6hXw8U6N95X9WWudwRjC..trR4/9xUoMwq0pgRwCmXCmS33CK/.S', '2026-05-04 18:52:20'),
(22, 'Mehmet Gökmenoğlu', 'mali@manifest.com', '$2y$10$ySZzHOnBeO5p/MVE4AE0He27/FIOsl51IFmT6ik4A83kwFDmC.Vm6', '2026-06-06 21:01:08'),
(23, 'İsmail Hüseyin', 'abdurapekov@havelsan.com', '$2y$10$xAwsQ..QSaAS9AxQsOtly.2KnS79aYk9f4QsjN9HYuws8dhpDFnue', '2026-07-13 21:07:09');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `araclar`
--
ALTER TABLE `araclar`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `bakimlar`
--
ALTER TABLE `bakimlar`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `kullanicilar`
--
ALTER TABLE `kullanicilar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `araclar`
--
ALTER TABLE `araclar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- Tablo için AUTO_INCREMENT değeri `bakimlar`
--
ALTER TABLE `bakimlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Tablo için AUTO_INCREMENT değeri `kullanicilar`
--
ALTER TABLE `kullanicilar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
