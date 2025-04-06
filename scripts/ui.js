/**
 * 麻將聽牌練習遊戲UI邏輯
 * 負責處理用戶界面互動、屏幕切換和動畫效果
 */

const UI = {
    // DOM元素引用
    elements: {
        startScreen: null,
        gameScreen: null,
        gameOverScreen: null,
        timerDisplay: null,
        scoreDisplay: null,
        handContainer: null,
        optionsContainer: null,
        difficultySelect: null,
        confirmButton: null,
        feedbackMessage: null,
        playerNameInput: null,
        nameError: null,
        startLeaderboard: null,
        bgMusic: null,
        soundEffects: {
            correct: null,
            wrong: null,
            gameOver: null
        }
    },

    // 初始化UI元素
    init() {
        // 獲取所有需要的DOM元素
        this.elements.startScreen = document.getElementById('start-screen');
        this.elements.gameScreen = document.getElementById('game-screen');
        this.elements.gameOverScreen = document.getElementById('game-over-screen');
        this.elements.timerDisplay = document.getElementById('timer');
        this.elements.scoreDisplay = document.getElementById('score');
        this.elements.handContainer = document.getElementById('hand-container');
        this.elements.optionsContainer = document.getElementById('options-container');
        this.elements.difficultySelect = document.getElementById('difficulty');
        this.elements.confirmButton = document.getElementById('confirm-btn');
        this.elements.feedbackMessage = document.getElementById('feedback-message');
        this.elements.playerNameInput = document.getElementById('player-name');
        this.elements.nameError = document.getElementById('name-error');
        this.elements.startLeaderboard = document.getElementById('start-leaderboard');
        
        // 初始化音樂播放器
        this.elements.bgMusic = document.getElementById('bg-music');
        this.elements.soundEffects.correct = document.getElementById('correct-sound');
        this.elements.soundEffects.wrong = document.getElementById('wrong-sound');
        this.elements.soundEffects.gameOver = document.getElementById('game-over-sound');
        
        // 設置事件監聽器
        document.getElementById('start-btn').addEventListener('click', () => {
            const difficulty = this.elements.difficultySelect.value;
            const playerName = this.elements.playerNameInput.value.trim();
            
            // 驗證玩家名稱
            if (!playerName) {
                this.elements.nameError.style.display = 'block';
                return;
            } else {
                this.elements.nameError.style.display = 'none';
            }
            
            // 創建全局的Game對象，確保它在全局作用域可用
            window.game = new Game();
            game.startGame(difficulty, playerName);
            this.playBackgroundMusic();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.showStartScreen();
        });

        this.elements.confirmButton.addEventListener('click', () => {
            game.confirmAnswer();
        });

        // 初始顯示開始畫面並載入排行榜
        this.showStartScreen();
        this.loadLeaderboard();
    },

    // 載入排行榜資料並顯示在首頁和遊戲結束頁面
    loadLeaderboard() {
        const leaderboardData = localStorage.getItem('mahjong_leaderboard');
        const leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];
        
        // 更新首頁排行榜
        if (this.elements.startLeaderboard) {
            this.updateLeaderboardDisplay(this.elements.startLeaderboard, leaderboard);
        }
    },
    
    // 更新排行榜顯示
    updateLeaderboardDisplay(leaderboardElement, leaderboard) {
        leaderboardElement.innerHTML = '';
        
        if (leaderboard.length === 0) {
            // 如果沒有排行數據，顯示提示信息
            const emptyRow = document.createElement('div');
            emptyRow.className = 'leaderboard-row';
            emptyRow.innerHTML = '<span class="no-data" style="grid-column: 1 / 6; text-align: center;">尚無數據</span>';
            leaderboardElement.appendChild(emptyRow);
            return;
        }
        
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="player">${entry.name || '訪客'}</span>
                <span class="score">${entry.score}</span>
                <span class="difficulty">${this.getDifficultyName(entry.difficulty)}</span>
                <span class="date">${entry.date}</span>
            `;
            leaderboardElement.appendChild(row);
        });
    },

    // 播放背景音樂
    playBackgroundMusic() {
        if (this.elements.bgMusic) {
            this.elements.bgMusic.loop = true;
            this.elements.bgMusic.volume = 0.5;
            this.elements.bgMusic.play().catch(error => {
                console.log('背景音樂播放失敗:', error);
            });
        }
    },

    // 播放音效
    playSound(type) {
        const sound = this.elements.soundEffects[type];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.log(`音效 ${type} 播放失敗:`, error);
            });
        }
    },

    // 停止背景音樂
    stopBackgroundMusic() {
        if (this.elements.bgMusic) {
            this.elements.bgMusic.pause();
            this.elements.bgMusic.currentTime = 0;
        }
    },

    // 顯示開始畫面
    showStartScreen() {
        this.elements.startScreen.style.display = 'block';
        this.elements.gameScreen.style.display = 'none';
        this.elements.gameOverScreen.style.display = 'none';
        this.stopBackgroundMusic();
        this.loadLeaderboard(); // 重新載入排行榜
    },

    // 顯示遊戲界面
    showGameInterface() {
        this.elements.startScreen.style.display = 'none';
        this.elements.gameScreen.style.display = 'block';
        this.elements.gameOverScreen.style.display = 'none';
    },

    // 顯示遊戲結束畫面
    showGameOver(score, leaderboard) {
        this.elements.startScreen.style.display = 'none';
        this.elements.gameScreen.style.display = 'none';
        this.elements.gameOverScreen.style.display = 'block';
        this.playSound('gameOver');
        this.stopBackgroundMusic();

        // 顯示最終分數
        document.getElementById('final-score').textContent = score;

        // 更新排行榜
        const leaderboardElement = document.getElementById('leaderboard');
        this.updateLeaderboardDisplay(leaderboardElement, leaderboard);
    },

    // 獲取難度名稱
    getDifficultyName(difficulty) {
        switch (difficulty) {
            case 'beginner': return '初級';
            case 'intermediate': return '中級';
            case 'advanced': return '高級';
            default: return difficulty;
        }
    },

    // 更新計時器顯示
    updateTimerDisplay(timeLeft) {
        this.elements.timerDisplay.textContent = timeLeft;
    },

    // 更新分數顯示
    updateScoreDisplay(score) {
        this.elements.scoreDisplay.textContent = score;
    },

    // 顯示手牌
    displayHand(hand) {
        const container = this.elements.handContainer;
        container.innerHTML = '';

        // 添加說明文字
        const heading = document.createElement('div');
        heading.className = 'hand-heading';
        heading.textContent = '請判斷此香港麻將手牌（14張胡牌）缺少哪張牌可以聽牌:';
        container.appendChild(heading);

        // 創建牌組容器（單行顯示）
        const tilesContainer = document.createElement('div');
        tilesContainer.className = 'tiles-container';
        
        // 添加所有手牌
        hand.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            tileElement.dataset.id = tile.id;
            
            // 直接使用圖片而不進行檢查 - 因為我們確認圖片存在
            const tilePath = `images/tiles/${tile.id}.png`;
            tileElement.innerHTML = `<img src="${tilePath}" alt="${tile.suit} ${tile.value}">`;
            
            tilesContainer.appendChild(tileElement);
        });
        
        container.appendChild(tilesContainer);
    },

    // 設置答案選項
    setupAnswerOptions(difficulty, correctAnswers, needConfirmation) {
        const container = this.elements.optionsContainer;
        container.innerHTML = '';
        
        // 顯示或隱藏確認按鈕
        if (needConfirmation) {
            this.elements.confirmButton.style.display = 'block';
        } else {
            this.elements.confirmButton.style.display = 'none';
        }
        
        // 根據難度級別生成選項
        if (difficulty === 'beginner') {
            // 初級模式：只顯示5個選項，包含1個正確答案
            const allOptions = TileGenerator.generateBeginnerOptions(correctAnswers[0]);
            
            allOptions.forEach(tile => {
                const option = document.createElement('div');
                option.className = 'option-tile';
                option.dataset.id = tile.id;
                
                // 直接使用圖片
                const tilePath = `images/tiles/${tile.id}.png`;
                option.innerHTML = `<img src="${tilePath}" alt="${tile.suit} ${tile.value}">`;
                
                option.addEventListener('click', () => {
                    game.selectTile(tile.id);
                });
                
                container.appendChild(option);
            });
        } else {
            // 中級和高級模式：顯示所有牌型
            const allTiles = TileGenerator.getAllTiles();
            
            allTiles.forEach(tile => {
                const option = document.createElement('div');
                option.className = 'option-tile';
                option.dataset.id = tile.id;
                
                // 直接使用圖片
                const tilePath = `images/tiles/${tile.id}.png`;
                option.innerHTML = `<img src="${tilePath}" alt="${tile.suit} ${tile.value}">`;
                
                option.addEventListener('click', () => {
                    game.selectTile(tile.id);
                    option.classList.toggle('selected');
                });
                
                container.appendChild(option);
            });
        }
    },

    // 更新已選擇的牌
    updateSelectedTiles(selectedTiles) {
        // 移除所有選中狀態
        const options = this.elements.optionsContainer.querySelectorAll('.option-tile');
        options.forEach(option => {
            if (selectedTiles.includes(option.dataset.id)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    },

    // 顯示反饋訊息
    showFeedback(isCorrect, message) {
        const feedback = this.elements.feedbackMessage;
        feedback.textContent = message;
        feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
        feedback.style.display = 'block';
        
        // 播放音效
        this.playSound(isCorrect ? 'correct' : 'wrong');
        
        // 3秒後隱藏反饋訊息
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 1500);
    },

    // 格式化麻將牌顯示
    formatTile(tile) {
        if (tile.suit === 'honor') {
            // 字牌顯示
            switch (tile.value) {
                case 'east': return '東';
                case 'south': return '南';
                case 'west': return '西';
                case 'north': return '北';
                case 'red': return '中';
                case 'green': return '發';
                case 'white': return '白';
                default: return tile.value;
            }
        } else {
            // 數字牌顯示
            switch (tile.suit) {
                case 'character': return `${tile.value}萬`;
                case 'dots': return `${tile.value}筒`;
                case 'bamboo': return `${tile.value}條`;
                default: return `${tile.value}${tile.suit}`;
            }
        }
    }
};

// 當DOM加載完成後初始化UI
document.addEventListener('DOMContentLoaded', function() {
    UI.init();
}); 