document.addEventListener('DOMContentLoaded', () => {
    let tableOrders = JSON.parse(localStorage.getItem('tableOrders')) || [];
    const totalPriceElement = document.querySelector('#total-price');
    const discountInput = document.querySelector('#discount');
    const applyDiscountButton = document.querySelector('#applyDiscount');
    const finalizeOrderButton = document.getElementById('finalizeOrder');
    const orderSummary = document.querySelector('#bill-items');
    const modal = document.getElementById('order-settled-modal');
    const closeModalButton = document.getElementById('close-modal');
    const selfieImage = document.getElementById('selfie-image');
    const selfiePreview = document.getElementById('selfie-preview');
    const cameraIcon = document.getElementById('camera-icon');

    function formatPrice(price) {
        return `₹${price.toFixed(2)}`;
    }

    function updateOrderSummary() {
        orderSummary.innerHTML = '';
    
        if (!tableOrders || tableOrders.length === 0) {
            orderSummary.innerHTML = '<tr><td colspan="4">No items ordered.</td></tr>';
            totalPriceElement.textContent = formatPrice(0);
            return;
        }
    
        let total = 0;
        tableOrders.forEach((item, index) => {
            total += item.price * item.quantity;
            const orderItem = document.createElement('tr');
            orderItem.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
                <td>
                    <button class="remove-item-btn" data-index="${index}">
                        <img src="Dish/minus.png" alt="Remove" class="remove-icon"> <!-- Updated icon source -->
                    </button>
                </td>
            `;
            orderSummary.appendChild(orderItem);
        });
    
        totalPriceElement.textContent = formatPrice(total);
    
        // Add event listeners for the remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.currentTarget.getAttribute('data-index');
                removeItem(index);
            });
        });
    }
    
    function applyDiscount() {
        const discountValue = parseFloat(discountInput.value) || 0;
        let total = tableOrders.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discountAmount = (total * discountValue) / 100;
        const discountedTotal = total - discountAmount;
        totalPriceElement.textContent = formatPrice(discountedTotal);
    }

    function removeItem(index) {
        tableOrders.splice(index, 1);
        localStorage.setItem('tableOrders', JSON.stringify(tableOrders));
        updateOrderSummary();
    }

    async function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPosition = 20;

        // Add Brand Logo
        const imgData = 'Dish/FZBillinG Logo.png'; // Adjust as needed
        doc.addImage(imgData, 'PNG', 10, 10, 30, 30);
        yPosition += 40;

        // Add Restaurant Information
        doc.setFontSize(16);
        doc.text('Your Restaurant Name', 50, 15);
        doc.setFontSize(12);
        doc.text('123 Restaurant Street, City, Country', 50, 25);

        // Table Headers
        doc.setFontSize(14);
        doc.text('Bill Details', 14, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        doc.text('Item', 14, yPosition);
        doc.text('Qty', 70, yPosition);
        doc.text('Price', 100, yPosition);
        doc.text('Total', 130, yPosition);
        yPosition += 10;

        let total = 0;

        // Table Content
        tableOrders.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            doc.text(item.name, 14, yPosition);
            doc.text(item.quantity.toString(), 70, yPosition);
            doc.text(formatPrice(item.price), 100, yPosition);
            doc.text(formatPrice(itemTotal), 130, yPosition);
            yPosition += 10;
        });

        // Add Total Amount and Discount
        const discountValue = parseFloat(discountInput.value) || 0;
        const discountAmount = (total * discountValue) / 100;
        const discountedTotal = total - discountAmount;

        yPosition += 10;
        doc.text(`Total Amount: ${formatPrice(total)}`, 14, yPosition);
        yPosition += 10;
        doc.text(`Discount Applied: ${discountValue}%`, 14, yPosition);
        yPosition += 10;
        doc.text(`Total Payable: ${formatPrice(discountedTotal)}`, 14, yPosition);

        // Add Selfie to PDF if available
        if (selfieImage.src) {
            doc.addImage(selfieImage.src, 'PNG', 10, yPosition, 30, 30);
            yPosition += 40; // Adjust position as needed
        }

        // Save the PDF
        doc.save('Bill.pdf');
    }

    function showOrderSettledModal() {
        modal.style.display = 'flex';
    }

    function hideOrderSettledModal() {
        modal.style.display = 'none';
    }

    async function takeSelfie() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.style.display = 'none';
            document.body.appendChild(video);

            // Show video to user
            const captureButton = document.createElement('button');
            captureButton.textContent = 'Capture';
            document.body.appendChild(captureButton);

            captureButton.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0);

                // Stop camera stream
                stream.getTracks().forEach(track => track.stop());
                video.remove();
                captureButton.remove();

                // Display selfie
                selfieImage.src = canvas.toDataURL('image/png');
                selfieImage.style.display = 'block';
                selfiePreview.style.display = 'block';
            });
        } catch (err) {
            alert('Unable to access camera: ' + err.message);
        }
    }

    // Event Listeners
    applyDiscountButton.addEventListener('click', applyDiscount);

    finalizeOrderButton.addEventListener('click', () => {
        if (tableOrders.length === 0) {
            showOrderSettledModal(); // Show the modal instead of alert
            return;
        }
        generatePDF(); // Generate and download the PDF
        showOrderSettledModal(); // Show the modal after generating the PDF
    });

    closeModalButton.addEventListener('click', () => {
        hideOrderSettledModal();
        window.location.href = 'http://192.168.232.18:5500/Html.html'; // Redirect to another page
    });

    // Close modal on clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideOrderSettledModal();
            window.location.href = 'http://192.168.232.18:5500/Html.html'; // Redirect to another page
        }
    });

    // Event Listener for Camera Icon
    cameraIcon.addEventListener('click', takeSelfie);

    updateOrderSummary();
});
