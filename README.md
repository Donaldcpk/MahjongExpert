# 麻將聽牌練習遊戲

這是一個專門用於練習麻將聽牌技巧的應用程式。適合初學者到進階玩家提升他們辨識和記憶聽牌組合的能力。

## 功能特色

- **聽牌練習**：展示不同的麻將牌型，讓玩家猜測缺少哪張牌可以聽牌
- **難度設定**：提供初級、中級和高級三種難度，適合不同程度的玩家
- **計時挑戰**：在限定時間內完成挑戰，提升緊張感和專注力
- **分數系統**：根據回答正確率和速度計算分數，鼓勵玩家進步
- **排行榜**：記錄和展示最佳成績，增加競爭和分享樂趣

## 如何使用

1. 選擇難度等級
2. 開始遊戲後，系統會顯示一組牌型
3. 玩家需要在規定時間內選擇正確的聽牌
4. 每次回答後會顯示是否正確，並提供解釋
5. 完成所有題目後，系統會計算總分並記錄到排行榜

## 遊戲難度說明

- **初級模式**：從5個選項中選擇1個正確答案，每題100分，時間限制60秒
- **中級模式**：從所有麻將牌中選擇1個正確答案，每題200分，時間限制45秒
- **高級模式**：從所有麻將牌中選擇，可能有多個正確答案，每個正確答案100分，時間限制30秒

## 如何開始

1. 下載或克隆專案到本地電腦
2. 直接在瀏覽器中打開 `index.html` 文件
3. 開始練習提升你的麻將聽牌能力

## 自定義麻將牌圖片

遊戲預設使用文字表示麻將牌，如果您想使用圖片，請按照以下步驟操作：

1. 準備所有麻將牌的圖片
2. 將圖片儲存到 `images/tiles/` 目錄
3. 圖片命名必須遵循以下格式：
   - 筒子：`dots_1.png` 到 `dots_9.png`
   - 條子：`bamboo_1.png` 到 `bamboo_9.png`
   - 萬子：`character_1.png` 到 `character_9.png`
   - 風牌：`honor_east.png`、`honor_south.png`、`honor_west.png`、`honor_north.png`
   - 三元牌：`honor_red.png`、`honor_green.png`、`honor_white.png`

## 部署到 GitHub Pages

遊戲可以很簡單地部署到 GitHub Pages，讓其他人能夠在線上體驗：

1. 在 GitHub 上建立一個新的儲存庫
2. 將專案推送到該儲存庫
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git branch -M main
   git remote add origin https://github.com/您的使用者名稱/您的儲存庫名稱.git
   git push -u origin main
   ```
3. 在儲存庫設定中啟用 GitHub Pages
   - 前往儲存庫頁面 → Settings → Pages
   - Source 選擇 "main" 分支和 "/" (root) 目錄
   - 點擊 Save
4. 等待幾分鐘後，您的遊戲將可以在 `https://您的使用者名稱.github.io/您的儲存庫名稱` 訪問

## 技術架構

- 前端：HTML, CSS, JavaScript
- 資料存儲：瀏覽器本地存儲 (LocalStorage)
- 建議瀏覽器：Chrome, Firefox, Safari最新版本

## 開發計劃

- [x] 專案初始化
- [x] 基本UI設計
- [x] 麻將牌型邏輯實現
- [x] 聽牌判斷演算法
- [x] 難度等級設計
- [x] 計時系統
- [x] 分數計算
- [x] 本地排行榜
- [ ] 使用者測試與優化
- [ ] 添加更多牌型和規則變體

## 開發日誌

### 版本 1.0.0
- 完成基本遊戲邏輯和界面
- 實現聽牌判斷演算法
- 添加難度設定和計分系統
- 完成三種難度級別功能
- 添加排行榜及計時功能
- 添加麻將牌圖片支持

## 未來計劃

- 添加更多難度等級
- 增加不同麻將規則的練習（如國標、日麻）
- 添加提示功能
- 優化手機端體驗
- 統計用戶練習數據，生成進步報告

# MahjongExpert
