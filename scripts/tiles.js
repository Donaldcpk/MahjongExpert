/**
 * 麻將牌資料結構與定義
 * 定義麻將牌的類型、數值，以及聽牌計算邏輯
 */

// 麻將牌類型
const TILE_TYPES = {
    DOTS: '筒',     // 筒子
    BAMBOO: '條',   // 條子
    CHARACTER: '萬', // 萬子
    HONOR: '字'      // 字牌 (風牌和三元牌)
};

// 麻將牌數值
const TILE_VALUES = {
    // 數牌 (1-9)
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4', 
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    
    // 風牌
    EAST: '東',
    SOUTH: '南',
    WEST: '西',
    NORTH: '北',
    
    // 三元牌
    RED: '中',
    GREEN: '發',
    WHITE: '白'
};

// 所有麻將牌的定義
const ALL_TILES = [
    // 筒子 1-9
    { id: 'dots_1', type: TILE_TYPES.DOTS, value: TILE_VALUES.ONE, display: '一筒', image: 'images/tiles/dots_1.png' },
    { id: 'dots_2', type: TILE_TYPES.DOTS, value: TILE_VALUES.TWO, display: '二筒', image: 'images/tiles/dots_2.png' },
    { id: 'dots_3', type: TILE_TYPES.DOTS, value: TILE_VALUES.THREE, display: '三筒', image: 'images/tiles/dots_3.png' },
    { id: 'dots_4', type: TILE_TYPES.DOTS, value: TILE_VALUES.FOUR, display: '四筒', image: 'images/tiles/dots_4.png' },
    { id: 'dots_5', type: TILE_TYPES.DOTS, value: TILE_VALUES.FIVE, display: '五筒', image: 'images/tiles/dots_5.png' },
    { id: 'dots_6', type: TILE_TYPES.DOTS, value: TILE_VALUES.SIX, display: '六筒', image: 'images/tiles/dots_6.png' },
    { id: 'dots_7', type: TILE_TYPES.DOTS, value: TILE_VALUES.SEVEN, display: '七筒', image: 'images/tiles/dots_7.png' },
    { id: 'dots_8', type: TILE_TYPES.DOTS, value: TILE_VALUES.EIGHT, display: '八筒', image: 'images/tiles/dots_8.png' },
    { id: 'dots_9', type: TILE_TYPES.DOTS, value: TILE_VALUES.NINE, display: '九筒', image: 'images/tiles/dots_9.png' },
    
    // 條子 1-9
    { id: 'bamboo_1', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.ONE, display: '一條', image: 'images/tiles/bamboo_1.png' },
    { id: 'bamboo_2', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.TWO, display: '二條', image: 'images/tiles/bamboo_2.png' },
    { id: 'bamboo_3', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.THREE, display: '三條', image: 'images/tiles/bamboo_3.png' },
    { id: 'bamboo_4', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.FOUR, display: '四條', image: 'images/tiles/bamboo_4.png' },
    { id: 'bamboo_5', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.FIVE, display: '五條', image: 'images/tiles/bamboo_5.png' },
    { id: 'bamboo_6', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.SIX, display: '六條', image: 'images/tiles/bamboo_6.png' },
    { id: 'bamboo_7', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.SEVEN, display: '七條', image: 'images/tiles/bamboo_7.png' },
    { id: 'bamboo_8', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.EIGHT, display: '八條', image: 'images/tiles/bamboo_8.png' },
    { id: 'bamboo_9', type: TILE_TYPES.BAMBOO, value: TILE_VALUES.NINE, display: '九條', image: 'images/tiles/bamboo_9.png' },
    
    // 萬子 1-9
    { id: 'character_1', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.ONE, display: '一萬', image: 'images/tiles/character_1.png' },
    { id: 'character_2', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.TWO, display: '二萬', image: 'images/tiles/character_2.png' },
    { id: 'character_3', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.THREE, display: '三萬', image: 'images/tiles/character_3.png' },
    { id: 'character_4', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.FOUR, display: '四萬', image: 'images/tiles/character_4.png' },
    { id: 'character_5', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.FIVE, display: '五萬', image: 'images/tiles/character_5.png' },
    { id: 'character_6', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.SIX, display: '六萬', image: 'images/tiles/character_6.png' },
    { id: 'character_7', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.SEVEN, display: '七萬', image: 'images/tiles/character_7.png' },
    { id: 'character_8', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.EIGHT, display: '八萬', image: 'images/tiles/character_8.png' },
    { id: 'character_9', type: TILE_TYPES.CHARACTER, value: TILE_VALUES.NINE, display: '九萬', image: 'images/tiles/character_9.png' },
    
    // 風牌
    { id: 'honor_east', type: TILE_TYPES.HONOR, value: TILE_VALUES.EAST, display: '東風', image: 'images/tiles/honor_east.png' },
    { id: 'honor_south', type: TILE_TYPES.HONOR, value: TILE_VALUES.SOUTH, display: '南風', image: 'images/tiles/honor_south.png' },
    { id: 'honor_west', type: TILE_TYPES.HONOR, value: TILE_VALUES.WEST, display: '西風', image: 'images/tiles/honor_west.png' },
    { id: 'honor_north', type: TILE_TYPES.HONOR, value: TILE_VALUES.NORTH, display: '北風', image: 'images/tiles/honor_north.png' },
    
    // 三元牌
    { id: 'honor_red', type: TILE_TYPES.HONOR, value: TILE_VALUES.RED, display: '紅中', image: 'images/tiles/honor_red.png' },
    { id: 'honor_green', type: TILE_TYPES.HONOR, value: TILE_VALUES.GREEN, display: '發財', image: 'images/tiles/honor_green.png' },
    { id: 'honor_white', type: TILE_TYPES.HONOR, value: TILE_VALUES.WHITE, display: '白板', image: 'images/tiles/honor_white.png' },
];

