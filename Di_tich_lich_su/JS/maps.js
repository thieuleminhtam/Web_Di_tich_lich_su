// ==========================================================
// KHAI BÁO BIẾN TOÀN CỤC (GLOBAL SCOPE)
// Các biến này cần được truy cập bởi nhiều hàm khác nhau
// ==========================================================
let map = null;
let startMarker = null;
let endMarker = null;
let routingControl = null;
let accuracyCircle = null; // <-- THÊM Ở ĐÂY: Biến để lưu vòng tròn định vị

const orsApiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImFlOTFhZmUyNDYyZjQ0ODA5MmYzZDVkYjExMjZlM2M0IiwiaCI6Im11cm11cjY0In0='; 
// SỬA LỖI 2: Thêm đối tượng 'icons' bị thiếu
const icons = {
    start: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // URL tới icon điểm bắt đầu
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    }),
    end: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', // URL tới icon điểm kết thúc
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    })
};

// ==========================================================
// HÀM KHỞI TẠO BẢN ĐỒ
// ==========================================================
function initMap() {
    // Khởi tạo bản đồ Leaflet với tọa độ trung tâm
    map = L.map('maps').setView([10.44, 106.73], 13); // Gán vào biến 'map' toàn cục

    var banDoVeTinh = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        minZoom: 0
    }).addTo(map); // Sử dụng biến 'map'

    var banDoduongPho = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
    });

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        errorTileUrl: 'https://via.placeholder.com/256?text=Map+Error'
    });

    var cacLopBanDo = {
        'Lớp nền 1': banDoVeTinh,
        'Lớp nền 2': osmLayer,
        'Lớp nền 3': banDoduongPho
    };

    L.control.layers(cacLopBanDo, {}, {
        position: 'topright',
        collapsed: true
    }).addTo(map); // Sử dụng biến 'map'
}

// ==========================================================
// GẮN CÁC SỰ KIỆN
// ==========================================================
function attachEventListeners() {
    const startInput = document.getElementById('start-input');
    const endInput = document.getElementById('end-input');
    const startResults = document.getElementById('start-results');
    const endResults = document.getElementById('end-results');
    const slidebar = document.querySelector(".slidebar");

    // Gắn sự kiện 'input' để tìm kiếm
    startInput.addEventListener('input', debounce((e) => handleSearch(e.target.value, startResults, 'start', startInput), 300));
    endInput.addEventListener('input', debounce((e) => handleSearch(e.target.value, endResults, 'end', endInput), 300));

    // Gắn sự kiện cho các nút
    const currentLocationBtn = document.getElementById('current-location-btn');
    if(currentLocationBtn) currentLocationBtn.addEventListener('click', handleGeolocation);

    const findRouteBtn = document.querySelector('.star-remove h2[id="find-route-btn"]');
    if(findRouteBtn) findRouteBtn.addEventListener('click', createOrUpdateRouting);
    
    const clearBtn = document.querySelector('.star-remove h2[id="clear-btn"]');
    if(clearBtn) clearBtn.addEventListener('click', clearAll);


    // Click trên bản đồ để chọn điểm
    map.on('click', (e) => {
        if (slidebar && slidebar.contains(e.originalEvent.target)) {
            return;
        }

        if (!startMarker) {
            setRoutePoint('start', e.latlng, "");
        } else if (!endMarker) {
            setRoutePoint('end', e.latlng, "");
        }
    });
}

// ==========================================================
// CÁC HÀM CHỨC NĂNG
// ==========================================================

/** Hàm debounce để tránh gọi API liên tục */
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

