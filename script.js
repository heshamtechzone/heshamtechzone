document.addEventListener('DOMContentLoaded', function() {
    // عناصر شاشة الاشتراك
    const subscriptionModal = document.getElementById('subscription-modal');
    const subscribedCheckbox = document.getElementById('subscribed-checkbox');
    const accessBtn = document.getElementById('access-btn');
    const app = document.getElementById('app');

    // التحقق من الاشتراك في localStorage
    const isSubscribed = localStorage.getItem('subscribed') === 'true';

    if (isSubscribed) {
        subscriptionModal.classList.add('hidden');
        app.classList.remove('hidden');
        initLogoMaker();
    } else {
        subscriptionModal.classList.remove('hidden');
        app.classList.add('hidden');
    }

    // تفعيل زر الدخول عند اختيار المربع
    subscribedCheckbox.addEventListener('change', function() {
        accessBtn.disabled = !this.checked;
    });

    // زر الدخول إلى الأداة
    accessBtn.addEventListener('click', function() {
        localStorage.setItem('subscribed', 'true');
        subscriptionModal.classList.add('hidden');
        app.classList.remove('hidden');
        initLogoMaker();
    });

    // تهيئة أداة صانع الشعارات
    function initLogoMaker() {
        // عناصر واجهة المستخدم
        const textElement = document.getElementById('text-element');
        const imageElement = document.getElementById('image-element');
        const textInput = document.getElementById('text-input');
        const updateTextBtn = document.getElementById('update-text');
        const textColor = document.getElementById('text-color');
        const textSize = document.getElementById('text-size');
        const sizeValue = document.getElementById('size-value');
        const fontFamily = document.getElementById('font-family');
        const textShadow = document.getElementById('text-shadow');
        const imageUpload = document.getElementById('image-upload');
        const removeImageBtn = document.getElementById('remove-image');
        const imageSize = document.getElementById('image-size');
        const imageSizeValue = document.getElementById('image-size-value');
        const bgColor = document.getElementById('bg-color');
        const bgOpacity = document.getElementById('bg-opacity');
        const opacityValue = document.getElementById('opacity-value');
        const downloadBtn = document.getElementById('download-btn');
        const logoCanvas = document.getElementById('logo-canvas');

        // القيم الافتراضية
        let imageScale = 1;
        let activeElement = null;
        let isDragging = false;
        let offsetX, offsetY;

        // تحديث النص
        updateTextBtn.addEventListener('click', function() {
            textElement.textContent = textInput.value;
        });

        // تحديث لون النص
        textColor.addEventListener('input', function() {
            textElement.style.color = this.value;
        });

        // تحديث حجم النص
        textSize.addEventListener('input', function() {
            const size = this.value + 'px';
            textElement.style.fontSize = size;
            sizeValue.textContent = size;
        });

        // تحديث نوع الخط
        fontFamily.addEventListener('change', function() {
            const selectedFont = this.value;
            
            // إنشاء عنصر مخفي لتحميل الخط الجديد
            const fontLoader = document.createElement('div');
            fontLoader.style.fontFamily = selectedFont;
            fontLoader.style.position = 'absolute';
            fontLoader.style.visibility = 'hidden';
            fontLoader.textContent = 'جاري تحميل الخط';
            document.body.appendChild(fontLoader);
            
            // إجبار المتصفح على تحميل الخط الجديد
            setTimeout(() => {
                textElement.style.fontFamily = selectedFont;
                document.body.removeChild(fontLoader);
                
                // إعادة تحميل النص للتأكد من تطبيق الخط الجديد
                const currentText = textElement.textContent;
                textElement.textContent = '';
                setTimeout(() => {
                    textElement.textContent = currentText;
                }, 50);
            }, 100);
        });

        // إضافة/إزالة ظل النص
        textShadow.addEventListener('change', function() {
            if (this.checked) {
                textElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            } else {
                textElement.style.textShadow = 'none';
            }
        });

        // رفع الصورة
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imageElement.src = event.target.result;
                    imageElement.classList.remove('hidden');
                    removeImageBtn.classList.remove('hidden');
                    imageSize.disabled = false;
                    imageScale = 1;
                    imageSize.value = 100;
                    imageSizeValue.textContent = '100%';
                };
                reader.readAsDataURL(file);
            }
        });

        // إزالة الصورة
        removeImageBtn.addEventListener('click', function() {
            imageElement.src = '';
            imageElement.classList.add('hidden');
            this.classList.add('hidden');
            imageSize.disabled = true;
        });

        // تغيير حجم الصورة
        imageSize.addEventListener('input', function() {
            imageScale = this.value / 100;
            imageElement.style.transform = `scale(${imageScale})`;
            imageSizeValue.textContent = this.value + '%';
        });

        // تغيير لون الخلفية
        bgColor.addEventListener('input', function() {
            const opacity = bgOpacity.value / 100;
            logoCanvas.style.backgroundColor = `rgba(${hexToRgb(this.value)}, ${opacity})`;
        });

        // تغيير شفافية الخلفية
        bgOpacity.addEventListener('input', function() {
            const opacity = this.value / 100;
            const rgb = hexToRgb(bgColor.value);
            logoCanvas.style.backgroundColor = `rgba(${rgb}, ${opacity})`;
            opacityValue.textContent = this.value + '%';
        });

        // تحويل hex إلى rgb
        function hexToRgb(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
        }

        // تفعيل السحب والإفلات للعناصر
        function setupDrag(element) {
            element.addEventListener('mousedown', startDrag);
            element.addEventListener('touchstart', startDrag, { passive: false });

            function startDrag(e) {
                e.preventDefault();
                activeElement = element;
                isDragging = true;

                // حساب الموضع بالنسبة للعنصر
                const rect = element.getBoundingClientRect();
                if (e.type === 'mousedown') {
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                } else {
                    offsetX = e.touches[0].clientX - rect.left;
                    offsetY = e.touches[0].clientY - rect.top;
                }

                // إضافة أحداث الحركة والإفلات
                document.addEventListener('mousemove', dragElement);
                document.addEventListener('touchmove', dragElement, { passive: false });
                document.addEventListener('mouseup', stopDrag);
                document.addEventListener('touchend', stopDrag);
            }

            function dragElement(e) {
                if (!isDragging) return;
                e.preventDefault();

                const canvasRect = logoCanvas.getBoundingClientRect();
                let clientX, clientY;

                if (e.type === 'mousemove') {
                    clientX = e.clientX;
                    clientY = e.clientY;
                } else {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }

                // حساب الموضع الجديد مع مراعاة الحدود
                let newX = clientX - canvasRect.left - offsetX;
                let newY = clientY - canvasRect.top - offsetY;

                // الحدود الأفقية
                if (newX < 0) newX = 0;
                if (newX > canvasRect.width - activeElement.offsetWidth) {
                    newX = canvasRect.width - activeElement.offsetWidth;
                }

                // الحدود الرأسية
                if (newY < 0) newY = 0;
                if (newY > canvasRect.height - activeElement.offsetHeight) {
                    newY = canvasRect.height - activeElement.offsetHeight;
                }

                activeElement.style.left = newX + 'px';
                activeElement.style.top = newY + 'px';
            }

            function stopDrag() {
                isDragging = false;
                document.removeEventListener('mousemove', dragElement);
                document.removeEventListener('touchmove', dragElement);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
            }
        }

        // تفعيل السحب للنص والصورة
        setupDrag(textElement);
        setupDrag(imageElement);

        // تحميل الشعار كصورة
        downloadBtn.addEventListener('click', function() {
            // إنشاء عنصر canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const width = logoCanvas.offsetWidth;
            const height = logoCanvas.offsetHeight;

            // تعيين أبعاد canvas
            canvas.width = width;
            canvas.height = height;

            // تعيين خلفية canvas
            const bgColorValue = window.getComputedStyle(logoCanvas).backgroundColor;
            ctx.fillStyle = bgColorValue;
            ctx.fillRect(0, 0, width, height);

            // رسم النص على canvas
            const textStyle = window.getComputedStyle(textElement);
            ctx.font = `${textStyle.fontSize} ${textStyle.fontFamily}`;
            ctx.fillStyle = textStyle.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textRect = textElement.getBoundingClientRect();
            const canvasRect = logoCanvas.getBoundingClientRect();
            const textX = textRect.left - canvasRect.left + textRect.width / 2;
            const textY = textRect.top - canvasRect.top + textRect.height / 2;

            // إضافة ظل النص إذا كان مفعلًا
            if (textShadow.checked) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
            }

            ctx.fillText(textElement.textContent, textX, textY);
            ctx.shadowColor = 'transparent';

            // رسم الصورة إذا كانت موجودة
            if (imageElement.src && !imageElement.classList.contains('hidden')) {
                const img = new Image();
                img.src = imageElement.src;
                img.onload = function() {
                    const imgRect = imageElement.getBoundingClientRect();
                    const imgX = imgRect.left - canvasRect.left;
                    const imgY = imgRect.top - canvasRect.top;
                    const imgWidth = imgRect.width;
                    const imgHeight = imgRect.height;

                    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

                    // إنشاء رابط التحميل
                    const link = document.createElement('a');
                    link.download = 'شعار-مخصص.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                };
            } else {
                // إنشاء رابط التحميل إذا لم تكن هناك صورة
                const link = document.createElement('a');
                link.download = 'شعار-مخصص.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        });

        // تعيين القيم الافتراضية
        logoCanvas.style.backgroundColor = bgColor.value;
        textElement.style.fontSize = '40px';
        sizeValue.textContent = '40px';
    }
});