/**
 * 獲取麻將牌物件根據ID
 * @param {string} id 麻將牌ID
 * @returns {Object} 麻將牌物件
 */
function getTileById(id) {
    return ALL_TILES.find(tile => tile.id === id);
}

/**
 * 獲取數牌相鄰的牌
 * @param {Object} tile 麻將牌物件
 * @returns {Array} 相鄰的牌物件陣列 (可能為1-2張)
 */
function getAdjacentTiles(tile) {
    // 如果不是數牌，返回空數組
    if (tile.type === TILE_TYPES.HONOR) {
        return [];
    }
    
    const adjacentTiles = [];
    const valueNum = parseInt(tile.value);
    
    // 左邊鄰牌 (如果數值大於1)
    if (valueNum > 1) {
        adjacentTiles.push(ALL_TILES.find(t => 
            t.type === tile.type && t.value === String(valueNum - 1)
        ));
    }
    
    // 右邊鄰牌 (如果數值小於9)
    if (valueNum < 9) {
        adjacentTiles.push(ALL_TILES.find(t => 
            t.type === tile.type && t.value === String(valueNum + 1)
        ));
    }
    
    return adjacentTiles;
}

/**
 * 獲取兩個數差距為1的牌之間的中間牌
 * @param {Object} tile1 麻將牌物件1
 * @param {Object} tile2 麻將牌物件2
 * @returns {Object|null} 中間的牌或null
 */
function getMiddleTile(tile1, tile2) {
    // 如果不是相同類型的數牌，返回null
    if (tile1.type !== tile2.type || tile1.type === TILE_TYPES.HONOR) {
        return null;
    }
    
    const value1 = parseInt(tile1.value);
    const value2 = parseInt(tile2.value);
    
    // 如果兩個牌差距為2，返回中間的牌
    if (Math.abs(value1 - value2) === 2) {
        const middleValue = Math.min(value1, value2) + 1;
        return ALL_TILES.find(t => 
            t.type === tile1.type && t.value === String(middleValue)
        );
    }
    
    return null;
}

