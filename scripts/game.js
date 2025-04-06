/**
 * 麻將聽牌練習遊戲核心邏輯
 * 負責管理遊戲狀態、計分系統、計時器和難度設定
 */

class Game {
    constructor() {
        this.score = 0;
        this.timer = null;
        this.timeLeft = 0;
        this.difficulty = 'beginner';
        this.correctAnswers = 0; // 記錄連續答對題數
        this.currentHand = null;
        this.currentAnswers = [];
        this.selectedTiles = [];
        this.isGameActive = false;
        this.needConfirmation = false; // 控制是否需要確認
        this.playerName = ''; // 儲存玩家名稱
    }

    startGame(difficulty, playerName) {
        this.stopGame();
        this.difficulty = difficulty;
        this.playerName = playerName || '訪客'; // 如果沒有提供名稱，設為"訪客"
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedTiles = [];
        this.isGameActive = true;
        
        // 統一設定初始時間為60秒
        this.timeLeft = 60;
        
        // 根據難度設定確認模式
        switch (difficulty) {
            case 'beginner':
                this.needConfirmation = false;
                break;
            case 'intermediate':
            case 'advanced':
                this.needConfirmation = true;
                break;
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            UI.updateTimerDisplay(this.timeLeft);
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        this.generateNewQuestion();
        UI.updateScoreDisplay(this.score);
        UI.updateTimerDisplay(this.timeLeft);
        UI.showGameInterface();
    }

    stopGame() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isGameActive = false;
    }

    endGame() {
        this.stopGame();
        const leaderboard = this.getLeaderboard();
        leaderboard.push({
            name: this.playerName,
            score: this.score,
            date: new Date().toLocaleDateString(),
            difficulty: this.difficulty
        });
        
        // 排序並只保留前10名
        leaderboard.sort((a, b) => b.score - a.score);
        if (leaderboard.length > 10) {
            leaderboard.length = 10;
        }
        
        localStorage.setItem('mahjong_leaderboard', JSON.stringify(leaderboard));
        UI.showGameOver(this.score, leaderboard);
    }

    getLeaderboard() {
        const leaderboardData = localStorage.getItem('mahjong_leaderboard');
        return leaderboardData ? JSON.parse(leaderboardData) : [];
    }

    generateNewQuestion() {
        // 生成新的手牌和聽牌組合
        const handData = TileGenerator.generateHandWithWaitingTiles(this.difficulty);
        this.currentHand = handData.hand;
        this.currentAnswers = handData.waitingTiles;
        this.selectedTiles = [];
        
        // 排序手牌（只在低級模式下）
        if (this.difficulty === 'beginner') {
            // 分類牌，字牌優先級最低
            const sortOrder = {
                'character': 0,
                'dots': 1,
                'bamboo': 2,
                'honor': 3
            };
            
            this.currentHand.sort((a, b) => {
                // 先按照套牌類型排序
                if (sortOrder[a.suit] !== sortOrder[b.suit]) {
                    return sortOrder[a.suit] - sortOrder[b.suit];
                }
                
                // 同套牌內按數字排序
                if (a.suit === 'honor') {
                    // 字牌按照東南西北中發白順序
                    const honorOrder = {
                        'east': 0, 'south': 1, 'west': 2, 'north': 3,
                        'red': 4, 'green': 5, 'white': 6
                    };
                    return honorOrder[a.value] - honorOrder[b.value];
                } else {
                    // 數字牌按數字大小排序
                    return parseInt(a.value) - parseInt(b.value);
                }
            });
        }
        
        UI.displayHand(this.currentHand);
        UI.setupAnswerOptions(this.difficulty, this.currentAnswers, this.needConfirmation);
    }

    selectTile(tileId) {
        if (!this.isGameActive) return;
        
        // 根據難度處理選擇
        if (this.difficulty === 'beginner') {
            this.checkAnswer([tileId]);
        } else {
            // 中級和高級模式需要確認
            const index = this.selectedTiles.indexOf(tileId);
            if (index === -1) {
                this.selectedTiles.push(tileId);
            } else {
                this.selectedTiles.splice(index, 1);
            }
            UI.updateSelectedTiles(this.selectedTiles);
        }
    }
    
    confirmAnswer() {
        if (!this.isGameActive || !this.needConfirmation) return;
        this.checkAnswer(this.selectedTiles);
    }

    checkAnswer(selectedTileIds) {
        if (!this.isGameActive) return;
        
        let isCorrect = false;
        let score = 0;
        
        switch (this.difficulty) {
            case 'beginner':
                // 初級模式只需一個答案正確
                isCorrect = this.currentAnswers.some(answer => answer.id === selectedTileIds[0]);
                score = isCorrect ? 100 : 0;
                break;
                
            case 'intermediate':
                // 中級模式只需一個答案且必須完全匹配
                isCorrect = this.currentAnswers.some(answer => answer.id === selectedTileIds[0]);
                score = isCorrect ? 200 : 0;
                break;
                
            case 'advanced':
                // 高級模式可能有多個正確答案，每個正確答案得分
                const correctSelections = selectedTileIds.filter(id => 
                    this.currentAnswers.some(answer => answer.id === id)
                );
                
                const incorrectSelections = selectedTileIds.filter(id => 
                    !this.currentAnswers.some(answer => answer.id === id)
                );
                
                // 每個正確答案100分，但如有錯誤則總分為0
                isCorrect = correctSelections.length > 0 && incorrectSelections.length === 0;
                score = isCorrect ? correctSelections.length * 100 : 0;
                break;
        }
        
        // 更新分數
        if (isCorrect) {
            this.score += score;
            this.correctAnswers++;
            
            // 增加時間（答對10題後每題只加5秒）
            const timeBonus = this.correctAnswers <= 10 ? 10 : 5;
            this.timeLeft += timeBonus;
            
            UI.updateScoreDisplay(this.score);
            UI.updateTimerDisplay(this.timeLeft);
            UI.showFeedback(true, `正確！得分 +${score}，時間 +${timeBonus}秒`);
        } else {
            this.correctAnswers = 0; // 重置連續答對題數
            UI.showFeedback(false, '錯誤！正確答案是: ' + 
                this.currentAnswers.map(tile => `${tile.suit} ${tile.value}`).join(', '));
        }
        
        // 繼續生成新題目
        setTimeout(() => {
            if (this.isGameActive) {
                this.generateNewQuestion();
            }
        }, 1500);
    }
}

// 不在此處創建全局Game實例，而是在UI初始化時創建 