const contentDiv = document.querySelector('.content');
const navButtons = document.querySelectorAll('.nav-btn');

// ===== Nội dung HTML =====
const homeContent = `
    <nav class="slidebar close">
            <i class='bx  bx-chevron-right toggle'></i> 
            <i class='bx  bx-chevron-left toggle'></i> 

            <div style="display: flex; height: 100%;">
                <div class="menu-bar">
                    <div class="menu">                            
                        <ul class="menu-links">
                            <li class="nav-link slidebar-btn" style="background-color: rgb(235, 232, 232);">
                                <a>
                                    <i class='bx  bx-search-alt icon'></i> 
                                    <span class="text nav-text">Tìm kiếm</span>
                                </a>
                            </li>

                            <li class="nav-link slidebar-btn">
                                <a >
                                    <i class='bx  bx-pencil icon'></i> 
                                    <span class="text nav-text">Góp ý</span>
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
                <div class="content-home">
                    <h1> -Chọn điểm bắt đầu:</h1>
                    <li class="search-box">
                      <a>
                       <input type="search" id="start-input" placeholder="Nhập vị trí của bạn..."> 
                      </a>
                    </li>
                    <div class="results-list" id="start-results"></div>
                    <button id="current-location-btn">Lấy vị trí hiện tại</button>
                    <h1> -Chọn điểm đến:</h1>
                    <li class="search-box">
                      <a>
                       <input type="search" id="end-input" placeholder="Nhập điểm đến..."> 
                      </a>
                    </li>
                    <div class="results-list" id="end-results"></div>
                    <div class="star-remove">
                        <h2 id="find-route-btn">Tìm đường</h2>
                        <h2 id="clear-btn">Xóa lộ trình</h2>
                    </div>
                     <!-- Hiển thị thông tin -->
                    <div id="status" class="status">
                        <p>Vui lòng chọn điểm bắt đầu và kết thúc.</p>
                    </div>
                </div>
            </div>
            
        </nav>
        <div id="maps"></div>
        <div class="statuss">
            <p>#Lưu ý:'Nếu map lỗi hãy thử cách lớp nền khác'</p>
        </div>
`;
const storyContent = `
    <div id="maps"></div>
    <div class="story-sidebar">
        <div class="story-container" id="storyContainer"></div>
    </div>
`;
const QuanlyContent = `
    <aside class="menu-bar-quanly">
      <nav>
        <ul>
          <li id="accoutBtn" class="slidebar-btn">
            <i class='bx bx-slider-alt'></i> Quản lý tài khoản
          </li>
          <li id="feedbackBtn" class="slidebar-btn">
            <i class='bx bx-slider-alt'></i> Quản lý phản hồi
          </li>
        </ul>
      </nav>
    </aside>
    <div class="content-admin">
      <div class="header-admin">
        <h1>Danh sách tài khoản</h1>
        <div>
          <div onclick="openPopupDynamic('signup')" id="signup"> 
            <i class='bx bx-plus'></i> Thêm tài khoản
          </div>
          <div onclick="openPopupDynamic('changePassword')" id="changePassword"> 
            <i class='bx bx-plus'></i> Đổi mật khẩu
          </div>
        </div>
      </div>
      <div class="Quanly"></div>
    </div>
`;

const accout = `
    <div class="header-admin">
      <h1>Danh sách tài khoản</h1>
      <div>
        <div onclick="openPopupDynamic('signup')" id="signup">
          <i class='bx bx-plus'></i> Thêm tài khoản
        </div>
        <div onclick="openPopupDynamic('changePassword')" id="changePassword">
          <i class='bx bx-plus'></i> Đổi mật khẩu
        </div>
      </div>
    </div>
    <div class="Quanly"></div>
`;
const feedback = `<div>Danh sách phản hồi ở đây</div>`;

// ===== Load trang ban đầu =====
window.addEventListener('DOMContentLoaded', () => {
  contentDiv.innerHTML = homeContent;
  initMap();
  initslidebar();
  attachEventListeners();
  clearAll();

});

// ===== Nav Btn =====
document.getElementById('homeBtn').addEventListener('click', (e) => {
  e.preventDefault();
  contentDiv.innerHTML = homeContent;
  initMap();
  initslidebar();
  attachEventListeners();
  clearAll();
});

document.getElementById('storyBtn').addEventListener('click', (e) => {
  e.preventDefault();
  contentDiv.innerHTML = storyContent;
  initHome();
  initMap();

});

document.getElementById('QuanlyBtn').addEventListener('click', (e) => {
  e.preventDefault();
  contentDiv.innerHTML = QuanlyContent;
  loadUsersAdmin();
});

// ===== Event delegation cho slidebar-btn =====
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.slidebar-btn');
  if (!btn) return;

  // reset style
  document.querySelectorAll('.slidebar-btn').forEach(b => {
    b.style.backgroundColor = '';
    b.style.color = '';
    b.style.transform = '';
  });

  // style active
  btn.style.transition = "all 0.3s ease";
  btn.style.backgroundColor = 'rgb(235, 232, 232)';

  const adminDiv = contentDiv.querySelector('.content-admin');
  if (!adminDiv) return;

  if (btn.id === 'accoutBtn') {
    adminDiv.innerHTML = accout;
    loadUsersAdmin();
  }
  if (btn.id === 'feedbackBtn') {
    adminDiv.innerHTML = feedback;
  }
});

// =====  nav buttons style =====
function resetAllButtonStyles() {
  navButtons.forEach(button => {
    button.style.backgroundColor = '';
    button.style.color = '';
  });
}

navButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    resetAllButtonStyles();
    this.style.color = 'brown';
    this.style.transition = "all 0.3s ease";
  });
});
