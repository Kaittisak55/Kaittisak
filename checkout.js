// checkout.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ดึง element ที่ต้องใช้
    const summaryItemsContainer = document.getElementById('summary-items');
    const subtotalEl = document.getElementById('summary-subtotal');
    const grandtotalEl = document.getElementById('summary-grandtotal');
    const checkoutForm = document.getElementById('checkout-form');

    // ดึงข้อมูลตะกร้าจาก localStorage
    const cartData = JSON.parse(localStorage.getItem('cartData'));

    function renderOrderSummary() {
        if (!cartData || cartData.length === 0) {
            summaryItemsContainer.innerHTML = '<p>ไม่มีสินค้าในรายการ</p>';
            subtotalEl.innerText = '0 ฿';
            grandtotalEl.innerText = '0 ฿';
            return;
        }

        summaryItemsContainer.innerHTML = ''; // เคลียร์ของเก่า
        let subtotal = 0;

        cartData.forEach(item => {
            subtotal += item.price * item.quantity;
            
            const itemHTML = `
                <div class="summary-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="summary-item-info">
                        <h4>${item.name}</h4>
                        <p>จำนวน: ${item.quantity}</p>
                    </div>
                    <span class="summary-item-price">${(item.price * item.quantity).toLocaleString()} ฿</span>
                </div>
            `;
            summaryItemsContainer.innerHTML += itemHTML;
        });

        subtotalEl.innerText = `${subtotal.toLocaleString()} ฿`;
        grandtotalEl.innerText = `${subtotal.toLocaleString()} ฿`; // สมมติว่าค่าส่งฟรี
    }

    // เมื่อฟอร์มถูก submit
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช

        // ดึงข้อมูลจากฟอร์ม
        const formData = new FormData(checkoutForm);
        const customerData = {
            fullname: formData.get('fullname'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            paymentMethod: formData.get('payment'),
        };

        // แสดงผลลัพธ์ (ในโปรเจกต์จริง ส่วนนี้จะส่งข้อมูลไปที่ server)
        console.log("ข้อมูลลูกค้า:", customerData);
        console.log("รายการสั่งซื้อ:", cartData);

        // แจ้งเตือนผู้ใช้ว่าสั่งซื้อสำเร็จ
        alert(`ขอบคุณคุณ ${customerData.fullname} สำหรับการสั่งซื้อ!\nเราจะดำเนินการจัดส่งสินค้าให้คุณโดยเร็วที่สุด`);
        
        // ล้างข้อมูลใน localStorage และกลับไปหน้าแรก
        localStorage.removeItem('cartData');
        window.location.href = 'index.html';
    });

    // เริ่มต้นแสดงผลสรุปรายการสั่งซื้อ
    renderOrderSummary();
});