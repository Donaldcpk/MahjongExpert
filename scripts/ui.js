/**
 * 麻將聽牌練習遊戲UI邏輯
 * 負責處理用戶界面互動、屏幕切換和動畫效果
 */

class MahjongUI {
    constructor() {
        // 屏幕元素
        this.screens = {
            home: document.getElementById('home-screen'),
            difficulty: document.getElementById('difficulty-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen'),
            ranking: document.getElementById('ranking-screen'),
            help: document.getElementById('help-screen')
        };
        
        // 遊戲元素
        this.gameElements = {
            timeRemaining: document.getElementById('time-remaining'),
            currentScore: document.getElementById('current-score'),
            currentQuestion: document.getElementById('current-question'),
            totalQuestions: document.getElementById('total-questions'),
            currentTiles: document.getElementById('current-tiles'),
            tileOptions: document.getElementById('tile-options'),
        };
        
        // 結果元素
        this.resultElements = {
            difficulty: document.getElementById('result-difficulty'),
            score: document.getElementById('result-score'),
            accuracy: document.getElementById('result-accuracy'),
            time: document.getElementById('result-time')
        };
        
        // 通知元素
        this.notification = document.getElementById('notification');
        this.notificationMessage = document.getElementById('notification-message');
        
        // 當前遊戲難度
        this.currentDifficulty = null;
        
        // 已選擇的正確答案（用於高級難度）
        this.selectedCorrectTiles = new Set();
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化UI
     */
    init() {
        // 綁定事件處理
        this.bindEvents();
        
        // 預加載麻將牌圖片
        this.preloadTileImages();
    }
    
    /**
     * 預加載麻將牌圖片
     */
    preloadTileImages() {
        MahjongTiles.ALL_TILES.forEach(tile => {
            const img = new Image();
            img.src = tile.image;
        });
    }
    
    /**
     * 綁定所有UI事件
     */
    bindEvents() {
        // 首頁按鈕
        document.getElementById('start-button').addEventListener('click', () => {
            this.showScreen('difficulty');
        });
        
        document.getElementById('ranking-button').addEventListener('click', () => {
            this.showRankings('easy'); // 默認顯示初級難度排行
            this.showScreen('ranking');
        });
        
        document.getElementById('help-button').addEventListener('click', () => {
            this.showScreen('help');
        });
        
        // 難度選擇
        const difficultyCards = document.querySelectorAll('.difficulty-card');
        difficultyCards.forEach(card => {
            card.addEventListener('click', () => {
                const difficulty = card.getAttribute('data-difficulty');
                this.startGame(difficulty);
            });
        });
        
        // 返回按鈕
        document.getElementById('back-from-difficulty').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        document.getElementById('back-from-ranking').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        document.getElementById('back-from-help').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        document.getElementById('back-from-game').addEventListener('click', () => {
            if (confirm('確定要退出遊戲嗎？當前進度將不會被保存。')) {
                Game.endGame();
                this.showScreen('home');
            }
        });
        
        // 結果畫面按鈕
        document.getElementById('play-again').addEventListener('click', () => {
            this.showScreen('difficulty');
        });
        
        document.getElementById('back-to-home').addEventListener('click', () => {
            this.showScreen('home');
        });
        
        // 排行榜分頁
        const rankingTabs = document.querySelectorAll('.tab-btn');
        rankingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有標籤的活動狀態
                rankingTabs.forEach(t => t.classList.remove('active'));
                // 設置當前標籤為活動狀態
                tab.classList.add('active');
                // 加載相應難度的排行榜
                const difficulty = tab.getAttribute('data-tab');
                this.showRankings(difficulty);
            });
        });
    }
    
    /**
     * 顯示指定的屏幕
     * @param {string} screenName 屏幕名稱
     */
    showScreen(screenName) {
        // 隱藏所有屏幕
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 顯示指定屏幕
        this.screens[screenName].classList.add('active');
    }
    
    /**
     * 顯示通知
     * @param {string} message 通知訊息
     * @param {number} duration 顯示時間(毫秒)
     */
    showNotification(message, duration = 2000) {
        this.notificationMessage.textContent = message;
        this.notification.classList.add('show');
        
        // 設定自動隱藏
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, duration);
    }
    
    /**
     * 開始遊戲
     * @param {string} difficulty 難度
     */
    startGame(difficulty) {
        // 顯示遊戲屏幕
        this.showScreen('game');
        
        // 保存當前難度
        this.currentDifficulty = difficulty;
        
        // 清空已選擇的正確答案
        this.selectedCorrectTiles = new Set();
        
        // 設置難度特定的樣式
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.remove('easy-mode', 'medium-mode', 'hard-mode');
        gameScreen.classList.add(`${difficulty}-mode`);
        
        // 開始新遊戲
        const gameData = Game.startGame(
            difficulty,
            this.updateTimer.bind(this),
            this.showGameResult.bind(this)
        );
        
        // 更新UI
        this.gameElements.totalQuestions.textContent = gameData.totalQuestions;
        this.gameElements.currentQuestion.textContent = gameData.currentQuestion;
        this.gameElements.currentScore.textContent = '0';
        
        // 設置初始計時器
        this.updateTimer(gameData.timeLimit);
        
        // 顯示牌型
        this.displayPuzzle(gameData.puzzle);
    }
    
    /**
     * 更新計時器
     * @param {number} timeRemaining 剩餘時間（秒）
     */
    updateTimer(timeRemaining) {
        this.gameElements.timeRemaining.textContent = MahjongGame.formatTime(timeRemaining);
        
        // 根據剩餘時間變更顏色
        if (timeRemaining <= 10) {
            this.gameElements.timeRemaining.style.color = '#f44336'; // 紅色
        } else if (timeRemaining <= 20) {
            this.gameElements.timeRemaining.style.color = '#ff9800'; // 橙色
        } else {
            this.gameElements.timeRemaining.style.color = ''; // 恢復默認
        }
    }
    
    /**
     * 顯示牌型
     * @param {Object} puzzle 牌型數據
     */
    displayPuzzle(puzzle) {
        // 清空當前牌和選項
        this.gameElements.currentTiles.innerHTML = '';
        this.gameElements.tileOptions.innerHTML = '';
        
        // 顯示當前手牌
        puzzle.handTiles.forEach(tile => {
            const tileElement = this.createTileElement(tile);
            this.gameElements.currentTiles.appendChild(tileElement);
        });
        
        // 根據難度準備選項
        let options = [];
        
        // 獲取遊戲設定
        const settings = Game.difficultySettings[this.currentDifficulty];
        
        if (this.currentDifficulty === 'easy') {
            // 初級：從5個選項中選1個
            options = this.prepareEasyOptions(puzzle.waitingTiles, settings.optionsCount);
        } else if (this.currentDifficulty === 'medium' || this.currentDifficulty === 'hard') {
            // 中級和高級：顯示所有麻將牌作為選項
            options = [...MahjongTiles.ALL_TILES];
        }
        
        // 顯示選項
        options.forEach(tile => {
            const tileElement = this.createTileElement(tile, true);
            tileElement.addEventListener('click', () => this.handleTileSelection(tile));
            this.gameElements.tileOptions.appendChild(tileElement);
            
            // 高級難度中，如果這個牌已經被選中為正確答案，標記它
            if (this.currentDifficulty === 'hard' && 
                this.selectedCorrectTiles.has(tile.id) && 
                puzzle.waitingTiles.some(t => t.id === tile.id)) {
                tileElement.classList.add('correct');
            }
        });
    }
    
    /**
     * 為初級難度準備選項
     * @param {Array} waitingTiles 正確的聽牌
     * @param {number} optionsCount 選項數量
     * @returns {Array} 選項數組
     */
    prepareEasyOptions(waitingTiles, optionsCount) {
        // 正確答案
        const correctTile = waitingTiles[0];
        const options = [correctTile];
        
        // 添加一些干擾項
        const distractorCount = optionsCount - 1;
        const availableTiles = MahjongTiles.ALL_TILES.filter(tile => 
            tile.id !== correctTile.id
        );
        
        // 隨機選擇干擾項
        this.shuffleArray(availableTiles);
        
        for (let i = 0; i < distractorCount && i < availableTiles.length; i++) {
            options.push(availableTiles[i]);
        }
        
        // 打亂選項順序
        this.shuffleArray(options);
        
        return options;
    }
    
    /**
     * 創建麻將牌元素
     * @param {Object} tile 牌數據
     * @param {boolean} isOption 是否為選項
     * @returns {HTMLElement} 牌元素
     */
    createTileElement(tile, isOption = false) {
        const tileElement = document.createElement('div');
        tileElement.className = `mahjong-tile${isOption ? ' option' : ''}`;
        tileElement.dataset.id = tile.id;
        
        // 使用圖片而非文字
        const tileImage = document.createElement('img');
        tileImage.src = tile.image;
        tileImage.alt = tile.display;
        tileImage.className = 'tile-image';
        tileElement.appendChild(tileImage);
        
        return tileElement;
    }
    
    /**
     * 處理牌選擇
     * @param {Object} selectedTile 選擇的牌
     */
    handleTileSelection(selectedTile) {
        // 檢查答案
        const result = Game.checkAnswer(selectedTile);
        
        // 更新分數
        this.gameElements.currentScore.textContent = result.score;
        
        // 顯示答案反饋
        this.showAnswerFeedback(selectedTile, result.isCorrect, result.message);
        
        // 高級難度：如果答對了，保存這個正確答案
        if (result.isCorrect && this.currentDifficulty === 'hard') {
            this.selectedCorrectTiles.add(selectedTile.id);
        }
        
        // 延遲後顯示下一題或結束遊戲
        setTimeout(() => {
            if (result.shouldEndGame) {
                // 遊戲已在Game.checkAnswer中結束
            } else if (result.shouldShowNextQuestion) {
                // 更新問題計數
                this.gameElements.currentQuestion.textContent = result.nextQuestion.currentQuestion;
                
                // 重置已選擇的正確答案
                this.selectedCorrectTiles = new Set();
                
                // 顯示新牌型
                this.displayPuzzle(result.nextQuestion.puzzle);
            }
        }, 1500);
    }
    
    /**
     * 顯示答案反饋
     * @param {Object} selectedTile 選擇的牌
     * @param {boolean} isCorrect 是否正確
     * @param {string} message 反饋訊息
     */
    showAnswerFeedback(selectedTile, isCorrect, message) {
        // 找到被選擇的牌元素
        const tileElements = document.querySelectorAll('.mahjong-tile.option');
        
        tileElements.forEach(element => {
            if (element.dataset.id === selectedTile.id) {
                // 添加正確或錯誤的樣式
                element.classList.add(isCorrect ? 'correct' : 'wrong');
            }
            
            // 高級難度不禁用其他選項
            if (this.currentDifficulty !== 'hard') {
                // 初級和中級禁用所有選項
                element.style.pointerEvents = 'none';
            } else if (!isCorrect) {
                // 高級難度下，如果答錯就禁用所有選項
                element.style.pointerEvents = 'none';
            } else {
                // 高級難度下，如果答對就只禁用已選的正確答案
                if (this.selectedCorrectTiles.has(element.dataset.id)) {
                    element.style.pointerEvents = 'none';
                }
            }
        });
        
        // 顯示通知
        this.showNotification(message, 1500);
    }
    
    /**
     * 顯示遊戲結果
     * @param {Object} result 結果數據
     */
    showGameResult(result) {
        // 設置結果數據
        const difficultyNames = {
            easy: '初級',
            medium: '中級',
            hard: '高級'
        };
        
        this.resultElements.difficulty.textContent = difficultyNames[result.difficulty];
        this.resultElements.score.textContent = result.score;
        this.resultElements.accuracy.textContent = result.accuracy;
        this.resultElements.time.textContent = MahjongGame.formatTime(result.timeSpent);
        
        // 顯示結果屏幕
        this.showScreen('result');
    }
    
    /**
     * 顯示排行榜
     * @param {string} difficulty 難度
     */
    showRankings(difficulty) {
        const rankings = Game.getRankings(difficulty);
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        
        if (rankings.length === 0) {
            rankingList.innerHTML = '<div class="no-rankings">暫無記錄</div>';
            return;
        }
        
        // 創建每個排行項
        rankings.forEach((ranking, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.className = 'ranking-item';
            
            // 格式化日期
            const date = new Date(ranking.date);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            
            rankingItem.innerHTML = `
                <div class="ranking-position">${index + 1}</div>
                <div class="ranking-info">
                    <div>${formattedDate}</div>
                    <div>正確率: ${ranking.accuracy}% | 用時: ${MahjongGame.formatTime(ranking.time)}</div>
                </div>
                <div class="ranking-score">${ranking.score}</div>
            `;
            
            rankingList.appendChild(rankingItem);
        });
    }
    
    /**
     * 打亂數組
     * @param {Array} array 要打亂的數組
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// 創建UI實例
const UI = new MahjongUI(); 