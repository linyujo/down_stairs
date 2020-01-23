<template>
  <canvas id="playground" ref="playground"></canvas>
</template>

<script>
/* eslint-disable */
import dat from "dat.gui";
import MouseEvent from "../utils/MouseEvent";

// 環境變數
// let showMouse = true;

// 控制面板
// const controls = {
//   value: 0
// };

// const gui = new dat.GUI();
// gui
//   .add(controls, "value", -2, 2)
//   .step(0.01)
//   .onChange(() => {});

// 環境變數
let updateFPS = 30;

function initCanvas(node_playground){
  node_playground.width = 1024;
  node_playground.height = 768;
  requestAnimationFrame(renderCanvas);
  setInterval(updateCanvas, 1000 / updateFPS);
}

function updateCanvas(){
  this.time++;
}

function renderCanvas(){
  requestAnimationFrame(renderCanvas);
}

function handleMouseMove(){

}

function handleMouseDown(){

}

function handleMouseUp(){

}

function templateIsMounted(node_playground) {
  const ctx = node_playground.getContext("2d");
  initCanvas(node_playground);
  MouseEvent({
    canvas: node_playground,
    handleMouseMove: handleMouseMove,
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
  });
  // const mouse = new Mouse();
}

export default {
  mounted(){
    const node_playground = this.$refs.playground;
    templateIsMounted(node_playground);
  }
};

</script>

<style lang="scss" scoped>
</style>
