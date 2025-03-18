document.addEventListener("DOMContentLoaded", () => {
    const imageUpload = document.getElementById("image-upload");
    const imageToCrop = document.getElementById("image-to-crop");
    const cropBtn = document.getElementById("crop-btn");
    const downloadCroppedBtn = document.getElementById("download-cropped-btn");
    const resizeWidthInput = document.getElementById("resize-width");
    const resizeHeightInput = document.getElementById("resize-height");
    const resizeCustomBtn = document.getElementById("resize-custom-btn");
    const resizeHalfBtn = document.getElementById("resize-half-btn");
    const resizeQuarterBtn = document.getElementById("resize-quarter-btn");
    const downloadResizedBtn = document.getElementById("download-resized-btn");

    const uploadAlert = document.getElementById("upload-alert");
    const cropAlert = document.getElementById("crop-alert");
    const resizeAlert = document.getElementById("resize-alert");

    let cropper;
    let originalImage = null;

    // 🖼 Khi upload ảnh
    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage = new Image();
                originalImage.src = e.target.result;
                imageToCrop.src = e.target.result;
                imageToCrop.style.display = "block";

                // Hủy cropper cũ nếu có
                if (cropper) {
                    cropper.destroy();
                }

                // Khởi tạo Cropper.js
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: NaN,
                    viewMode: 2,
                    scalable: true,
                    zoomable: true,
                    maxCanvasWidth: 600,
                    maxCanvasHeight: 400
                });

                cropBtn.style.display = "inline-block";

                // 🟢 Hiển thị thông báo "Ảnh đã tải lên thành công!"
                showAlert(uploadAlert);
                
                originalImage.onload = () => {
                    resizeWidthInput.value = originalImage.width;
                    resizeHeightInput.value = originalImage.height;
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // ✂️ Crop Ảnh
    cropBtn.addEventListener("click", () => {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            downloadCroppedBtn.style.display = "inline-block";
            downloadCroppedBtn.onclick = () => {
                const link = document.createElement("a");
                link.href = croppedCanvas.toDataURL("image/png");
                link.download = "cropped-image.png";
                link.click();
            };

            // 🟢 Hiển thị thông báo "Ảnh đã được crop!"
            showAlert(cropAlert);
        }
    });

    // 🔄 Resize ảnh
    function resizeImage(newWidth, newHeight) {
        if (!originalImage) return;
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
        downloadResizedBtn.style.display = "block";
        downloadResizedBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "resized-image.png";
            link.click();
        };

        // 🟢 Hiển thị thông báo "Ảnh đã được resize!"
        showAlert(resizeAlert);
    }

    resizeCustomBtn.addEventListener("click", () => {
        resizeImage(parseInt(resizeWidthInput.value), parseInt(resizeHeightInput.value));
    });

    resizeHalfBtn.addEventListener("click", () => {
        if (originalImage) {
            resizeImage(originalImage.width / 2, originalImage.height / 2);
        }
    });

    resizeQuarterBtn.addEventListener("click", () => {
        if (originalImage) {
            resizeImage(originalImage.width / 4, originalImage.height / 4);
        }
    });

    // 🟢 Hàm hiển thị Alert và tự ẩn sau 2 giây
    function showAlert(alertElement) {
        alertElement.style.display = "block";
        setTimeout(() => {
            alertElement.style.display = "none";
        }, 2000);
    }
});
