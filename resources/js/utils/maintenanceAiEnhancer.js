/**
 * Smart Automotive AI Maintenance Description Generator
 * Generates rich, technical and professional automotive maintenance log narratives.
 */
export function generateSmartMaintenanceDescription({
    vehicle = null,
    operationType = '',
    km = '',
    parts = [],
    bodyworkParts = [],
    oilInfo = {},
    serviceInfo = {},
    userNotes = '',
}) {
    const carName = vehicle ? `${vehicle.marka} ${vehicle.model}` : 'Araç';
    const kmText = km ? `${Number(km).toLocaleString('tr-TR')} KM` : (vehicle?.guncel_km ? `${Number(vehicle.guncel_km).toLocaleString('tr-TR')} KM` : 'periyodik');
    
    let sentences = [];

    // 1. Giriş ve Operasyon Cümlesi
    const opClean = operationType || 'Periyodik Bakım & Kontrol';
    const hasOil = opClean.toLowerCase().includes('yağ') || opClean.toLowerCase().includes('periyodik') || (oilInfo.brand && oilInfo.viscosity);
    const hasBrake = opClean.toLowerCase().includes('fren') || opClean.toLowerCase().includes('balata') || opClean.toLowerCase().includes('disk');
    const hasEngine = opClean.toLowerCase().includes('triger') || opClean.toLowerCase().includes('devirdaim') || opClean.toLowerCase().includes('debriyaj') || opClean.toLowerCase().includes('buji');
    const hasBodywork = opClean.toLowerCase().includes('kaporta') || opClean.toLowerCase().includes('boya') || opClean.toLowerCase().includes('göçük') || bodyworkParts.length > 0;

    sentences.push(`${carName} ${kmText} servis periyodunda "${opClean}" işlemi için servise alınmıştır.`);

    // 2. Yağ & Sıvı Detayları
    if (hasOil && oilInfo.brand) {
        let oilSentence = `Motor yağı ${oilInfo.brand} ${oilInfo.model || ''} (${oilInfo.viscosity || '5W-30'})${oilInfo.liters ? ` - ${oilInfo.liters} Litre` : ''} tam sentetik yağ ile yenilenmiştir.`;
        if (oilInfo.filterChanged) {
            oilSentence += ' Yağ filtresi sıfır OEM parça ile değiştirilmiştir.';
        }
        sentences.push(oilSentence);
    }

    // 3. Değişen Parçalar ve Markalar
    if (parts && parts.length > 0) {
        const partsList = parts.join(', ');
        sentences.push(`Bakım esnasında kullanılan OEM yedek parçalar: ${partsList}.`);
    }

    // 4. Kaporta & Boya Onarımları
    if (bodyworkParts && bodyworkParts.length > 0) {
        const bodyDetails = bodyworkParts.map(bp => {
            let desc = `${bp.parca} (${bp.islem})`;
            if (bp.not) desc += ` - "${bp.not}"`;
            return desc;
        }).join('; ');
        sentences.push(`Kaporta ve gövde onarımı detayları: ${bodyDetails}.`);
    }

    // 5. Fren & Mekanik Özel Testler
    if (hasBrake) {
        sentences.push('Fren kaliperleri temizlenmiş, fren hidroliği seviyesi ve disk aşınma payları mikrometre ile ölçülerek optimum güvenlik seviyesi sağlanmıştır.');
    } else if (hasEngine) {
        sentences.push('Tüm mekanik bağlantılar tork değerlerine uygun sıkılmış, kayış gergi boşlukları ve sızdırmazlık testleri eksiksiz tamamlanmıştır.');
    }

    // 6. Kullanıcının Orijinal Notu
    if (userNotes && userNotes.trim()) {
        const cleanUserNote = userNotes.trim();
        if (!sentences.some(s => s.toLowerCase().includes(cleanUserNote.toLowerCase()))) {
            sentences.push(`Özel İşlem Notu: ${cleanUserNote}`);
        }
    }

    // 7. Servis & Usta Kapanış Cümlesi
    let serviceCredit = '';
    if (serviceInfo.serviceName || serviceInfo.mechanicName) {
        const sName = serviceInfo.serviceName || 'Özel Servis';
        const mName = serviceInfo.mechanicName ? ` (${serviceInfo.mechanicName})` : '';
        serviceCredit = `İşlemler ${sName}${mName} bünyesinde gerçekleştirilmiştir. `;
    }

    sentences.push(`${serviceCredit}Yapılan yol testi ve bilgisayarlı arıza teşhis kontrolü sonrası araç sorunsuz ve kusursuz şekilde teslim edilmiştir.`);

    return sentences.join(' ');
}
