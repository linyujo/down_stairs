import Vec2D from "@/utils/Vector2D";
import { do_Times } from "@/utils/utilFuncs";

export default class Stair {
  constructor(args) {
    this.config = {
      position: new Vec2D(0, 0),
      v: new Vec2D(0, -4),
      a: new Vec2D(0, 0),
      width: 150,
      height: 20,
      extraHeight: 0, // 階梯多出來的高度 (ex: 彈跳視窗)
      type: "normal", // 階梯種類
      isActive: true, // 是否使用中（尚未離開遊戲範圍)
      time: 0,
      ...args
    };
    Object.assign(this, this.config);
  }
  update = () => {
    // 速度, 加速度 更新
    this.position = this.position.add(this.v);
    this.v = this.v.add(this.a);
    // 當階梯往上離開遊戲範圍，超出canvas -20px時，將階梯的isActive設為false
    if (this.position.y < 5) {
      this.isActive = false;
    }
    this.time++;
  };
  render = () => {
    const { ctx, position, width, extraHeight, type } = this;
    ctx.save();
    ctx.beginPath();
    // 繪圖起始點  |--------@--------| 中心點往左(寬度一半)，往上(包含extraHeight)
    ctx.translate(position.x - width / 2, position.y - extraHeight);

    // ctx.fillStyle = "#888";
    // ctx.font = "20px Ariel";
    // ctx.fillText(type, 0, 30);

    if (type === "normal" || type === "blade") {
      // ctx.fillStyle = "#888";
      // ctx.fillRect(0, 0, width, height / 2); // 灰色基座
    }

    switch (type) {
      case "normal":
        this.renderNormal();
        break;
      case "blade":
        this.renderBlade();
        break;
      case "jump":
        this.renderJump();
        break;
      case "fade":
        this.renderFade();
        break;
      case "slideLeft":
        this.renderSlide();
        break;
      case "slideRight":
        this.renderSlide();
        break;
      default:
        break;
    }

    ctx.restore();
  };
  renderBlade = () => {
    const { width, height, ctx } = this;

    ctx.fillStyle = "#888";
    ctx.fillRect(0, 0, width, height / 2); // 灰色基座

    const span = width / 16; // 底 高 底 高 ...共16條線，每一份佔1/16的寬度
    ctx.beginPath();
    do_Times(1 + 16)(i => {
      // 起點...第一條(上)...第二條(下)...第三條(上)...    要畫 (起點)＋16條線，故含起點是 1 + 16
      ctx.lineTo(i * span, -(i % 2) * 16);
    });
    ctx.fillStyle = "#ddd";

    ctx.fill();
  };
  renderJump = () => {
    const { width, ctx, height, extraHeight } = this;
    ctx.beginPath();
    ctx.fillStyle = "#31B404";
    ctx.fillRect(0, 0, width, 5); // 上方
    ctx.fillRect(0, height + extraHeight, width, 5); // 下方
  };
  renderFade = () => {
    const { ctx, width, height, time } = this;
    // ctx.fillStyle = "#ffd428";
    // ctx.fillRect(0, 0, width, height);

    const freq = 0.1; // 頻率
    // const amp = 5; // 震幅
    // const noise = amp * Math.random(); // 雜訊

    ctx.beginPath();
    do_Times(parseInt(width))(i => {
      const deg = i * freq + time / 20;
      let wave = Math.sin(deg);
      ctx.lineTo(i, wave + height / 2);
    });
    ctx.lineWidth = height;
    ctx.strokeStyle = "#ffd428";
    ctx.stroke();
  };
  renderNormal = () => {
    const { ctx, width, height } = this;
    ctx.fillStyle = "#81DAF5"; // 淺藍色
    ctx.fillRect(0, 0, width, height);
  };
  renderSlide = () => {
    const { ctx, type, width, height, time } = this;
    const sign = type === "slideLeft" ? -1 : 1; // 往左滑為負
    const animation = (time % 20) * sign;
    do_Times(Math.ceil(width / 20))(i => {
      let x = i * 20 + animation; // 間距20 + 動畫
      if (x < 0) {
        x = 0;
      }
      let pw = 10; // 平行四邊形寬度
      if (x + pw > width) {
        // 如果(間隔 + 平行四邊形的寬度) > 階梯的寬度
        pw = width - x < 0 ? 0 : width - x;
        // 平行四邊形的寬度 = 開始繪製的位置超出階梯寬度 ? 寬度=0不要畫 : 階梯寬度 - 開始繪製的位置;
      }
      ctx.fillStyle = "red";
      ctx.save();
      ctx.transform(1, 0, 0.5, 1, 0, 0); // 修改y方向的傾斜
      ctx.fillRect(x, 0, pw, height);
      ctx.restore();
    });
  };
}
