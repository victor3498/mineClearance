<!-- <script setup lang="ts">
import { computed, ref, watch } from 'vue';
import chongyue from '@/assets/chongyue.png';
import shu from '@/assets/shu.png'
import { position } from '@/data/datatype'

let props = defineProps<{ Num: number, Pos: position }>();

const Pos = computed(() => props.Pos);
const emit = defineEmits(['updatePosition', 'zeroMessage', 'nineMessage', 'gameStart']);

const stateOfBlock = ref(2); // 1=标记, 2=未点开, 3=已点开

// watch(props.Num,(newVal,oldVal) =>//
// {
//    console.log("有更新",props.Num)
// },
// { flush: 'sync' }


// )



const handleLeftClick = () => {
  if (stateOfBlock.value === 2) {
    stateOfBlock.value = 3;
    if (props.Num === -1) {
      
      emit('gameStart', Pos.value); // 触发真启动
      console.log(Pos.value,'传递了真启动信息')
      
    } else if (props.Num === 0) {
      console.log('传递了扩散信息')
      emit('zeroMessage', Pos.value); // 触发扩散
       
    } else if (props.Num === 9) {
       console.log('传递了触雷信息')
      emit('nineMessage'); // 触雷
     
    }
  }
  emit('updatePosition');
     console.log('传递了更新位置信息')
};

const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  if (stateOfBlock.value === 2) stateOfBlock.value = 1;
  else if (stateOfBlock.value === 1) stateOfBlock.value = 2;
};
</script>

<template>
  <div class="block" @click="handleLeftClick" @contextmenu="handleRightClick">
    <span v-if="stateOfBlock === 3 && Num < 9 &&Num>=0 ">{{ props.Num }}</span>
    <img v-if="stateOfBlock === 3 && Num === 9" :src="shu" class="img-small" />
    <img v-if="stateOfBlock === 1" :src="chongyue" class="img-small" />
  </div>
</template> -->

<!-- <script setup lang="ts">
import { computed, ref, watch } from 'vue';
import chongyue from '@/assets/chongyue.png';
import shu from '@/assets/shu.png'
import { position } from '@/data/datatype'

let props = defineProps<{ Num: number, Pos: position ,Posarray: position[]}>();
const emit = defineEmits(['updatePosition', 'zeroMessage', 'nineMessage', 'gameStart']);
let PosSelf = props.Pos;

//扩散0用的
// watch(()=>props.Posarray,(newVal,oldVal) =>{
//     //  if(newVal.includes(PosSelf))
//     //  {
//     //   console.log('有监听到0数组变化并查到对应坐标')
//     //   handleLeftClick();
//     //  } 
//     if (newVal.some(p => p.x === PosSelf.x && p.y === PosSelf.y)) {
//     console.log('有监听到0数组变化并查到对应坐标');
//     handleLeftClick();
//   }
// });

const stateOfBlock = ref(2); // 1=标记, 2=未点开, 3=已点开

// 监听 props.Num 的变化
watch(() => props.Num, (newVal, oldVal) => {
  console.log("Num 更新为", newVal);
});

const handleLeftClick = () => {
  if (stateOfBlock.value === 2) {
    stateOfBlock.value = 3;
    if (props.Num === -1) {
     emit('gameStart', props.Pos);
  // setTimeout(() => {
  //   emit('zeroMessage', props.Pos);
  //   console.log('这里有走下来');
  // }, 10);

       // 触发真启动
      console.log(props.Pos, '传递了真启动信息');
    } else if (props.Num === 0) {
      console.log('传递了扩散信息');
      emit('zeroMessage', props.Pos); // 触发扩散
    } else if (props.Num === 9) {
      console.log('传递了触雷信息');
      emit('nineMessage'); // 触雷
    }
  }
  emit('updatePosition');
  console.log('传递了更新位置信息');
};

const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  if (stateOfBlock.value === 2) stateOfBlock.value = 1;
  else if (stateOfBlock.value === 1) stateOfBlock.value = 2;
};
</script>

<template>
  <div 
    class="block" 
    :data-x="Pos.x" 
    :data-y="Pos.y" 
    @click="handleLeftClick" 
    @contextmenu="handleRightClick"
  >
    <span v-if="stateOfBlock === 3 && props.Num < 9">{{ props.Num }}</span>
    <img v-if="stateOfBlock === 3 && props.Num === 9" :src="shu" class="img-small" />
    <img v-if="stateOfBlock === 1" :src="chongyue" class="img-small" />
  </div>
</template>
<style scoped> -->



<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import chongyue from '@/assets/chongyue.png';
import shu from '@/assets/shu.png'
import xi from '@/assets/xi.png'
import { position } from '@/data/datatype';
import { useGameStore } from '@/store/gameStore';


let props = defineProps<{ Num: number, Pos: position ,Posarray: position[]}>();
const emit = defineEmits(['updatePosition', 'zeroMessage', 'nineMessage', 'gameStart']);
const stateOfBlock = ref(2); // 1=标记, 2=未点开, 3=已点开
const PosSelf = computed(() => props.Pos);
const gameStore = useGameStore();



watch(() => props.Posarray, (newVal, oldVal) => {
  if (newVal.some(p => p.x === PosSelf.value.x && p.y === PosSelf.value.y) && stateOfBlock.value === 2) {
    handleLeftClick();
  }
});





const handleLeftClick = () => {
  if (stateOfBlock.value === 2) {
    stateOfBlock.value = 3;
    if (props.Num === -1) {
      // emit('gameStart', props.Pos);
      gameStore.startGame(props.Pos);
  setTimeout(() => {
    // emit('zeroMessage', props.Pos);
    gameStore.handleZeroMessage(props.Pos);
    console.log('这里有走下来');
  }, 10);

       // 触发真启动
      // console.log(props.Pos, '传递了真启动信息');
 
    } else if (props.Num === 0) {
      // console.log('传递了扩散信息');
      // emit('zeroMessage', props.Pos); // 触发扩散
       gameStore.handleZeroMessage(props.Pos);
      
    } else if (props.Num === 9) {
      // console.log('传递了触雷信息');
      // emit('nineMessage'); // 触雷
      gameStore.handleNineMessage();
      
    }
  }
  // emit('updatePosition');
   gameStore.updatePosition();
 
};

const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  if (stateOfBlock.value === 2) stateOfBlock.value = 1;
  else if (stateOfBlock.value === 1) stateOfBlock.value = 2;
};
</script>

<template>
  <div 
    class="block" 
    :data-x="Pos.x" 
    :data-y="Pos.y" 
    @click="handleLeftClick" 
    @contextmenu="handleRightClick"
  >
    <span v-if="stateOfBlock === 3 && props.Num < 9&&props.Num!==0">{{ props.Num }}</span>
    <img v-if="stateOfBlock === 3 && props.Num === 9" :src="shu" class="img-small" />
    <img v-if="stateOfBlock === 3 && props.Num === 0" :src="xi" class="img-small" />
    <img v-if="stateOfBlock === 1" :src="chongyue" class="img-small" />

  </div>
</template>

<style scoped>

.block {
  height: 20px;
  width: 20px;
  background-color: rgb(185, 237, 72);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #ccc;
  user-select: none;
}

.img-small {
  width: 10px;
  height: 10px;
}
</style>



