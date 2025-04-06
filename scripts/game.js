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
    }

    /**
     * 開始新遊戲
     * @param {string} difficulty 難度: 'easy', 'medium', 'hard'
     * @param {Function} onTimerUpdate 計時器更新回調
     * @param {Function} onGameEnd 遊戲結束回調
     */
    startGame(difficulty, onTimerUpdate, onGameEnd) {
        // 重置遊戲狀態
        this.reset();

        // 設定遊戲參數
        this.currentDifficulty = difficulty;
        this.currentSettings = this.difficultySettings[difficulty];
        this.totalQuestions = this.currentSettings.questionsCount;
        this.timeRemaining = this.currentSettings.timeLimit;
        this.onTimerUpdate = onTimerUpdate;
        this.onGameEnd = onGameEnd;
        this.isGameActive = true;
        this.gameStartTime = new Date();

        // 生成第一個問題
        this.generateNewQuestion();

        // 啟動計時器
        this.startTimer();

        return {
            timeLimit: this.timeRemaining,
            totalQuestions: this.totalQuestions,
            currentQuestion: this.currentQuestion + 1, // 對用戶顯示從1開始
            puzzle: this.currentPuzzle
        };
    }

    /**
     * 啟動計時器
     */
    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            // 更新UI
            if (this.onTimerUpdate) {
                this.onTimerUpdate(this.timeRemaining);
            }
            
            // 檢查遊戲是否結束
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    /**
     * 生成新的問題
     */
    generateNewQuestion() {
        // 增加當前問題計數
        this.currentQuestion++;
        
        // 生成新的牌型
        this.currentPuzzle = MahjongTiles.generatePuzzle(this.currentDifficulty);
        
        return {
            currentQuestion: this.currentQuestion,
            totalQuestions: this.totalQuestions,
            puzzle: this.currentPuzzle
        };
    }

    /**
     * 檢查答案是否正確
     * @param {Object} selectedTile 選擇的牌
     * @returns {Object} 結果
     */
    checkAnswer(selectedTile) {
        if (!this.isGameActive) {
            return { isCorrect: false, message: '遊戲尚未開始' };
        }

        // 檢查選擇的牌是否在聽牌列表中
        const isCorrect = this.currentPuzzle.waitingTiles.some(
            tile => tile.id === selectedTile.id
        );
        
        // 計算得分
        if (isCorrect) {
            this.correctAnswers++;
            
            // 高級難度按正確答案數量計分
            if (this.currentDifficulty === 'hard') {
                // 如果是第一次點擊這個正確答案，才加分
                if (!this.currentCorrectTiles) {
                    this.currentCorrectTiles = new Set();
                }
                
                if (!this.currentCorrectTiles.has(selectedTile.id)) {
                    this.currentCorrectTiles.add(selectedTile.id);
                    this.score += this.currentSettings.baseScore;
                }
            } else {
                // 初級和中級難度固定分數
                this.score += this.currentSettings.baseScore;
            }
        }
        
        let message;
        if (isCorrect) {
            message = '答對了！';
            
            // 高級難度提示還有其他正確答案
            if (this.currentDifficulty === 'hard' && 
                this.currentCorrectTiles.size < this.currentPuzzle.waitingTiles.length) {
                message += `還有 ${this.currentPuzzle.waitingTiles.length - this.currentCorrectTiles.size} 個答案未找到`;
            }
        } else {
            message = '答錯了，正確答案是: ' + 
                this.currentPuzzle.waitingTiles.map(t => t.display).join('、');
        }
        
        // 判斷是否需要進入下一題或結束遊戲
        let shouldEndGame = false;
        let nextQuestion = null;
        let shouldShowNextQuestion = false;
        
        // 高級難度需要找出所有正確答案或點擊錯誤才進入下一題
        if (this.currentDifficulty === 'hard') {
            if (!isCorrect || (this.currentCorrectTiles && 
                this.currentCorrectTiles.size >= this.currentPuzzle.waitingTiles.length)) {
                shouldShowNextQuestion = true;
            }
        } else {
            // 初級和中級只要回答就進入下一題
            shouldShowNextQuestion = true;
        }
        
        if (shouldShowNextQuestion) {
            if (this.currentQuestion >= this.totalQuestions) {
                shouldEndGame = true;
            } else {
                // 重置當前已選擇的正確牌
                this.currentCorrectTiles = new Set();
                nextQuestion = this.generateNewQuestion();
            }
        }
        
        if (shouldEndGame) {
            this.endGame();
        }
        
        return {
            isCorrect,
            message,
            score: this.score,
            nextQuestion,
            shouldEndGame,
            shouldShowNextQuestion
        };
    }

    /**
     * 結束遊戲
     */
    endGame() {
        if (!this.isGameActive) {
            return;
        }
        
        // 停止計時器
        clearInterval(this.timer);
        this.isGameActive = false;
        this.gameEndTime = new Date();
        
        // 計算遊戲時間
        const gameTimeInSeconds = Math.floor((this.gameEndTime - this.gameStartTime) / 1000);
        
        // 計算最終分數：剩餘時間獎勵 + 難度獎勵
        const timeBonus = this.timeRemaining * this.currentSettings.timeBonus;
        const finalScore = Math.floor((this.score + timeBonus) * this.currentSettings.difficultyMultiplier);
        this.score = finalScore;
        
        // 計算正確率
        const accuracy = (this.correctAnswers / this.totalQuestions) * 100;
        
        // 保存分數到排行榜
        this.saveScore({
            score: this.score,
            accuracy: Math.round(accuracy),
            difficulty: this.currentDifficulty,
            date: new Date().toISOString(),
            time: gameTimeInSeconds
        });
        
        // 觸發結束回調
        if (this.onGameEnd) {
            this.onGameEnd({
                score: this.score,
                accuracy: Math.round(accuracy),
                correctAnswers: this.correctAnswers,
                totalQuestions: this.totalQuestions,
                timeSpent: gameTimeInSeconds,
                difficulty: this.currentDifficulty
            });
        }
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