const stage1 = {
  background: "",
  obstacles: [
    // 地面ブロック（隙間あり）
    {
      x: 0,
      y: 364 - 64,
      width: 600,
      height: 64,
      img: "asset/ground1.png",
      movable: false
    },
    {
      x: 700,
      y: 364 - 64,
      width: 150,
      height: 64,
      img: "asset/ground1.png",
      movable: false
    },
    {
      x: 1200,
      y: 364 - 64,
      width: 200,
      height: 64,
      img: "asset/ground1.png",
      movable: false
    },

    // obstacle1
    {
      x: 600,
      y: 300,
      width: 64,
      height: 64,
      img: "asset/obstacle1.png",
      movable: false
    },

    // obstacle2
    {
      x: 900,
      y: 284,
      width: 80,
      height: 80,
      img: "asset/obstacle2.png",
      movable: true,
      circle: true
    },
    
    // obstacle3
    {
      x: 550,
      y: 220,
      width: 80,
      height: 80,
      img: "asset/obstacle3.png",
      movable: true,
      circle: true,
      angle: 0,
      velocityY: 0,
      gravity: 0.5
    }
    


  ],
  goal: { x: 1200, y: 300, width: 64, height: 64 }
};
