export const SPARE_PARTS_CATEGORIES = [
    {
        name: 'Sıvı & Motor Yağları',
        brands: [
            { name: 'Motul', desc: '8100 X-Clean / 300V / Specific' },
            { name: 'Castrol', desc: 'Edge / Magnatec / GTX' },
            { name: 'Mobil 1', desc: 'ESP / FS / Super 3000' },
            { name: 'Liqui Moly', desc: 'Top Tec / Molygen / Ceratec' },
            { name: 'Shell', desc: 'Helix Ultra / HX8 / PurePlus' },
            { name: 'TotalEnergies', desc: 'Quartz Ineo / 9000' },
            { name: 'Petronas', desc: 'Syntium CoolTech' },
            { name: 'Elf', desc: 'Evolution Full-Tech / 900' },
            { name: 'Valvoline', desc: 'SynPower / All-Climate' },
            { name: 'Opet', desc: 'Fullmax / Fulltech' },
            { name: 'Petrol Ofisi', desc: 'Maxima / Maxigear' }
        ]
    },
    {
        name: 'Filtre Grubu (Yağ, Hava, Polen, Yakıt)',
        brands: [
            { name: 'Mann Filter', desc: 'Alman Orijinal Kalite' },
            { name: 'Mahle / Knecht', desc: 'OEM Üretici Standartı' },
            { name: 'Bosch', desc: 'Alman Kalitesi' },
            { name: 'Hengst', desc: 'Premium Filtrasyon' },
            { name: 'Purflux', desc: 'Fransız & OEM Üretici' },
            { name: 'Filtron', desc: 'Mann Hummel Grubu' },
            { name: 'UFI Filters', desc: 'İtalyan & OEM' },
            { name: 'Blueprint', desc: 'Japon / Kore Uzmanı' },
            { name: 'Sardes', desc: 'Yerli Kalite' }
        ]
    },
    {
        name: 'Fren Sistemi (Balata, Disk, Kaliper, Hidrolik)',
        brands: [
            { name: 'Brembo', desc: 'Yüksek Performans & OEM' },
            { name: 'Ferodo', desc: 'Premier & Eco-Friction' },
            { name: 'TRW', desc: 'ZF Grubu / Orijinal Ekipman' },
            { name: 'Textar', desc: 'TMD Friction / Premium' },
            { name: 'ATE', desc: 'Continental Grubu / Seramik' },
            { name: 'Bosch Fren', desc: 'Standart & QuietCast' },
            { name: 'Valeo', desc: 'OEM Fren Sistemleri' },
            { name: 'Delphi', desc: 'Hassas İşlenmiş Disk & Balata' },
            { name: 'Pagid', desc: 'Alman OEM Tedarikçisi' },
            { name: 'Bendix', desc: 'Fren Teknolojileri' }
        ]
    },
    {
        name: 'Triger & V Kayışı & Gergi Rulmanları',
        brands: [
            { name: 'Gates', desc: 'PowerGrip Triger Setleri' },
            { name: 'Continental (ContiTech)', desc: 'Kayış & Gergi Kiti' },
            { name: 'SKF', desc: 'Rulman & Devridaimli Triger Seti' },
            { name: 'INA / Schaeffler', desc: 'Alman Motor & Gergi Uzmanı' },
            { name: 'Dayco', desc: 'OEM Triger & V Kayışları' },
            { name: 'SNR / NTN', desc: 'Fransız/Japon Rulman Devi' }
        ]
    },
    {
        name: 'Ön Takım & Süspansiyon & Amortisör',
        brands: [
            { name: 'Lemförder', desc: 'ZF Grubu / Üst Düzey Orijinal' },
            { name: 'Sachs', desc: 'Amortisör & Helezon Yay' },
            { name: 'Bilstein', desc: 'B4 / B6 Spor Amortisör' },
            { name: 'Monroe', desc: 'OESpectrum Amortisör' },
            { name: 'Febi Bilstein', desc: 'Alman Rotil, Salıncak, Z Rot' },
            { name: 'Meyle / Meyle-HD', desc: 'Güçlendirilmiş Ön Takım' },
            { name: 'TRW Süspansiyon', desc: 'Direksiyon & Salıncak' },
            { name: 'KYB (Kayaba)', desc: 'Japon Amortisör Lideri' },
            { name: 'Moog', desc: 'Federal-Mogul Süspansiyon' },
            { name: 'AYD / Teknorot', desc: 'Güçlü Yerli Üretici' }
        ]
    },
    {
        name: 'Debriyaj & Şanzıman & Aktarma',
        brands: [
            { name: 'LuK', desc: 'Schaeffler / Çift Kütleli Volan & Baskı Balata' },
            { name: 'Sachs Debriyaj', desc: 'Alman Orijinal Kavrama' },
            { name: 'Valeo Debriyaj', desc: 'Fransız & Dünya OEM Lideri' },
            { name: 'AISIN', desc: 'Japon / Toyota Orijinal Kavrama' },
            { name: 'Exedy', desc: 'Japon Spor & Standart Debriyaj' }
        ]
    },
    {
        name: 'Ateşleme & Elektronik (Buji, Bobin, Sensör)',
        brands: [
            { name: 'NGK / NTK', desc: 'İridyum / Lazer Buji & O2 Sensörü' },
            { name: 'Bosch Ateşleme', desc: 'Platin / Çift İridyum Buji & Bobin' },
            { name: 'Denso', desc: 'Japon OEM İridyum Buji' },
            { name: 'Champion', desc: 'Buji & Ateşleme Elemanları' },
            { name: 'Beru / BorgWarner', desc: 'Kızdırma Bujisi & Bobin' },
            { name: 'Delphi Elektronik', desc: 'Enjektör, Beyin & Sensör' }
        ]
    },
    {
        name: 'Akü & Elektrik Gücü',
        brands: [
            { name: 'Varta', desc: 'Alman / Silver Dynamic AGM & EFB' },
            { name: 'Mutlu Akü', desc: 'SFB / AGM / EFB Start-Stop' },
            { name: 'İnci Akü', desc: 'Maximax / FormulA / EFB' },
            { name: 'Bosch Akü', desc: 'S4 / S5 AGM Teknolojisi' },
            { name: 'Exide', desc: 'Premium Start-Stop Aküleri' },
            { name: 'Yiğit Akü', desc: 'Prestige / Start-Stop' }
        ]
    },
    {
        name: 'Soğutma, Radyatör & Termostat',
        brands: [
            { name: 'Behr / Mahle', desc: 'OEM Termostat & Radyatör' },
            { name: 'Valeo Soğutma', desc: 'Klima Kompresörü & Radyatör' },
            { name: 'Nissens', desc: 'Danimarka Radyatör & İntercooler' },
            { name: 'NRF', desc: 'Hollanda Soğutma Elemanları' },
            { name: 'Wahler / BorgWarner', desc: 'OEM Termostat & EGR Valfi' }
        ]
    },
    {
        name: 'Orijinal Yetkili Servis (OEM)',
        brands: [
            { name: 'Mais / Renault Orijinal', desc: 'Renault / Dacia OEM' },
            { name: 'Opar / Fiat Orijinal', desc: 'Fiat / Tofaş / Alfa Romeo OEM' },
            { name: 'Motorcraft', desc: 'Ford Orijinal Ekipman' },
            { name: 'VAG Orijinal', desc: 'Volkswagen / Audi / Seat / Skoda OEM' },
            { name: 'PSA / Stellantis Orijinal', desc: 'Peugeot / Citroen / Opel / DS OEM' },
            { name: 'BMW Group Orijinal', desc: 'BMW / Mini OEM' },
            { name: 'Mercedes-Benz Orijinal', desc: 'Yıldızlı Orijinal Parça' },
            { name: 'Toyota Orijinal', desc: 'Toyota Genuine Parts' }
        ]
    }
];
