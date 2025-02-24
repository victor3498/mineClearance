import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { generateArray } from '@/data/ButtonArray';
import { position } from '@/data/datatype';

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const N = ref(9); // 默认网格大小
  const NM = ref(10); // 默认地雷数量
  const gameStarted = ref(false);
  const gameStatus = ref<'prepare'|'playing' | 'win' | 'lose'>('prepare');
  
  // 游戏网格
  const realArray = ref<number[][]>([]);

  // 计时器
  const timer = ref(0);
  let timerInterval: number | null = null;

  // 记录翻开的方块数量
  const revealedCount = ref(0);

  // 记录需要扩散的方块
  const rePosArray = ref<position[]>([]);

  const resetKey = ref(0);//重新挂载
  const showCustomDialog = ref(false);//自定义弹窗显示
  const customSize = ref(9);
  const customMines = ref(10);
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
    resetGame();
  };

  

  const resetGame = () => {
     resetKey.value = Date.now();// 变更 key 触发组件重载
  //     N.value=9; // 默认网格大小
  //      NM.value=10; // 默认地雷数量
  //  gameStarted.value = false;
  //  gameStatus.value='prepare'
  
  
  // realArray.value

  
  //  timer.value = 0;
  //  timerInterval = null;

  
  //  revealedCount.value =0;

  
  //  showCustomDialog.value =false;//自定义弹窗显示
  //  customSize.value = 9;
  //  customMines.value = 0;
  };

 const handleCustomConfirm = () => {

    if (customSize.value < 5 || customSize.value > 20) {
      alert('大小必须在 5 到 20 之间');
      return;
    }
    if (customMines.value < 1 || customMines.value > Math.floor((customSize.value * customSize.value) / 2)) {
      alert(`雷数必须大于 0 且不超过 ${Math.floor((customSize.value * customSize.value) / 2)}`);
      return;
    }
    N.value = customSize.value;
    NM.value = customMines.value;
    showCustomDialog.value = false;
    resetGame();
  };



  const clear = () =>{
  //   N.value = 9; 
  // NM.value = 10; 
  gameStarted.value = false; 
  gameStatus.value = 'prepare'; 
  realArray.value = []; 
  timer.value = 0; 
  if (timerInterval !== null) {
    clearInterval(timerInterval); 
    timerInterval = null;
  }
  revealedCount.value = 0;
  rePosArray.value = []; 
  // customSize.value = 9; 
  // customMines.value = 10; 



  }






  // **方法：启动游戏**
  const startGame = (pos: position) => {
     gameStatus.value = 'playing';
    realArray.value = generateArray(N.value, NM.value, pos);
    gameStarted.value = true;
    resetTimer();
    startTimer();
  };

  // **方法：停止计时器**
  const stopTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  // **方法：启动计时器**
  const startTimer = () => {
    if (timerInterval !== null) return;
    timerInterval = setInterval(() => {
      timer.value++;
    }, 1000);
  };

  // **方法：重置计时器**
  const resetTimer = () => {
    stopTimer();
    timer.value = 0;
  };

  // **方法：记录翻开的格子**
  const updatePosition = () => {
    revealedCount.value++;
    if (revealedCount.value === N.value * N.value - NM.value) {
      gameStatus.value = 'win';
      stopTimer();
      alert('游戏胜利！');
      location.reload();

      
    }
  };

  // **方法：处理雷区点击**
  const handleNineMessage = () => {
    gameStatus.value = 'lose';
    stopTimer();
    alert('游戏失败！');
    location.reload();

  };

  //监听 gameStarted 的变化
watch(gameStarted, (newVal) => {
  if (newVal) {
    resetTimer(); // 游戏开始时重置计时器
    startTimer(); // 启动计时器
  } else {
    stopTimer(); // 游戏结束时停止计时器
  }
});

  // **方法：处理 0 号扩散**
  const handleZeroMessage = (pos: position) => {
    if (!gameStarted.value) return;

    const n = realArray.value.length;
    const directions: [number, number][] = [
      [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    const result: position[] = [];
    const visited: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

    const isValid = (x: number, y: number): boolean => x >= 0 && x < n && y >= 0 && y < n;

    const dfs = (x: number, y: number): void => {
      if (!isValid(x, y) || visited[x][y]) return;
      visited[x][y] = true;
      if (realArray.value[x][y] === 0) {
        result.push(new position(x, y));
      }
      if (realArray.value[x][y] !== 0 && realArray.value[x][y] !== 9) {
        result.push(new position(x, y));
        return;
      }
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (isValid(newX, newY) && realArray.value[newX][newY] !== 9) {
          dfs(newX, newY);
        }
      }
    };

    dfs(pos.x, pos.y);
    rePosArray.value = [...rePosArray.value, ...result];
  };

  return {
    N, NM, gameStarted, gameStatus, realArray, timer, rePosArray, revealedCount,resetKey,showCustomDialog,customSize, customMines, handleLevel,resetGame,
    startGame, stopTimer, startTimer, resetTimer, updatePosition, handleNineMessage, handleZeroMessage, handleCustomConfirm,clear
  };
});
