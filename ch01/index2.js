<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>銀髮守護者 - 跌倒偵測告警系統</title>
    <style>
        body { font-family: "Microsoft JhengHei", Arial, sans-serif; margin: 20px; background-color: #f0f2f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .permission-btn { background: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px; }
        .alert-box { background: #ffebee; border-left: 5px solid #f44336; padding: 15px; margin-top: 20px; display: none; }
        #stateDisplay { background: #2d3436; color: #dfe6e9; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; }
        .status-tag { color: #0984e3; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>👵 銀髮守護者 (Silver Guardian)</h1>
        <p>本專案結合<b>行動感測</b>與<b>通訊位置</b>，當偵測到長者跌倒時，會自動擷取座標並發送告警。</p>
        
        <div id="status" class="status-tag">初始化中，請授權...</div>
        
        <div style="margin: 20px 0;">
            <button class="permission-btn" onclick="requestSensorPermissionsManually()">1. 啟動感測器 (iOS/Android)</button>
            <button class="permission-btn" style="background:#0984e3;" onclick="retryGeolocation()">2. 更新 GPS 位置</button>
        </div>

        <div id="fallAlert" class="alert-box">
            <h2 style="color:#d63031; margin-top:0;">🚨 偵測到異常衝擊！</h2>
            <p id="alertMessage"></p>
            <button onclick="resetAlert()" style="padding:5px 10px;">解除告警</button>
        </div>

        <h3>即時裝置狀態：</h3>
        <pre id="stateDisplay">等待感測器資料...</pre>
    </div>

<script>
// ----------------------------
// 1. 全域變數 (延續老師架構)
// ----------------------------
const deviceState = { lat: 0, lon: 0, accel: { x: 0, y: 0, z: 0 } };
let isAlerted = false; // 避免重複觸發

// ----------------------------
// 2. 創新功能：跌倒偵測邏輯 (創新點)
// ----------------------------

function checkFall(accel) {
    if (isAlerted || !accel.x) return;

    // 計算總加速度向量 (合力)
    const totalG = Math.sqrt(accel.x**2 + accel.y**2 + accel.z**2);
    
    // 門檻值設定：一般走路約 9.8~12，跌倒撞擊通常 > 25 (m/s^2)
    const THRESHOLD = 25; 

    if (totalG > THRESHOLD) {
        isAlerted = true;
        triggerCommunication(totalG);
    }
}

// ----------------------------
// 3. 通訊功能：模擬發送訊息 (通訊點)
// ----------------------------
function triggerCommunication(impact) {
    const time = new Date().toLocaleTimeString();
    const mapUrl = `https://www.google.com/maps?q=${deviceState.lat},${deviceState.lon}`;
    
    // 模擬通訊行為：更新 UI 並發出警示音
    const alertBox = document.getElementById("fallAlert");
    const alertMsg = document.getElementById("alertMessage");
    
    alertBox.style.display = "block";
    alertMsg.innerHTML = `
        <b>發生時間：</b> ${time}<br>
        <b>衝擊力道：</b> ${impact.toFixed(2)} m/s²<br>
        <b>座標位址：</b> ${deviceState.lat.toFixed(4)}, ${deviceState.lon.toFixed(4)}<br>
        <a href="${mapUrl}" target="_blank">📍 在地圖上查看救援位置</a>
    `;
    
    // 行動通訊核心：利用瀏覽器通知或 Alert
    alert("【緊急通訊】偵測到跌倒！位置已發送至雲端中心。");
}

function resetAlert() {
    isAlerted = false;
    document.getElementById("fallAlert").style.display = "none";
}

// ----------------------------
// 4. 基礎感測器功能 (依據老師提供的程式碼簡化/保留)
// ----------------------------
function startMotionListener() {
    window.addEventListener("devicemotion", (event) => {
        const accel = event.accelerationIncludingGravity || {};
        deviceState.accel.x = accel.x || 0;
        deviceState.accel.y = accel.y || 0;
        deviceState.accel.z = accel.z || 0;
        
        // 更新 UI
        document.getElementById("stateDisplay").textContent = JSON.stringify(deviceState, null, 2);
        
        // 執行跌倒檢查
        checkFall(deviceState.accel);
    });
}

function startGeolocation() {
    navigator.geolocation.watchPosition((pos) => {
        deviceState.lat = pos.coords.latitude;
        deviceState.lon = pos.coords.longitude;
    }, null, { enableHighAccuracy: true });
}

async function requestSensorPermissionsManually() {
    // 針對 iOS 請求權限
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === "granted") {
            startMotionListener();
            document.getElementById("status").textContent = "感測器運作中";
        }
    } else {
        startMotionListener(); // Android 或一般瀏覽器
        document.getElementById("status").textContent = "感測器運作中";
    }
}

function retryGeolocation() {
    startGeolocation();
    alert("GPS 權限已請求，請確認瀏覽器上方彈窗。");
}

window.onload = () => { startGeolocation(); };
</script>
</body>
</html>
