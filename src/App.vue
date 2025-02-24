<script setup lang="ts">
import { ref, watch } from 'vue';
import IntegrationArea from '@/compoent/integrationArea.vue';
import chongyue from '@/assets/chongyue.png';
import shu from '@/assets/shu.png'
import xi from '@/assets/xi.png'
import { useGameStore } from './store/gameStore';
// 游戏配置
// const N = ref(9); // 雷盘大小
// const NM = ref(10); // 雷的数量（默认 10）
// const showCustomDialog = ref(false);
// const customSize = ref(9);
// const customMines = ref(10);

// const resetKey = ref(0); // 用于强制重新挂载 IntegrationArea
const gameStore = useGameStore();

// 游戏状态
const gameStatus = ref('playing'); // 可能值："playing"（进行中）, "win"（胜利）, "lose"（失败）
watch(()=>gameStore.resetKey,(newVal,oldvalue)=>{
   console.log('key值发生了变化',gameStore.resetKey);
  
});



// // 处理游戏失败
// const handleGameOver = () => {
//   gameStatus.value = 'lose';
// };

// // 处理游戏胜利
// const handleGameWin = () => {
//   gameStatus.value = 'win';
// };

// // 重新开始游戏
// const restartGame = () => {
//   gameStatus.value = 'playing'; // 重置游戏状态
// };

// const handleLevel = (level: string) => {
//   switch (level) {
//     case 'beginner':
//       gameStore.N = 9;
//       gameStore.NM = 10;
//       break;
//     case 'intermediate':
//       gameStore.N = 16;
//       gameStore.NM = 40;
//       break;
//     case 'expert':
//       gameStore.N = 20;
//       gameStore.NM = 60;
//       break;
//     case 'custom':
//       showCustomDialog.value = true;
//       return;
//   }

  
//  resetKey.value++;
// };
// const handleCustomConfirm = () => {
//   if (customSize.value < 5 || customSize.value > 20) {
//     alert('大小必须在 5 到 20 之间');
//     return;
//   }
//   if (customMines.value < 1 || customMines.value > (customSize.value * customSize.value) / 2) {
//     alert(`雷数必须大于 0 且不超过 ${Math.floor((customSize.value * customSize.value) / 2)}`);
//     return;
//   }
//   gameStore.N = customSize.value;
//   gameStore.NM = customMines.value;
//   showCustomDialog.value = false;
//   resetKey.value++;
// };
</script>

    <template>
  <div class="app">
    <!-- 上部按钮区域 -->
    <div class="button-area">
      <!-- <button @click="handleLevel('beginner')">初级</button>
      <button @click="handleLevel('intermediate')">中级</button>
      <button @click="handleLevel('expert')">高级</button>
      <button @click="handleLevel('custom')">自定义</button> -->
      <button @click="gameStore.handleLevel('beginner')">初级</button>
      <button @click="gameStore.handleLevel('intermediate')">中级</button>
      <button @click="gameStore.handleLevel('expert')">高级</button>
      <button @click="gameStore.handleLevel('custom')">自定义</button>
      
      
    </div>

    <!-- 中部游戏区域 -->
    <div class="game-area">
      <!-- <IntegrationArea 
        :key="resetKey"
        
         
      /> -->
      <div class="game-area">
      <IntegrationArea :key="gameStore.resetKey" />
    </div>



   
    </div>

    <div class="rules-area">
      <h3>游戏规则说明</h3>
      <div class="rule-item">
        <img :src="chongyue" alt="旗帜" class="rule-image" />
        <span>旗帜：标记你认为有地雷的位置。</span>
      </div>
      <div class="rule-item">
        <img :src="xi" alt="数字 0" class="rule-image" />
        <span>数字 0:周围没有地雷,点击后会自动展开周围区域。</span>
      </div>
      <div class="rule-item">
        <img :src="shu" alt="地雷" class="rule-image" />
        <span>地雷：点击后会引爆地雷，游戏失败。</span>
      </div>
      <div class="rule-item">
        <span>左键点击展开对应区块，右键标记你认为有地雷的位置，再次点击取消标记</span>
      </div>
    </div>

    <!-- 自定义弹窗 -->
    <div v-if="gameStore.showCustomDialog" class="custom-dialog">
      <div class="dialog-content">
        <h3>自定义设置</h3>
        <label>
          大小 (5-20):
          <input v-model.number="gameStore.customSize" type="number" min="5" max="20" />
        </label>
        <label>
          雷数 (1-{{ Math.floor((gameStore.customSize * gameStore.customSize) / 2) }}):
          <input v-model.number="gameStore.customMines" type="number" 
                 :min="1" :max="Math.floor((gameStore.customSize * gameStore.customSize) / 2)" />
        </label>
        <div class="dialog-buttons">
          <button @click="gameStore.handleCustomConfirm">确定</button>
          <button @click="gameStore.showCustomDialog = false">取消</button>
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
  background-color: #d2e79d;
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

.rules-area {
  width: 100%;
  max-width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.rules-area h3 {
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
}

.rule-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rule-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>  