/** Tìm kiếm địa điểm bằng Nominatim API */
async function handleSearch(query, resultsContainer, role, inputElement) {
    resultsContainer.innerHTML = '';
    if (query.length < 3) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        data.forEach(place => {
            const div = document.createElement('div');
            div.textContent = place.display_name;
            div.onclick = () => {
                const latlng = L.latLng(place.lat, place.lon);
                setRoutePoint(role, latlng, place.display_name);
                inputElement.value = place.display_name;
                resultsContainer.innerHTML = '';
            };
            resultsContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Lỗi khi tìm kiếm địa điểm:", error);
        updateStatus("Đã xảy ra lỗi khi tìm kiếm địa điểm.");
    }
}

/** Đặt/Cập nhật một điểm trên bản đồ (start/end) */
function setRoutePoint(role, latlng, name) {
    let marker;
    const icon = icons[role];

    if (role === 'start') {
        // <-- THÊM LOGIC MỚI Ở ĐÂY
        // Nếu một điểm BẮT ĐẦU mới được đặt (không phải từ nút vị trí hiện tại),
        // thì vòng tròn định vị cũ không còn ý nghĩa nữa -> Xóa nó đi.
        if (accuracyCircle) {
            map.removeLayer(accuracyCircle);
            accuracyCircle = null;
        }
        // KẾT THÚC LOGIC MỚI

        if (startMarker) map.removeLayer(startMarker);
        startMarker = L.marker(latlng, { icon, draggable: true }).addTo(map);
        marker = startMarker;
        document.getElementById('start-input').value = name;
    } else { // role === 'end'
        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(latlng, { icon, draggable: true }).addTo(map);
        marker = endMarker;
        document.getElementById('end-input').value = name;
    }

    marker.on('dragend', () => {
        const newLatLng = marker.getLatLng();
        const inputElement = (role === 'start') ? document.getElementById('start-input') : document.getElementById('end-input');
        inputElement.value = `(${newLatLng.lat.toFixed(5)}, ${newLatLng.lng.toFixed(5)})`;
        createOrUpdateRouting();
    });

    updateStatus("Đã chọn điểm. Sẵn sàng tìm đường.");
    if (startMarker && endMarker) {
        createOrUpdateRouting();
    }
}


/** Xử lý lấy vị trí hiện tại của người dùng */
/** Xử lý lấy vị trí hiện tại của người dùng (PHIÊN BẢN ĐÚNG DUY NHẤT) */
function handleGeolocation() {
    map.locate({ setView: false, maxZoom: 16 }); // setView: false để fitBounds hoạt động tốt hơn
    updateStatus("Đang xác định vị trí của bạn...");

    map.once('locationfound', (e) => {
        // 1. Gọi setRoutePoint để đặt marker và tự động xóa vòng tròn cũ (nếu có)
        setRoutePoint('start', e.latlng, "Vị trí của bạn");
        
        // 2. Tạo ra vòng tròn 10km mới
        accuracyCircle = L.circle(e.latlng, 10000, { // Bán kính 10km = 10000 mét
            color: 'blue',      // Màu của đường viền
            fillColor: '#3498db', // Màu nền của vòng tròn
            fillOpacity: 0.2    // Độ trong suốt của màu nền
        }).addTo(map);
        
        // 3. Tự động zoom bản đồ để thấy vừa vặn cả vòng tròn
        map.fitBounds(accuracyCircle.getBounds());

        updateStatus("Đã tìm thấy vị trí của bạn. Vui lòng chọn điểm đến.");
    });

    map.once('locationerror', (e) => {
        alert(e.message);
        updateStatus("Lỗi khi lấy vị trí.");
    });
}

/** Xóa toàn bộ lộ trình và marker để làm lại */
function clearAll() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    
    // Đảm bảo vòng tròn cũng được xóa khi clear all
    if (accuracyCircle) {
        map.removeLayer(accuracyCircle);
        accuracyCircle = null;
    }

    startMarker = null;
    endMarker = null;

    document.getElementById('start-input').value = '';
    document.getElementById('end-input').value = '';
    document.getElementById('start-results').innerHTML = '';
    document.getElementById('end-results').innerHTML = '';

    updateStatus("Vui lòng chọn điểm bắt đầu và kết thúc.");
}
/** Tạo hoặc cập nhật lộ trình */
function createOrUpdateRouting() {
    if (!startMarker || !endMarker) {
        updateStatus("Vui lòng chọn đủ cả điểm bắt đầu và kết thúc.");
        return;
    }

    const waypoints = [startMarker.getLatLng(), endMarker.getLatLng()];

    if (routingControl) {
        map.removeControl(routingControl);
    }
    
    routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        router: L.Routing.osrmv1({
            language: 'vi' // Yêu cầu chỉ đường bằng tiếng Việt
        }),
        show: true,
        addWaypoints: false,
        position: 'topleft',
        createMarker: () => null
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const timeInSeconds = route.summary.totalTime;
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const time = `${hours} giờ ${minutes} phút`;
        updateStatus(`<b>Tìm thấy lộ trình!</b><br>Khoảng cách: ${distance} km<br>Thời gian dự kiến: ${time}`);
    });
}


/** Xóa toàn bộ lộ trình và marker để làm lại */
function clearAll() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    
    // <-- THÊM Ở ĐÂY: Xóa vòng tròn định vị
    if (accuracyCircle) {
        map.removeLayer(accuracyCircle);
        accuracyCircle = null;
    }

    startMarker = null;
    endMarker = null;

    document.getElementById('start-input').value = '';
    document.getElementById('end-input').value = '';
    document.getElementById('start-results').innerHTML = '';
    document.getElementById('end-results').innerHTML = '';

    updateStatus("Vui lòng chọn điểm bắt đầu và kết thúc.");
}

/** Cập nhật thông tin trạng thái cho người dùng */
function updateStatus(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.innerHTML = message;
}

// ==========================================================
// KHỞI CHẠY ỨNG DỤNG
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    attachEventListeners();
});