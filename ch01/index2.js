// ----------------------------
// 創新功能：跌倒偵測與通訊告警
// ----------------------------

let isAlerted = false; // 防止重複觸發告警

function detectFall(accel) {
    if (accel.x === null) return;

    // 計算總加速度向量大小 (Vector Magnitude)
    // 公式: Math.sqrt(x^2 + y^2 + z^2)
    const totalAccel = Math.sqrt(accel.x**2 + accel.y**2 + accel.z**2);
    
    // 設定門檻值：通常自由落體後撞擊地面的加速度會大於 20 (單位 m/s^2)
    const THRESHOLD = 20;

    if (totalAccel > THRESHOLD && !isAlerted) {
        isAlerted = true; // 鎖定告警，避免重複發送
        
        // 執行「通訊」動作
        sendEmergencyAlert(totalAccel);
    }
}

function sendEmergencyAlert(impactValue) {
    const lat = deviceState.lat;
    const lon = deviceState.lon;
    
    const message = `🚨 警告：偵測到疑似跌倒！\n衝擊力道：${impactValue.toFixed(2)}\n目前位置：https://www.google.com/maps?q=${lat},${lon}`;
    
    // 模擬通訊：顯示在畫面並跳出通知
    alert(message);
    console.log("已發送緊急通訊訊息:", message);
    
    // 這裡可以延伸加入 fetch('你的伺服器網址') 來達成真正的遠端通訊
}

// 修改老師原本的 setUpdateCallback 內容
setUpdateCallback((state) => {
    if (stateDisplay) {
        stateDisplay.textContent = JSON.stringify(state, null, 2);
    }
    // 每次狀態更新時，檢查是否跌倒
    detectFall(state.accel);
});
