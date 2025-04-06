/**
 * 麻將聽牌練習遊戲核心邏輯
 * 負責管理遊戲狀態、計分系統、計時器和難度設定
 */

class MahjongGame {
    constructor() {
        // 遊戲設定
        this.difficultySettings = {
            easy: {
                timeLimit: 60, // 秒
                questionsCount: 10,
                baseScore: 100,  // 每題100分
                timeBonus: 2,  // 每剩餘1秒獎勵2分
                difficultyMultiplier: 1,
                optionsCount: 5,  // 初級只顯示5個選項
                maxWaitingTiles: 1  // 初級只有一個正確答案
            },
            medium: {
                timeLimit: 45,
                questionsCount: 10,
                baseScore: 200,  // 每題200分
                timeBonus: 3,
                difficultyMultiplier: 1,
                optionsCount: 0,  // 0表示顯示所有選項
                maxWaitingTiles: 1  // 中級只有一個正確答案
            },
            hard: {
                timeLimit: 30,
                questionsCount: 10,
                baseScore: 100,  // 每個正確答案100分
                timeBonus: 5,
                difficultyMultiplier: 1,
                optionsCount: 0,  // 0表示顯示所有選項
                maxWaitingTiles: 0  // 0表示不限制等待牌數量
            }
        };

        // 初始化遊戲狀態
        this.reset();
    }

    /**
     * 重置遊戲狀態
     */
    reset() {
        this.currentDifficulty = null;
        this.currentSettings = null;
        this.currentPuzzle = null;
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.correctAnswers = 0;
        this.score = 0;
        this.timeRemaining = 0;
        this.timer = null;
        this.isGameActive = false;
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.onTimerUpdate = null;
        this.onGameEnd = null;
        this.currentCorrectTiles = new Set();
        this.timeLeft = 0;
        this.difficulty = 'beginner';
        this.currentHand = null;
        this.currentAnswers = [];
        this.selectedTiles = [];
        this.needConfirmation = false;
    }

    /**
     * 開始新遊戲
     * @param {string} difficulty 難度: 'easy', 'medium', 'hard'
     * @param {Function} onTimerUpdate 計時器更新回調
     * @param {Function} onGameEnd 遊戲結束回調
     */
    startGame(difficulty, onTimerUpdate, onGameEnd) {
        this.stopGame();
        this.difficulty = difficulty;
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedTiles = [];
        this.isGameActive = true;
        
        // 根據難度設定時間
        switch (difficulty) {
            case 'beginner':
                this.timeLeft = 60;
                this.needConfirmation = false;
                break;
            case 'intermediate':
                this.timeLeft = 45;
                this.needConfirmation = true;
                break;
            case 'advanced':
                this.timeLeft = 30;
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

        return {
            timeLimit: this.timeLeft,
            totalQuestions: this.totalQuestions,
            currentQuestion: this.currentQuestion + 1, // 對用戶顯示從1開始
            puzzle: this.currentPuzzle
        };
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

    /**
     * 儲存分數到排行榜
     * @param {Object} scoreData 分數數據
     */
    saveScore(scoreData) {
        // 從本地存儲獲取現有的排行榜數據
        let rankings = localStorage.getItem('mahjong_rankings');
        if (rankings) {
            rankings = JSON.parse(rankings);
        } else {
            rankings = {
                easy: [],
                medium: [],
                hard: []
            };
        }
        
        // 添加新的分數
        rankings[scoreData.difficulty].push(scoreData);
        
        // 排序分數（從高到低）
        rankings[scoreData.difficulty].sort((a, b) => b.score - a.score);
        
        // 限制每個難度的排行榜項目數量
        const MAX_RANKINGS = 10;
        if (rankings[scoreData.difficulty].length > MAX_RANKINGS) {
            rankings[scoreData.difficulty] = rankings[scoreData.difficulty].slice(0, MAX_RANKINGS);
        }
        
        // 保存到本地存儲
        localStorage.setItem('mahjong_rankings', JSON.stringify(rankings));
    }

    /**
     * 獲取排行榜數據
     * @param {string} difficulty 難度
     * @returns {Array} 排行榜數據
     */
    getRankings(difficulty) {
        let rankings = localStorage.getItem('mahjong_rankings');
        if (rankings) {
            rankings = JSON.parse(rankings);
            return rankings[difficulty] || [];
        }
        return [];
    }

    /**
     * 格式化時間
     * @param {number} seconds 秒數
     * @returns {string} 格式化的時間字符串 (MM:SS)
     */
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
}

// 全局遊戲實例
const Game = new MahjongGame(); 