/**
 * 計算一組牌中每種牌的出現次數
 * @param {Array} tiles 牌組
 * @returns {Object} 每種牌的出現次數
 */
function countTiles(tiles) {
    const counts = {};
    
    for (const tile of tiles) {
        if (counts[tile.id]) {
            counts[tile.id].count++;
        } else {
            counts[tile.id] = {
                tile: tile,
                count: 1
            };
        }
    }
    
    return counts;
}

/**
 * 檢查是否符合聽牌條件
 * @param {Array} tiles 麻將牌組
 * @returns {Array} 聽的牌的數組
 */
function getWaitingTiles(tiles) {
    // 一般情況下要聽牌，手牌應該是13張
    if (tiles.length !== 13) {
        return [];
    }
    
    const waitingTiles = [];
    
    // 嘗試每個可能的牌，看是否能和牌
    for (const testTile of ALL_TILES) {
        // 添加測試牌形成14張牌
        const testHand = [...tiles, testTile];
        
        // 檢查是否能和牌
        if (canWin(testHand)) {
            waitingTiles.push(testTile);
        }
    }
    
    return waitingTiles;
}

/**
 * 判斷一組牌是否能和牌(胡牌)
 * 麻將和牌標準形式：n個順子(或刻子) + 1個對子
 * @param {Array} tiles 14張麻將牌
 * @returns {boolean} 是否能和牌
 */
function canWin(tiles) {
    if (tiles.length !== 14) {
        return false;
    }
    
    // 計算每種牌的數量
    const tileCounts = countTiles(tiles);
    const tilesInfo = Object.values(tileCounts);
    
    // 嘗試每個可能的對子
    for (const pairInfo of tilesInfo) {
        // 如果沒有至少2張相同的牌，跳過
        if (pairInfo.count < 2) {
            continue;
        }
        
        // 將這個對子取出
        const pairTile = pairInfo.tile;
        const remainingTiles = [...tiles];
        // 移除2張作為對子
        remainingTiles.splice(remainingTiles.findIndex(t => t.id === pairTile.id), 1);
        remainingTiles.splice(remainingTiles.findIndex(t => t.id === pairTile.id), 1);
        
        // 檢查剩下的牌是否都能形成順子或刻子
        if (canFormAllSetsAndTriples(remainingTiles)) {
            return true;
        }
    }
    
    return false;
}

/**
 * 檢查剩餘的牌是否都能形成順子或刻子
 * @param {Array} tiles 麻將牌組
 * @returns {boolean} 是否都能形成順子或刻子
 */
