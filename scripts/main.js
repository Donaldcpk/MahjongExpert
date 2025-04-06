/**
 * 麻將聽牌練習遊戲主程序
 * 負責協調不同模組並初始化遊戲
 */

// 確保DOM完全加載後再執行
document.addEventListener('DOMContentLoaded', function() {
    // 檢查瀏覽器兼容性
    checkBrowserCompatibility();
    
    // 嘗試預加載麻將牌背景圖
    preloadImages();
    
    // 初始化遊戲日誌
    initGameLog();
    
    console.log('麻將聽牌練習遊戲已初始化');
});

/**
 * 檢查瀏覽器兼容性
 */
function checkBrowserCompatibility() {
    // 檢查localStorage支持
    if (!window.localStorage) {
        alert('您的瀏覽器不支持本地存儲，排行榜功能將無法使用。');
    }
    
    // 檢查ES6功能
    try {
        new Function('() => {}');
    } catch (e) {
        alert('您的瀏覽器可能過舊，請使用最新版的Chrome, Firefox或Safari以獲得最佳體驗。');
    }
}

/**
 * 預加載遊戲會用到的圖片
 */
function preloadImages() {
    // 預加載背景圖
    const bgImage = new Image();
    bgImage.src = 'images/mahjong-bg.jpg';
    
    // 在圖片加載失敗時使用默認背景
    bgImage.onerror = function() {
        document.getElementById('home-screen').style.backgroundImage = 'none';
        document.getElementById('home-screen').style.backgroundColor = '#f0f0f0';
    };
}

/**
 * 初始化遊戲日誌
 */
function initGameLog() {
    // 檢查是否是首次運行
    if (!localStorage.getItem('mahjong_game_log')) {
        // 創建遊戲日誌
        const gameLog = {
            firstRun: new Date().toISOString(),
            runCount: 0,
            lastRun: null,
            gameHistory: []
        };
        
        localStorage.setItem('mahjong_game_log', JSON.stringify(gameLog));
    }
    
    // 更新遊戲日誌
    updateGameLog();
}

/**
 * 更新遊戲日誌
 */
function updateGameLog() {
    // 獲取現有日誌
    let gameLog = JSON.parse(localStorage.getItem('mahjong_game_log'));
    
    // 更新運行次數和最後運行時間
    gameLog.runCount += 1;
    gameLog.lastRun = new Date().toISOString();
    
    // 保存更新後的日誌
    localStorage.setItem('mahjong_game_log', JSON.stringify(gameLog));
}

/**
 * 記錄遊戲歷史
 * @param {Object} gameData 遊戲數據
 */
function logGameHistory(gameData) {
    // 獲取現有日誌
    let gameLog = JSON.parse(localStorage.getItem('mahjong_game_log'));
    
    // 添加遊戲歷史記錄
    gameLog.gameHistory.push({
        date: new Date().toISOString(),
        ...gameData
    });
    
    // 限制歷史記錄數量
    const MAX_HISTORY = 50;
    if (gameLog.gameHistory.length > MAX_HISTORY) {
        gameLog.gameHistory = gameLog.gameHistory.slice(-MAX_HISTORY);
    }
    
    // 保存更新後的日誌
    localStorage.setItem('mahjong_game_log', JSON.stringify(gameLog));
}

// 在遊戲結束時記錄遊戲歷史
// 添加監聽函數
(function() {
    const originalEndGame = Game.endGame;
    Game.endGame = function() {
        // 調用原始方法
        const result = originalEndGame.apply(this, arguments);
        
        // 記錄遊戲歷史
        if (this.gameEndTime) {
            logGameHistory({
                difficulty: this.currentDifficulty,
                score: this.score,
                accuracy: this.correctAnswers / this.totalQuestions,
                time: Math.floor((this.gameEndTime - this.gameStartTime) / 1000)
            });
        }
        
        return result;
    };
})(); 