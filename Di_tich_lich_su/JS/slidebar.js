// JS/slidebar.js

function initslidebar() {
    const slidebar = document.querySelector(".slidebar");
    if (!slidebar) return; // Dừng lại nếu không tìm thấy sidebar

    // Chọn riêng từng nút
    const openToggle = document.querySelector(".slidebar .bx-chevron-right");
    const closeToggle = document.querySelector(".slidebar .bx-chevron-left");
    const icons = document.querySelectorAll(".menu-links .icon");

    if (openToggle) {
        openToggle.addEventListener("click", () => {
            slidebar.classList.remove("close"); // Luôn xóa class 'close'
        });
    }

    if (closeToggle) {
        closeToggle.addEventListener("click", () => {
            slidebar.classList.add("close"); // Luôn thêm class 'close'
        });
    }

    // Các icon menu sẽ mở sidebar nếu nó đang đóng
    icons.forEach(icon => {
        icon.addEventListener("click", () => {
            if (slidebar.classList.contains("close")) {
                slidebar.classList.remove("close");
            }
        });
    });
}

// Chạy hàm sau khi trang đã tải xong
document.addEventListener("DOMContentLoaded", initslidebar);