function canFormAllSetsAndTriples(tiles) {
    if (tiles.length === 0) {
        return true; // 沒有牌了，說明都成功組合了
    }
    
    if (tiles.length % 3 !== 0) {
        return false; // 如果牌數不是3的倍數，無法全部組成順子或刻子
    }
    
    // 嘗試從剩餘牌中找出一個刻子(3張相同的牌)
    const tileCounts = countTiles(tiles);
    
    for (const tileInfo of Object.values(tileCounts)) {
        // 檢查是否能形成刻子(3張相同的牌)
        if (tileInfo.count >= 3) {
            const tripleType = tileInfo.tile;
            const remainingTiles = [...tiles];
            
            // 移除3張牌作為刻子
            for (let i = 0; i < 3; i++) {
                const index = remainingTiles.findIndex(t => t.id === tripleType.id);
                remainingTiles.splice(index, 1);
            }
            
            // 遞迴檢查剩餘的牌
            if (canFormAllSetsAndTriples(remainingTiles)) {
                return true;
            }
        }
        
        // 檢查是否能形成順子(3張連續的牌)
        // 只對數牌進行檢查，不對字牌檢查
        if (tileInfo.tile.type !== TILE_TYPES.HONOR) {
            const tile1 = tileInfo.tile;
            const value1 = parseInt(tile1.value);
            
            // 檢查所有可能的順子組合
            // 情況1: 當前牌作為順子的第一張 (例如: 1-2-3)
            if (value1 <= 7) {
                const tile2Id = tile1.id.replace(/\d+/, value1 + 1);
                const tile3Id = tile1.id.replace(/\d+/, value1 + 2);
                
                // 檢查是否有後兩張牌
                const hasSecond = tiles.some(t => t.id === tile2Id);
                const hasThird = tiles.some(t => t.id === tile3Id);
                
                if (hasSecond && hasThird) {
                    const remainingTiles = [...tiles];
                    
                    // 移除這個順子
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile1.id), 1);
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile2Id), 1);
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile3Id), 1);
                    
                    // 遞迴檢查剩餘的牌
                    if (canFormAllSetsAndTriples(remainingTiles)) {
                        return true;
                    }
                }
            }
            
            // 情況2: 當前牌作為順子的中間牌 (例如: 2-3-4，當前牌是3)
            if (value1 >= 2 && value1 <= 8) {
                const tile1Id = tile1.id.replace(/\d+/, value1 - 1);
                const tile3Id = tile1.id.replace(/\d+/, value1 + 1);
                
                // 檢查是否有另外兩張牌
                const hasFirst = tiles.some(t => t.id === tile1Id);
                const hasThird = tiles.some(t => t.id === tile3Id);
                
                if (hasFirst && hasThird) {
                    const remainingTiles = [...tiles];
                    
                    // 移除這個順子
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile1Id), 1);
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile1.id), 1);
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile3Id), 1);
                    
                    // 遞迴檢查剩餘的牌
                    if (canFormAllSetsAndTriples(remainingTiles)) {
                        return true;
                    }
                }
            }
            
            // 情況3: 當前牌作為順子的最後一張 (例如: 3-4-5，當前牌是5)
            if (value1 >= 3 && value1 <= 9) {
                const tile1Id = tile1.id.replace(/\d+/, value1 - 2);
                const tile2Id = tile1.id.replace(/\d+/, value1 - 1);
                
                // 檢查是否有前兩張牌
                const hasFirst = tiles.some(t => t.id === tile1Id);
                const hasSecond = tiles.some(t => t.id === tile2Id);
                
                if (hasFirst && hasSecond) {
                    const remainingTiles = [...tiles];
                    
                    // 移除這個順子
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile1Id), 1);
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile2Id), 1);
                    remainingTiles.splice(remainingTiles.findIndex(t => t.id === tile1.id), 1);
                    
                    // 遞迴檢查剩餘的牌
                    if (canFormAllSetsAndTriples(remainingTiles)) {
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}

/**
 * 生成遊戲難度相應的牌型
 * @param {string} difficulty 難度: 'easy', 'medium', 'hard'
 * @returns {Object} 包含當前牌和聽牌的物件
 */
function generatePuzzle(difficulty) {
    // 不同難度的特徵
    const difficultySettings = {
        easy: {
            maxTypes: 2,       // 最多使用2種花色
            includeHonors: false,  // 不使用字牌
            maxWaitingTiles: 1,    // 只有一個正確答案
            minWaitingTiles: 1     // 至少有一個正確答案
        },
        medium: {
            maxTypes: 3,       // 最多使用3種花色
            includeHonors: true,   // 可以使用字牌
            maxWaitingTiles: 1,    // 只有一個正確答案
            minWaitingTiles: 1     // 至少有一個正確答案
        },
        hard: {
            maxTypes: 3,           // 使用全部3種花色
            includeHonors: true,   // 可以使用字牌
            maxWaitingTiles: 6,    // 最多能聽6張牌
            minWaitingTiles: 2     // 至少要有2個正確答案
        }
    };
    
    const settings = difficultySettings[difficulty];
    let puzzle = null;
    
    // 持續嘗試生成符合條件的牌型
    while (!puzzle) {
        const generated = tryGeneratePuzzle(settings);
        if (generated && isValidDifficulty(generated, settings)) {
            puzzle = generated;
        }
    }
    
    return puzzle;
}

/**
 * 嘗試生成一個牌型
 * @param {Object} settings 設定參數
 * @returns {Object|null} 生成的牌型或null
 */
