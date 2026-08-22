/**
 * Smart Automotive AI Maintenance Description Generator
 * Generates rich, technical and professional automotive maintenance log narratives.
 */
export function generateSmartMaintenanceDescription({
    vehicle = null,
    operationType = '',
    operationsList = [],
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
    const allOps = operationsList.length > 0 ? operationsList : (operationType ? [operationType] : ['Periyodik Bakım & Kontrol']);
    const opClean = allOps.join(' + ');

    const opLower = opClean.toLowerCase();
    const hasOil = opLower.includes('yağ') || opLower.includes('periyodik') || opLower.includes('filtre') || (oilInfo.brand && oilInfo.viscosity);
    const hasBrake = opLower.includes('fren') || opLower.includes('balata') || opLower.includes('disk') || opLower.includes('hidroli');
    const hasEngine = opLower.includes('triger') || opLower.includes('devirdaim') || opLower.includes('debriyaj') || opLower.includes('buji') || opLower.includes('kayış');
    const hasSuspension = opLower.includes('amortisör') || opLower.includes('salıncak') || opLower.includes('rot') || opLower.includes('lastik') || opLower.includes('balans');
    const hasClimate = opLower.includes('klima') || opLower.includes('gaz') || opLower.includes('polen');
    const hasBodywork = opLower.includes('kaporta') || opLower.includes('boya') || opLower.includes('göçük') || opLower.includes('rötüş') || bodyworkParts.length > 0;

    sentences.push(`${carName} ${kmText} servis periyodunda "${opClean}" işlemleri için servise alınmıştır.`);

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

    // 5. Sistem Özel Testleri
    let systemNotes = [];
    if (hasBrake) {
        systemNotes.push('fren balata ve disk kalınlıkları ölçülerek fren hidrolik basıncı test edilmiş');
    }
    if (hasEngine) {
        systemNotes.push('triger/kayış gergi torkları ve motor sızdırmazlıkları denetlenmiş');
    }
    if (hasSuspension) {
        systemNotes.push('alt takım burçları, rot başları ve süspansiyon geometrisi kontrol edilmiş');
    }
    if (hasClimate) {
        systemNotes.push('klima gaz basıncı ve evaporatör performansı ölçülmüş');
    }

    if (systemNotes.length > 0) {
        sentences.push(`İşlem sırasında ${systemNotes.join(', ')}tir.`);
    }

    // 6. Kullanıcının Orijinal Notu
    if (userNotes && userNotes.trim()) {
        const cleanUserNote = userNotes.trim();
        if (!sentences.some(s => s.toLowerCase().includes(cleanUserNote.toLowerCase()))) {
            sentences.push(`Özel Not: ${cleanUserNote}`);
        }
    }

    // 7. Servis & Usta Kapanış Cümlesi
    let serviceCredit = '';
    if (serviceInfo.serviceName || serviceInfo.mechanicName) {
        const sName = serviceInfo.serviceName || 'Özel Servis';
        const mName = serviceInfo.mechanicName ? ` (${serviceInfo.mechanicName})` : '';
        serviceCredit = `İşlemler ${sName}${mName} bünyesinde gerçekleştirilmiştir. `;
    }

    sentences.push(`${serviceCredit}Yapılan yol testi ve OBD-II arıza teşhis taraması sonrasında araç sorunsuz ve kusursuz durumda teslim edilmiştir.`);

    return sentences.join(' ');
}
