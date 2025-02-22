<!-- <script setup lang="ts">
import { ref, watch } from 'vue';
import BasicBlock from './BasicBlock.vue';
import { generateArray } from '@/data/ButtonArray';
import { position } from '@/data/datatype';

let props = defineProps<{ N: number, NM: number }>();
let testArray = ref(Array.from({ length: props.N }, () => Array(props.N).fill(-1)));
let realArray = ref<number[][]>([]);
let gameStarted = ref(false);
let revealedCount = ref(0);

watch(gameStarted,(newVal,oldVal) =>//
{
   console.log("gameStarted有改变值",gameStarted.value)  
}

);





const startGame = (pos: position) => {
  realArray.value = generateArray(props.N, props.NM, pos);//这一行正常
  gameStarted.value = true;
  console.log("有进行游戏启动")
};

const handleZeroMessage = (pos: position) => {
  if (!gameStarted.value) return;
  const directions = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
  ];
  directions.forEach(([dx, dy]) => {
    const nx = pos.x + dx, ny = pos.y + dy;
    if (nx >= 0 && nx < props.N && ny >= 0 && ny < props.N && realArray.value[nx][ny] !== 9) {
      revealedCount.value++;
    }
  });
  console.log("有进行扩散")
};

const handleNineMessage = () => {
  alert('游戏失败！');
  location.reload();
};

const updatePosition = () => {
  revealedCount.value++;
  if (revealedCount.value === props.N * props.N - props.NM) {
    alert('游戏胜利！');
    location.reload();//检查后这个是正常的
  }
};
</script>

<template>



  <div class="grid">
    <div v-for="(row, i) in testArray" :key="i">
      <BasicBlock 
        v-for="(num, j) in row" 
        :key="`${i}-${j}`"
        :Num="gameStarted ? realArray[i][j] : -1"
        :Pos="{ x: i, y: j }"
        @gameStart="startGame"
        @zeroMessage="handleZeroMessage"
        @nineMessage="handleNineMessage"
        @updatePosition="updatePosition"
      />
    </div>
  </div>
</template> -->
<!-- <script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BasicBlock from './BasicBlock.vue';
import { generateArray } from '@/data/ButtonArray';
import { position } from '@/data/datatype';

let props = defineProps<{ N: number, NM: number }>();
let realArray = ref<number[][]>([]);
let gameStarted = ref(false);
let revealedCount = ref(0);

watch(gameStarted, (newVal, oldVal) => {
  console.log("gameStarted有改变值", gameStarted.value);
});

const startGame = (pos: position) => {
  realArray.value = generateArray(props.N, props.NM, pos); // 这一行正常
  gameStarted.value = true;
  console.log("有进行游戏启动");
};

const handleZeroMessage = (pos: position) => {
  if (!gameStarted.value) return;
  const directions = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
  ];
  directions.forEach(([dx, dy]) => {
    const nx = pos.x + dx, ny = pos.y + dy;
    if (nx >= 0 && nx < props.N && ny >= 0 && ny < props.N && realArray.value[nx][ny] !== 9) {
      revealedCount.value++;
    }
  });
  console.log("有进行扩散");
};

const handleNineMessage = () => {
  alert('游戏失败！');
  location.reload();
};

const updatePosition = () => {
  revealedCount.value++;
  if (revealedCount.value === props.N * props.N - props.NM) {
    alert('游戏胜利！');
    location.reload(); // 检查后这个是正常的
  }
};

// 使用 computed 属性来动态计算 BasicBlock 的 Num 属性
const blockArray = computed(() => {
  return gameStarted.value ? realArray.value : Array.from({ length: props.N }, () => Array(props.N).fill(-1));
});
</script>

<template>
  <div class="grid">
    <div v-for="(row, i) in blockArray" :key="i">
      <BasicBlock 
        v-for="(num, j) in row" 
        :key="`${i}-${j}`"
        :Num="num"
        :Pos="{ x: i, y: j }"
        @gameStart="startGame"
        @zeroMessage="handleZeroMessage"
        @nineMessage="handleNineMessage"
        @updatePosition="updatePosition"
      />
    </div>
  </div>
</template> -->





<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import BasicBlock from './BasicBlock.vue';
import { generateArray } from '@/data/ButtonArray';
import { position } from '@/data/datatype';

let props = defineProps<{ N: number, NM: number; }>();
let realArray = ref<number[][]>([]);
let gameStarted = ref(false);
let revealedCount = ref(0); // 计数，判断是否胜利
let rePosArray = ref<position[]>([]); // 收集扩散事件中应该点开的子组件的坐标

// 计时器相关逻辑
let timer = ref(0); // 计时器值
let timerInterval: number | null = null; // 计时器 interval
const emit = defineEmits(['gameReady']);
// 启动计时器
const startTimer = () => {
  if (timerInterval !== null) return; // 防止重复启动
  timerInterval = setInterval(() => {
    timer.value++;
  }, 1000);
};