function tryGeneratePuzzle(settings) {
    // 隨機選擇使用的牌型
    const usedTileTypes = [];
    const possibleTypes = [TILE_TYPES.DOTS, TILE_TYPES.BAMBOO, TILE_TYPES.CHARACTER];
    
    // 隨機打亂花色順序
    shuffleArray(possibleTypes);
    
    // 選擇使用的花色數量
    const typeCount = Math.min(settings.maxTypes, Math.floor(Math.random() * settings.maxTypes) + 1);
    
    for (let i = 0; i < typeCount; i++) {
        usedTileTypes.push(possibleTypes[i]);
    }
    
    // 如果允許使用字牌，有50%概率添加
    if (settings.includeHonors && Math.random() > 0.5) {
        usedTileTypes.push(TILE_TYPES.HONOR);
    }
    
    // 從可用的牌型中選擇13張牌
    const availableTiles = ALL_TILES.filter(tile => 
        usedTileTypes.includes(tile.type)
    );
    
    // 準備手牌集合
    const handTiles = [];
    
    // 添加牌直到有13張
    while (handTiles.length < 13) {
        const randomIndex = Math.floor(Math.random() * availableTiles.length);
        const tile = availableTiles[randomIndex];
        
        // 檢查是否已經有4張這樣的牌了
        const sameKindCount = handTiles.filter(t => t.id === tile.id).length;
        if (sameKindCount < 4) {
            handTiles.push(tile);
        }
    }
    
    // 計算聽的牌
    const waitingTiles = getWaitingTiles(handTiles);
    
    // 如果沒有聽牌或聽牌數量不符合難度要求，返回null重新生成
    if (waitingTiles.length < settings.minWaitingTiles || 
        (settings.maxWaitingTiles > 0 && waitingTiles.length > settings.maxWaitingTiles)) {
        return null;
    }
    
    return {
        handTiles: handTiles,       // 當前手牌
        waitingTiles: waitingTiles  // 聽的牌
    };
}

/**
 * 檢查生成的牌型是否符合難度要求
 * @param {Object} puzzle 牌型
 * @param {Object} settings 難度設定
 * @returns {boolean} 是否符合難度
 */
function isValidDifficulty(puzzle, settings) {
    // 檢查聽牌數量是否在範圍內
    return puzzle.waitingTiles.length >= settings.minWaitingTiles && 
           (settings.maxWaitingTiles === 0 || puzzle.waitingTiles.length <= settings.maxWaitingTiles);
}

/**
 * 打亂數組
 * @param {Array} array 要打亂的數組
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * TileGenerator 物件 - 負責生成麻將牌組和聽牌計算
 */
