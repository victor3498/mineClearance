import {position} from '@/data/datatype'

// 生成一个 n * n 的二维数组，初始化为 0
export function initializeArray(n: number): number[][] {
    return Array.from({ length: n }, () => Array(n).fill(0));
}

// 设置 (x, y) 位置为 0
export function setPositionZero(array: number[][], pos: position): void {
    array[pos.x][pos.y] = 0;
    // console.log("有调用这个保证为0")
}

// 随机选择 m 个位置并设置为 9
// export function placeMines(array: number[][], n: number, m: number, x: number, y: number): void {
//     const positions: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
//     positions[x][y] = true; // 确保 (x, y) 位置不可选择

//     let placed = 0;
//     while (placed < m) {
//         const randX = Math.floor(Math.random() * n);
//         const randY = Math.floor(Math.random() * n);

//         // 确保 (randX, randY) 位置未选择且不为 (x, y)
//         if (!positions[randX][randY] && !(randX === x && randY === y)) {
//             positions[randX][randY] = true;
//             array[randX][randY] = 9;
//             placed++;
//         }
//     }
// }
export function placeMines(array: number[][], n: number, m: number, x: number, y: number): void {
    const positions: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
    positions[x][y] = true; // 确保 (x, y) 位置不可选择

    // 分区法：将棋盘划分为若干个小区域
    const regionSize = Math.ceil(Math.sqrt(n)); // 每个区域的大小
    const regions: { x: number, y: number }[] = [];

    // 初始化区域
    for (let i = 0; i < n; i += regionSize) {
        for (let j = 0; j < n; j += regionSize) {
            regions.push({ x: i, y: j });
        }
    }

    // 每个区域分配的雷数
    const minesPerRegion = Math.floor(m / regions.length);
    let remainingMines = m % regions.length;

    // 在每个区域内随机放置雷
    for (const region of regions) {
        let minesInRegion = minesPerRegion + (remainingMines > 0 ? 1 : 0);
        remainingMines--;

        while (minesInRegion > 0) {
            const randX = region.x + Math.floor(Math.random() * regionSize);
            const randY = region.y + Math.floor(Math.random() * regionSize);

            // 确保 (randX, randY) 位置未选择且不为 (x, y)
            if (randX < n && randY < n && !positions[randX][randY] && !(randX === x && randY === y)) {
                positions[randX][randY] = true;
                array[randX][randY] = 9;
                minesInRegion--;
            }
        }
    }
}

// 计算每个位置的值（计算周围 8 个元素为 9 的个数）
export function calculateNeighbors(array: number[][], n: number,pos :position): void {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (array[i][j] === 9) continue; // 已经是 9 的位置跳过
            if  (i===pos.x && j===pos.y) continue;//初始位置跳过
            let count = 0;
            // 检查周围 8 个方向的元素
            for (const [dx, dy] of directions) {
                const ni = i + dx, nj = j + dy;
                if (ni >= 0 && ni < n && nj >= 0 && nj < n && array[ni][nj] === 9) {
                    count++;
                }
            }
            array[i][j] = count;
        }
    }
}

// 生成最终的数组
export function generateArray(n: number, m: number, pos: position): number[][] {
    // console.log("有调用生成真数组的函数")
    const array = initializeArray(n);
    // console.log(array[pos.x][pos.y])
    setPositionZero(array, pos);
    // console.log(array[pos.x][pos.y])
    placeMines(array, n, m, pos.x, pos.y);
    // console.log(array[pos.x][pos.y])
    calculateNeighbors(array, n,pos);
    // console.log('标记1',array[pos.x][pos.y])
    // console.log('标记2',array);
    return array;
    
}

