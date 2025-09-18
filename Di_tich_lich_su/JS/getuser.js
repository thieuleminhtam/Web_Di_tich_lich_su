async function loadUsersAdmin() {
  const container = document.querySelector(".Quanly");
  container.innerHTML = "";


  try {
    const res = await fetch("PHP/getuser.php");
    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = "<p>Chưa có tài khoản nào.</p>";
      return;
    }

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr style="background:#eee;">
        <th style="padding:5px;border:1px solid #ccc;width: 60px;fontsize:20px;">ID</th>
        <th style="padding:5px;border:1px solid #ccc; width: 500px;fontsize:20px;"">Username</th>
        <th style="padding:5px;border:1px solid #ccc; width: 500px;fontsize:20px;"">Mat khau</th>
        <th style="padding:5px;border:1px solid #ccc;fontsize:20px;"">Ngày tạo</th>
        <th style="padding:5px;border:1px solid #ccc;fontsize:20px;"">Chức năng</th>
      </tr>
    `;
    table.appendChild(thead);

const tbody = document.createElement("tbody");
data.forEach(user => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td style="padding:3px;border:1px solid #ccc;">${user.id}</td>
    <td style="padding:3px;border:1px solid #ccc;">${user.username}</td>
    <td style="padding:3px;border:1px solid #ccc;">
        <span class="pass-text">********</span>
        <button class="toggle-pass" data-pass="${user.password}" style="margin-left:5px;">
          <i   class="fa-solid fa-eye"></i>
        </button>
    </td>
    <td style="padding:3px;border:1px solid #ccc;">${user.created_at}</td>
    <td style="padding:15px;border:1px solid #ccc; ">
      <button style="padding:15px;" class="delete-btn" data-id="${user.id}">Xóa</button>
    </td>
  `;
  tbody.appendChild(tr);
});

table.appendChild(tbody);
container.appendChild(table);

// Event delegation cho toggle password
container.addEventListener("click", (e) => {
  if (e.target.closest(".toggle-pass")) {
    const btn = e.target.closest(".toggle-pass");
    const span = btn.previousElementSibling;
    if (span.textContent === "********") {
      span.textContent = btn.dataset.pass;
      btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      span.textContent = "********";
      btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  }
});


    table.appendChild(tbody);
    container.appendChild(table);

    // Sự kiện Xóa
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
        const id = btn.dataset.id;
        const res = await fetch("PHP/deleteUser.php", { method: "POST", body: new URLSearchParams({id}) });
        const result = await res.json();
        alert(result.message);
        if (result.success) loadUsersAdmin();
      });
    });

    // Sự kiện Đổi mật khẩu
    document.querySelectorAll(".change-pass-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const newPass = prompt("Nhập mật khẩu mới:");
        if (!newPass) return;
        const id = btn.dataset.id;
        fetch("PHP/changePassword.php", { method: "POST", body: new URLSearchParams({id, newPassword: newPass}) })
          .then(res => res.json())
          .then(result => alert(result.message));
      });
    });

  } catch (err) {
    container.innerHTML = "<p style='color:red;'>Lỗi tải dữ liệu!</p>";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadUsersAdmin);
