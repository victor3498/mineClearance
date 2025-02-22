<script setup lang="ts">
import { ref } from 'vue';
import IntegrationArea from '@/compoent/integrationArea.vue';


// 游戏配置
const N = ref(9); // 雷盘大小
const NM = ref(10); // 雷的数量（默认 10）
const showCustomDialog = ref(false);
const customSize = ref(9);
const customMines = ref(10);
// 游戏状态
const gameStatus = ref('playing'); // 可能值："playing"（进行中）, "win"（胜利）, "lose"（失败）

// 处理游戏失败
const handleGameOver = () => {
  gameStatus.value = 'lose';
};

// 处理游戏胜利
const handleGameWin = () => {
  gameStatus.value = 'win';
};

// 重新开始游戏
const restartGame = () => {
  gameStatus.value = 'playing'; // 重置游戏状态
};

const handleLevel = (level: string) => {
  switch (level) {
    case 'beginner':
      N.value = 9;
      NM.value = 10;
      break;
    case 'intermediate':
      N.value = 16;
      NM.value = 40;
      break;
    case 'expert':
      N.value = 20;
      NM.value = 60;
      break;
    case 'custom':
      showCustomDialog.value = true;
      break;
  }
};
const handleCustomConfirm = () => {
  if (customSize.value < 5 || customSize.value > 20) {
    alert('大小必须在 5 到 20 之间');
    return;
  }
  if (customMines.value < 1 || customMines.value > (customSize.value * customSize.value) / 2) {
    alert(`雷数必须大于 0 且不超过 ${Math.floor((customSize.value * customSize.value) / 2)}`);
    return;
  }
  N.value = customSize.value;
  NM.value = customMines.value;
  showCustomDialog.value = false;
};
</script>

    <template>
  <div class="app">
    <!-- 上部按钮区域 -->
    <div class="button-area">
      <button @click="handleLevel('beginner')">初级</button>
      <button @click="handleLevel('intermediate')">中级</button>
      <button @click="handleLevel('expert')">高级</button>
      <button @click="handleLevel('custom')">自定义</button>
    </div>

    <!-- 中部游戏区域 -->
    <div class="game-area">
      <IntegrationArea :N="N" :NM="NM" />

       <!-- <IntegrationArea 
      :N="N" 
      :NM="NM" 
      @gameWin="handleGameWin" 
      @gameOver="handleGameOver"
    /> -->
    </div>

    <!-- 自定义弹窗 -->
    <div v-if="showCustomDialog" class="custom-dialog">
      <div class="dialog-content">
        <h3>自定义设置</h3>
        <label>
          大小 (5-20):
          <input v-model.number="customSize" type="number" min="5" max="20" />
        </label>
        <label>
          雷数 (1-{{ Math.floor((customSize * customSize) / 2) }}):
          <input v-model.number="customMines" type="number" :min="1" :max="(customSize * customSize) / 2" />
        </label>
        <div class="dialog-buttons">
          <button @click="handleCustomConfirm">确定</button>
          <button @click="showCustomDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

.button-area {
  margin-bottom: 20px;
}

.button-area button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

.button-area button:hover {
  background-color: #0056b3;
}

.game-area {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
}

.custom-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.dialog-content h3 {
  margin-bottom: 20px;
}

.dialog-content label {
  display: block;
  margin-bottom: 10px;
}

.dialog-content input {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.dialog-buttons {
  margin-top: 20px;
}

.dialog-buttons button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

.dialog-buttons button:hover {
  background-color: #0056b3;
}
</style>  