const TileGenerator = {
    /**
     * 獲取所有麻將牌
     * @returns {Array} 所有麻將牌物件的陣列
     */
    getAllTiles() {
        return ALL_TILES.map(tile => {
            return {
                id: tile.id,
                suit: this.getSuitFromId(tile.id),
                value: this.getValueFromId(tile.id),
                display: tile.display
            };
        });
    },

    /**
     * 從ID獲取牌的花色
     * @param {string} id 牌的ID，如 'dots_1', 'honor_east'
     * @returns {string} 花色，如 'dots', 'bamboo', 'character', 'honor'
     */
    getSuitFromId(id) {
        const parts = id.split('_');
        return parts[0];
    },

    /**
     * 從ID獲取牌的數值
     * @param {string} id 牌的ID，如 'dots_1', 'honor_east'
     * @returns {string} 數值，如 '1', '2', 'east', 'red'
     */
    getValueFromId(id) {
        const parts = id.split('_');
        return parts[1];
    },

    /**
     * 生成初級模式的選項（5個選項中包含1個正確答案）
     * @param {Object} correctTile 正確的牌
     * @returns {Array} 五個選項的陣列，包含正確答案
     */
    generateBeginnerOptions(correctTile) {
        // 獲取所有牌
        const allTiles = this.getAllTiles();
        
        // 移除正確答案以避免重複
        const remainingTiles = allTiles.filter(tile => tile.id !== correctTile.id);
        
        // 隨機選取4個錯誤選項
        this.shuffleArray(remainingTiles);
        const wrongOptions = remainingTiles.slice(0, 4);
        
        // 合併選項並隨機排序
        const options = [...wrongOptions, correctTile];
        this.shuffleArray(options);
        
        return options;
    },

    /**
     * 生成手牌和聽牌組合
     * @param {string} difficulty 難度等級
     * @returns {Object} 包含手牌和聽牌的物件
     */
    generateHandWithWaitingTiles(difficulty) {
        // 建立正確的基本型胡牌組合（4組面子+1對將牌）
        const handSets = {
            beginner: [
                // 組合1 - 單花色順子+刻子組合
                {
                    hand: [
                        { id: 'bamboo_1', suit: 'bamboo', value: '1' },
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'bamboo_3', suit: 'bamboo', value: '3' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_7', suit: 'bamboo', value: '7' },
                        { id: 'bamboo_8', suit: 'bamboo', value: '8' },
                        { id: 'bamboo_9', suit: 'bamboo', value: '9' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_2', suit: 'dots', value: '2' }
                    ],
                    waiting: [
                        { id: 'dots_2', suit: 'dots', value: '2' }
                    ]
                },
                // 組合2 - 混合順子等待
                {
                    hand: [
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'bamboo_3', suit: 'bamboo', value: '3' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'character_2', suit: 'character', value: '2' },
                        { id: 'character_3', suit: 'character', value: '3' },
                        { id: 'character_4', suit: 'character', value: '4' },
                        { id: 'dots_5', suit: 'dots', value: '5' },
                        { id: 'dots_5', suit: 'dots', value: '5' },
                        { id: 'dots_5', suit: 'dots', value: '5' },
                        { id: 'dots_7', suit: 'dots', value: '7' },
                        { id: 'dots_7', suit: 'dots', value: '7' },
                        { id: 'dots_7', suit: 'dots', value: '7' },
                        { id: 'dots_3', suit: 'dots', value: '3' }
                    ],
                    waiting: [
                        { id: 'dots_3', suit: 'dots', value: '3' }
                    ]
                },
                // 組合3 - 兩面或邊張等待
                {
                    hand: [
                        { id: 'character_1', suit: 'character', value: '1' },
                        { id: 'character_2', suit: 'character', value: '2' },
                        { id: 'character_3', suit: 'character', value: '3' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'bamboo_1', suit: 'bamboo', value: '1' },
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'bamboo_3', suit: 'bamboo', value: '3' },
                        { id: 'dots_2', suit: 'dots', value: '2' },
                        { id: 'dots_3', suit: 'dots', value: '3' },
                        { id: 'dots_4', suit: 'dots', value: '4' },
                        { id: 'character_7', suit: 'character', value: '7' }
                    ],
                    waiting: [
                        { id: 'character_7', suit: 'character', value: '7' }
                    ]
                }
            ],
            intermediate: [
                // 組合1 - 帶字牌的全刻子組合
                {
                    hand: [
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'honor_east', suit: 'honor', value: 'east' },
                        { id: 'honor_east', suit: 'honor', value: 'east' },
                        { id: 'honor_east', suit: 'honor', value: 'east' },
                        { id: 'honor_west', suit: 'honor', value: 'west' }
                    ],
                    waiting: [
                        { id: 'honor_west', suit: 'honor', value: 'west' }
                    ]
                },
                // 組合2 - 混合字牌和順子
                {
                    hand: [
                        { id: 'dots_3', suit: 'dots', value: '3' },
                        { id: 'dots_4', suit: 'dots', value: '4' },
                        { id: 'dots_5', suit: 'dots', value: '5' },
                        { id: 'bamboo_5', suit: 'bamboo', value: '5' },
                        { id: 'bamboo_6', suit: 'bamboo', value: '6' },
                        { id: 'bamboo_7', suit: 'bamboo', value: '7' },
                        { id: 'character_9', suit: 'character', value: '9' },
                        { id: 'character_9', suit: 'character', value: '9' },
                        { id: 'character_9', suit: 'character', value: '9' },
                        { id: 'honor_south', suit: 'honor', value: 'south' },
                        { id: 'honor_south', suit: 'honor', value: 'south' },
                        { id: 'honor_south', suit: 'honor', value: 'south' },
                        { id: 'honor_green', suit: 'honor', value: 'green' }
                    ],
                    waiting: [
                        { id: 'honor_green', suit: 'honor', value: 'green' }
                    ]
                },
                // 組合3 - 混合順子和刻子
                {
                    hand: [
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_2', suit: 'dots', value: '2' },
                        { id: 'dots_3', suit: 'dots', value: '3' },
                        { id: 'bamboo_3', suit: 'bamboo', value: '3' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_5', suit: 'bamboo', value: '5' },
                        { id: 'character_7', suit: 'character', value: '7' },
                        { id: 'character_7', suit: 'character', value: '7' },
                        { id: 'character_7', suit: 'character', value: '7' },
                        { id: 'honor_north', suit: 'honor', value: 'north' },
                        { id: 'honor_north', suit: 'honor', value: 'north' },
                        { id: 'honor_north', suit: 'honor', value: 'north' },
                        { id: 'honor_red', suit: 'honor', value: 'red' }
                    ],
                    waiting: [
                        { id: 'honor_red', suit: 'honor', value: 'red' }
                    ]
                }
            ],
            advanced: [
                // 組合1 - 清一色，筒子
                {
                    hand: [
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_1', suit: 'dots', value: '1' },
                        { id: 'dots_3', suit: 'dots', value: '3' },
                        { id: 'dots_4', suit: 'dots', value: '4' },
                        { id: 'dots_5', suit: 'dots', value: '5' },
                        { id: 'dots_6', suit: 'dots', value: '6' },
                        { id: 'dots_7', suit: 'dots', value: '7' },
                        { id: 'dots_8', suit: 'dots', value: '8' },
                        { id: 'dots_9', suit: 'dots', value: '9' },
                        { id: 'dots_9', suit: 'dots', value: '9' },
                        { id: 'dots_9', suit: 'dots', value: '9' },
                        { id: 'dots_2', suit: 'dots', value: '2' }
                    ],
                    waiting: [
                        { id: 'dots_2', suit: 'dots', value: '2' }
                    ]
                },
                // 組合2 - 清一色，條子，多聽
                {
                    hand: [
                        { id: 'bamboo_1', suit: 'bamboo', value: '1' },
                        { id: 'bamboo_1', suit: 'bamboo', value: '1' },
                        { id: 'bamboo_2', suit: 'bamboo', value: '2' },
                        { id: 'bamboo_3', suit: 'bamboo', value: '3' },
                        { id: 'bamboo_3', suit: 'bamboo', value: '3' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_5', suit: 'bamboo', value: '5' },
                        { id: 'bamboo_7', suit: 'bamboo', value: '7' },
                        { id: 'bamboo_7', suit: 'bamboo', value: '7' },
                        { id: 'bamboo_7', suit: 'bamboo', value: '7' },
                        { id: 'bamboo_9', suit: 'bamboo', value: '9' },
                        { id: 'bamboo_9', suit: 'bamboo', value: '9' }
                    ],
                    waiting: [
                        { id: 'bamboo_1', suit: 'bamboo', value: '1' },
                        { id: 'bamboo_4', suit: 'bamboo', value: '4' },
                        { id: 'bamboo_6', suit: 'bamboo', value: '6' },
                        { id: 'bamboo_9', suit: 'bamboo', value: '9' }
                    ]
                },
                // 組合3 - 清一色，萬子
                {
                    hand: [
                        { id: 'character_1', suit: 'character', value: '1' },
                        { id: 'character_2', suit: 'character', value: '2' },
                        { id: 'character_3', suit: 'character', value: '3' },
                        { id: 'character_4', suit: 'character', value: '4' },
                        { id: 'character_5', suit: 'character', value: '5' },
                        { id: 'character_6', suit: 'character', value: '6' },
                        { id: 'character_7', suit: 'character', value: '7' },
                        { id: 'character_7', suit: 'character', value: '7' },
                        { id: 'character_7', suit: 'character', value: '7' },
                        { id: 'character_8', suit: 'character', value: '8' },
                        { id: 'character_8', suit: 'character', value: '8' },
                        { id: 'character_8', suit: 'character', value: '8' },
                        { id: 'character_6', suit: 'character', value: '6' }
                    ],
                    waiting: [
                        { id: 'character_6', suit: 'character', value: '6' },
                        { id: 'character_9', suit: 'character', value: '9' }
                    ]
                }
            ]
        };

        // 隨機選擇一個手牌組合
        const sets = handSets[difficulty];
        const randomIndex = Math.floor(Math.random() * sets.length);
        const selectedSet = sets[randomIndex];

        return {
            hand: selectedSet.hand,
            waitingTiles: selectedSet.waiting
        };
    },

    /**
     * 生成聽牌題目
     * @param {string} difficulty 難度等級
     * @param {number} maxWaitingTiles 最大聽牌數量，0表示不限制
     * @returns {Object} 包含手牌和聽牌的題目
     */
    generatePuzzle(difficulty, maxWaitingTiles = 1) {
        const settings = {
            maxWaitingTiles: maxWaitingTiles
        };
        
        // 嘗試生成符合要求的題目，最多嘗試100次
        for (let i = 0; i < 100; i++) {
            const puzzle = this.tryGeneratePuzzle(settings);
            if (this.isValidDifficulty(puzzle, difficulty)) {
                return puzzle;
            }
        }
        
        // 如果無法生成符合難度要求的題目，返回最後一次嘗試的結果
        return this.tryGeneratePuzzle(settings);
    },

    /**
     * 嘗試生成一個聽牌題目
     * @param {Object} settings 設置參數
     * @returns {Object} 包含手牌和聽牌的題目
     */
    tryGeneratePuzzle(settings) {
        // 創建牌組副本以便操作
        const allTiles = [...ALL_TILES];
        this.shuffleArray(allTiles);
        
        // 初始化手牌
        const handTiles = [];
        
        // 添加13張牌作為手牌
        for (let i = 0; i < 13; i++) {
            if (allTiles.length > 0) {
                handTiles.push(allTiles.pop());
            }
        }
        
        // 計算聽牌
        const waitingTiles = getWaitingTiles(handTiles);
        
        // 如果設置了最大聽牌數量且大於0，且當前聽牌超過這個數量，嘗試減少聽牌數量
        if (settings.maxWaitingTiles > 0 && waitingTiles.length > settings.maxWaitingTiles) {
            // 這裡可以實現一些邏輯來調整手牌，減少聽牌數量
            // 為了簡單起見，這裡只是返回當前結果
        }
        
        return {
            handTiles: handTiles,
            waitingTiles: waitingTiles
        };
    },

    /**
     * 檢查題目是否符合指定的難度
     * @param {Object} puzzle 題目
     * @param {string} difficulty 難度等級
     * @returns {boolean} 是否符合難度要求
     */
    isValidDifficulty(puzzle, difficulty) {
        // 根據難度檢查聽牌數量
        if (difficulty === 'beginner' || difficulty === 'intermediate') {
            return puzzle.waitingTiles.length === 1;
        } else if (difficulty === 'advanced') {
            return puzzle.waitingTiles.length > 1;
        }
        return true;
    },

    /**
     * 隨機打亂數組
     * @param {Array} array 要打亂的數組
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
};

// 導出模組
const MahjongTiles = {
    ALL_TILES,
    TILE_TYPES,
    TILE_VALUES,
    getTileById,
    getAdjacentTiles,
    getMiddleTile,
    countTiles,
    getWaitingTiles,
    canWin,
    generatePuzzle
}; 