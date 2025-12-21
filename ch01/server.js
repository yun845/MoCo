// --- 修改後的定位功能 ---
document.getElementById('sendBtn').onclick = () => {
    if (navigator.geolocation) {
        document.getElementById('sendBtn').innerText = "正在定位...";
        
        // 設定定位參數
        const geoOptions = {
            enableHighAccuracy: true, // 優先使用 GPS，若失敗則回退
            timeout: 10000,           // 最多等 10 秒，超時就報錯 (避免無限轉圈)
            maximumAge: 30000         // 如果 30 秒內有舊位置，就直接用舊的 (加速反應)
        };

        navigator.geolocation.getCurrentPosition((pos) => {
            const payload = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            
            const message = new Paho.MQTT.Message(JSON.stringify(payload));
            message.destinationName = TOPIC;
            client.send(message);
            
            document.getElementById('sendBtn').innerText = "發送我的座標";
            alert("✅ 定位成功！訊號已發出");
        }, (err) => {
            // 針對不同錯誤提供提示
            let errorMsg = "定位失敗：";
            switch(err.code) {
                case err.PERMISSION_DENIED: errorMsg += "請開啟網頁定位權限"; break;
                case err.POSITION_UNAVAILABLE: errorMsg += "偵測不到訊號 (請移至窗邊)"; break;
                case err.TIMEOUT: errorMsg += "定位超時 (建議重開 GPS)"; break;
            }
            alert(errorMsg);
            document.getElementById('sendBtn').innerText = "發送我的座標";
        }, geoOptions); // 這裡加入了優化參數
    }
};