// 停止计时器
const stopTimer = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// 重置计时器
const resetTimer = () => {
  stopTimer();
  timer.value = 0;
};

// 监听 gameStarted 的变化
watch(gameStarted, (newVal) => {
  if (newVal) {
    resetTimer(); // 游戏开始时重置计时器
    startTimer(); // 启动计时器
  } else {
    stopTimer(); // 游戏结束时停止计时器
  }
});


// watch(() => props.resetGame, () => {
//   // 重置游戏状态
//   gameStarted.value = false;
//   realArray.value = [];
//   revealedCount.value = 0;
//   rePosArray.value = [];
//   resetTimer();
// });

// // 监听 newGameReady 的变化
// watch(() => props.newGameReady, (newVal) => {
//   if (newVal) {
//     // 新游戏准备完毕，等待用户点击启动
//     gameStarted.value = false; // 确保游戏未启动
//     emit('gameReady'); // 通知父组件新游戏已准备完毕
//   }
// });

// 组件卸载时清除计时器
onUnmounted(() => {
  stopTimer();
});

const startGame = (pos: position) => {
 
  
  realArray.value = generateArray(props.N, props.NM, pos); // 生成新数组
  console.log('此消息应该先于扩散', realArray.value);
  gameStarted.value = true;
  console.log('有进行游戏启动');
};

const handleZeroMessage = (pos: position) => {
  console.log('接受到的坐标', pos.x, pos.y);
  console.log('此消息应该晚于生成', realArray.value);

  const n = realArray.value.length; // 获取二维数组的大小

  // 八个方向的相对坐标（上下左右和四个对角线）
  const directions: [number, number][] = [
    [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  // 存储符合条件的坐标
  const result: position[] = [];

  // 用于检查是否越界
  const isValid = (x: number, y: number): boolean => {
    return x >= 0 && x < n && y >= 0 && y < n;
  };

  // 创建一个二维数组来记录是否访问过
  const visited: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  // 起始位置
  const { x, y } = pos;

  // 如果当前元素不为0或9，直接返回空结果
  if (realArray.value[x][y] !== 0) {
    return result;
  }

  // 深度优先搜索（DFS）以查找符合条件的元素
  const dfs = (x: number, y: number): void => {
    // 如果越界或已经访问过，返回
    if (!isValid(x, y) || visited[x][y]) {
      return;
    }

    // 标记当前节点为已访问
    visited[x][y] = true;

    // 如果值是0，记录这个坐标
    if (realArray.value[x][y] === 0) {
      result.push(new position(x, y));
    }

    // 如果值不是0且不是9，也记录这个坐标（用于显示数字）
    if (realArray.value[x][y] !== 0 && realArray.value[x][y] !== 9) {
      result.push(new position(x, y));
      return; // 不需要继续扩散
    }

    // 向八个方向进行扩展
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      // 继续扩展
      if (isValid(newX, newY) && realArray.value[newX][newY] !== 9) {
        dfs(newX, newY);
      }
    }
  };

  // 从给定的起始位置开始DFS
  dfs(x, y);

  rePosArray.value = [...rePosArray.value, ...result];
  console.log('得到的扩散', rePosArray);
};

const handleNineMessage = () => {
  alert('游戏失败！');
  stopTimer(); // 游戏结束时停止计时器
  location.reload();
};

const updatePosition = () => {
  revealedCount.value++;
  if (revealedCount.value === props.N * props.N - props.NM) {
    alert('游戏胜利！');
    stopTimer(); // 游戏结束时停止计时器
    location.reload();
  }
};

const blockArray = computed(() => {
  return gameStarted.value ? realArray.value : Array.from({ length: props.N }, () => Array(props.N).fill(-1));
});
</script>

<template>
  <div class="integration-area">
    <!-- 上部显示区域 -->
    <div class="info-area">
      <div class="info-item">
        <span>雷数: {{ NM }}</span>
      </div>
      <div class="info-item">
        <span>时间(秒): {{ timer }} </span>
      </div>
    </div>

    <!-- 游戏区域 -->
    <div class="grid">
      <div v-for="(row, i) in blockArray" :key="i">
        <div v-for="(num, j) in row" :key="`${i}-${j}`">
          <BasicBlock 
            :Num="num"
            :Posarray="rePosArray"
            :Pos="{ x: i, y: j }"
            @gameStart="startGame"
            @zeroMessage="handleZeroMessage"
            @nineMessage="handleNineMessage"
            @updatePosition="updatePosition"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.integration-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.info-area {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.info-item {
  font-size: 18px;
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: repeat(v-bind(N), 15px);
  gap: 5px;
}
</style>

