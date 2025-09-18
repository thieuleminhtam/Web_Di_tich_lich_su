// === POPUP LOGIN / SIGNUP / CHANGE PASSWORD ===
function openPopupDynamic(id, userId = null) {
  const container = document.getElementById('popupContent');
  const popup = document.getElementById('popupContainer');
  let html = "";

  // === LOGIN ===
  if (id === "login") {
    html = `
      <div class="login-popup">
        <h2>Đăng nhập</h2>
        <form id="loginForm" class="login-form">
          <label for="username">Tên đăng nhập</label>
          <input type="text" id="username" name="username" required>

          <label for="password">Mật khẩu</label>
          <div class="password-wrapper">
            <input type="password" id="password" name="password" required>
            <i class="fa-solid fa-eye toggle-password" id="togglePassword"></i>
          </div>

          <button type="submit">Đăng nhập</button>
          <div id="loginMessage" class="login-message"></div>
        </form>
      </div>
    `;
    container.innerHTML = html;
    popup.classList.remove("hidden");

    document.getElementById("togglePassword")?.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const response = await fetch("PHP/login.php", { 
        method: "POST", 
        body: formData,
        credentials: "include"   // ✅ giữ session
      });

      const result = await response.json();
      const msgEl = document.getElementById("loginMessage");

      if (result.success) {
        msgEl.style.color = "green";
        msgEl.textContent = "Đăng nhập thành công!";
        showLogoutUI(result.username);
        setTimeout(() => closePopup(), 1500);
      } else {
        msgEl.textContent = result.message;
        msgEl.style.color = "red";
      }
    });
    return;
  }

  // === SIGNUP ===
  if (id === "signup") {
    html = `
      <div class="login-popup">
        <h2>Thêm tài khoản</h2>
        <form id="signupForm" class="login-form">
          <label for="newUsername">Tên đăng nhập</label>
          <input type="text" id="newUsername" name="newUsername" required>

          <label for="newPassword">Mật khẩu</label>
          <div class="password-wrapper">
           <input type="password" id="newPassword" name="newPassword" required>
           <i class="fa-solid fa-eye toggle-password" id="togglePassword"></i>
          </div>

          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required>

          <button type="submit">Đăng ký</button>
          <div id="signupMessage" class="login-message"></div>
        </form>
      </div>
    `;
    container.innerHTML = html;
    popup.classList.remove("hidden");

    document.getElementById("togglePassword")?.addEventListener("click", () => {
      const passwordInput = document.getElementById("newPassword");
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });

    document.getElementById("signupForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const response = await fetch("PHP/signup.php", { 
        method: "POST", 
        body: formData,
        credentials: "include"   // ✅ giữ session
      });

      const result = await response.json();
      const msgEl = document.getElementById("signupMessage");

      if (result.success) {
        msgEl.style.color = "green";
        msgEl.textContent = result.message;
        setTimeout(() => closePopup(), 1500);
      } else {
        msgEl.style.color = "red";
        msgEl.textContent = result.message;
      }
    });
    return;
  }

  // === CHANGE PASSWORD ===
  if (id === "changePassword") {
    html = `
      <div class="login-popup">
        <h2>Đổi mật khẩu</h2>
        <form id="changePassForm" class="login-form">
          <label for="userId">ID người dùng</label>
          <input type="number" id="userIdInput" name="id" required>

          <label for="newPassword">Mật khẩu</label>
            <div class="password-wrapper">
             <input type="password" id="newPassword" name="newPassword" required>
             <i class="fa-solid fa-eye toggle-password" id="togglePassword"></i>
          </div>

          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required>

          <button type="submit">Đổi mật khẩu</button>
          <div id="changePassMessage" class="login-message"></div>
        </form>
      </div>
    `;
    container.innerHTML = html;
    popup.classList.remove("hidden");

    document.getElementById("togglePassword")?.addEventListener("click", () => {
      const passwordInput = document.getElementById("newPassword");
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });

    document.getElementById("changePassForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const userId = document.getElementById("userIdInput").value.trim();
      const newPass = document.getElementById("newPassword").value;
      const confirmPass = document.getElementById("confirmPassword").value;
      const msgEl = document.getElementById("changePassMessage");

      if (!userId) {
        msgEl.textContent = "Vui lòng nhập ID người dùng!";
        msgEl.style.color = "red";
        return;
      }

      if (newPass !== confirmPass) {
        msgEl.textContent = "Mật khẩu xác nhận không khớp!";
        msgEl.style.color = "red";
        return;
      }

      const formData = new FormData();
      formData.append("id", userId);
      formData.append("newPassword", newPass);

      const res = await fetch("PHP/changePassword.php", { 
        method: "POST", 
        body: formData,
        credentials: "include"   // ✅ giữ session
      });

      const result = await res.json();

      msgEl.textContent = result.message;
      msgEl.style.color = result.success ? "green" : "red";

      if (result.success) setTimeout(() => closePopup(), 1500);
    });

    return;
  }
}

// === CLOSE POPUP ===
function closePopup() {
  const popup = document.getElementById("popupContainer");
  if (popup) popup.classList.add("hidden");
  const container = document.getElementById("popupContent");
  if (container) container.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra session khi load trang
  fetch("PHP/logout.php", {
    credentials: "include"   // ✅ gửi kèm cookie session
  })
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        showLogoutUI(data.username);
      } else {
        showLoginUI();
      }
    })
    .catch(err => console.error("Lỗi khi check session:", err));
});

function showLoginUI() {
  // Trạng thái: CHƯA login
  document.getElementById("Quanly-hide").style.display = "none"; 
  document.getElementById("loginMenu").style.display = "flex"; 
  document.getElementById("logoutMenu").style.display = "none";
}

function showLogoutUI(username) {
  // Trạng thái: ĐÃ login
  document.getElementById("Quanly-hide").style.display = "flex";
  document.getElementById("loginMenu").style.display = "none";
  document.getElementById("logoutMenu").style.display = "flex";
  /* console.log("Đã đăng nhập với user:", username); */
}

// Xử lý click Logout
document.getElementById("logoutMenu").addEventListener("click", () => {
  fetch("PHP/logout.php?action=logout", { 
    credentials: "include"   // ✅ gửi session để huỷ
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        alert(data.message);
        showLoginUI();
      }
    });
});
