// pages/game/game.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    gameOver: false,
    gridList: [],
    characterList: [],
    board: [],
    merge: [],
    touchDotX: 0, //X按下时坐标
    touchDotY: 0, //y按下时坐标
    interval: null, //计时器
    time: 0, //从按下到松开共多少时间*100
    numberBgColorList: [{
        color: '#eee4da',
        value: 2
      },
      {
        color: '#eee4da',
        value: 4
      },
      {
        color: '#f26179',
        value: 8
      },
      {
        color: '#f59563',
        value: 16
      },
      {
        color: '#f67c5f',
        value: 32
      },
      {
        color: '#f65e36',
        value: 64
      },
      {
        color: '#edcf72',
        value: 128
      },
      {
        color: '#edcc61',
        value: 256
      },
      {
        color: '#9c0',
        value: 512
      },
      {
        color: '#3365a5',
        value: 1024
      },
      {
        color: '#09c',
        value: 2048
      },
      {
        color: '#a6bc',
        value: 4096
      },
      {
        color: '#93c',
        value: 8192
      },
    ]
  },

  handleStart() {
    this.newGame()
  },

  touchStart(e) {
    this.setData({
      touchDotX: e.touches[0].pageX 
    })
    this.setData({
      touchDotY: e.touches[0].pageY 
    })
    this.setData({
      interval: setInterval(() => {
        this.setData({
          time: this.data.time++ 
        })
      }, 100)
    })
  },

  touchEnd(e) {
    let touchDotX = this.data.touchDotX;
    let touchDotY = this.data.touchDotY;
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;

    if (this.data.time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {
          console.log("左滑=====")
          if (this.moveToLeft()) {
            this.randomNumber()
            setTimeout(()=>this.isGameOver(), 400)
          }
        } else {
          console.log("右滑=====")
          console.log(this.moveToRight())
          if (this.moveToRight()) {
            this.randomNumber()
            setTimeout(()=>this.isGameOver(), 400)
          }
        }
      }
      if (absY > absX * 2) {
        if (tmY < 0) {
          console.log("上滑动=====")
          if (this.moveToTop()) {
            this.randomNumber()
            setTimeout(()=>this.isGameOver(), 400)
          }
        } else {
          console.log("下滑动=====")
          if (this.moveToBottom()) {
            this.randomNumber()
            setTimeout(()=>this.isGameOver(), 400)
          }
        }
      }
    }
    clearInterval(this.data.interval); // 清除setInterval
    this.setData({
      time: 0
    })
  },

  newGame() {
    this.init()
    this.randomNumber()
    this.randomNumber()
  },

  init() {
    let gridList = []
    let characterList = []
    let x = 0
    // 初始化背景格子
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0 && i !== 0) {
        x += 1
      }
      let distance = this.getDistance(x, i % 4)
      gridList.push({
        id: i,
        x,
        y: i % 4,
        top: distance.top,
        left: distance.left
      })
      characterList.push({
        id: i,
        x,
        y: i % 4,
        top: distance.top,
        left: distance.left,
        width: 0,
        height: 0,
        color: 'white',
        backgroundColor: '',
        value: 0,
        display: 'none',
        animate: []
      })
    }

    this.setData({
      gridList,
      characterList,
      score: 0,
      gameOver: false
    })
    this.initBoard()
    this.initMerge()
    this.updateBoardView()
  },


  getDistance(x, y) {
    return {
      top: 20 + x * 150,
      left: 20 + y * 150
    }
  },

  // 初始化格子数组
  initBoard() {
    let board = []
    for (let i = 0; i < 4; i++) {
      board[i] = []
      for (let j = 0; j < 4; j++) {
        board[i][j] = 0
      }
    }
    this.setData({
      board
    })
  },

  // 初始化判定合并的数组
  initMerge() {
    let merge = this.data.merge
    for (let i = 0; i < 4; i++) {
      merge[i] = []
      for (let j = 0; j < 4; j++) {
        merge[i][j] = 0
      }
    }
    this.setData({
      merge
    })
  },

  // 更新视图
  updateBoardView() {
    let characterList = this.data.characterList
    let board = this.data.board
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          characterList[i * 4 + j].width = 0
          characterList[i * 4 + j].height = 0
          characterList[i * 4 + j].display = 'none'
        } else {
          characterList[i * 4 + j].display = 'block'
          characterList[i * 4 + j].width = 130
          characterList[i * 4 + j].height = 130
          characterList[i * 4 + j].backgroundColor = this.getBackgroundColor(board[i][j])
          characterList[i * 4 + j].color = this.getNumberColor(board[i][j])
          characterList[i * 4 + j].value = board[i][j]
        }
      }
    }
    this.setData({
      characterList
    })
  },
  // 获取背景色
  getBackgroundColor(num) {
    let item = this.data.numberBgColorList.find(n => n.value === num)
    if (item) return item.color
    else return 'black'
  },
  // 数字颜色
  getNumberColor(num) {
    if (num <= 4) {
      return "#776e65";
    }
    return "white";
  },

  // 随机生成格子
  randomNumber() {
    if (!this.hasSpace()) return false
    let board = this.data.board
    //随机一个格子
    let randomx = parseInt(Math.floor(Math.random() * 4));
    let randomy = parseInt(Math.floor(Math.random() * 4));
    while (true) {
      if (board[randomx][randomy] == 0) break
      randomx = parseInt(Math.floor(Math.random() * 4));
      randomy = parseInt(Math.floor(Math.random() * 4));
    }
    // 随机一个数字
    const randomNum = Math.random() < 0.5 ? 2 : 4
    board[randomx][randomy] = randomNum
    this.setData({
      board
    }, () => {
      this.updateBoardView()
    })
    return true
  },

  // 判断棋盘中是否还有空格
  hasSpace() {
    let board = this.data.board
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; i++) {
        if (board[i][j] === 0) return true
      }
    }
    return false
  },

  // 判断能否左移
  canMoveLeft() {
    let board = this.data.board
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0 && j !== 0) {
          if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) return true
        }
      }
    }
    return false
  },

  // 判断能否右移
  canMoveRight() {
    let board = this.data.board
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0 && j !== 3) {
          if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) return true
        }
      }
    }
    return false
  },

  // 判断能否上移
  canMoveTop() {
    let board = this.data.board
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0 && i !== 0) {
          if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) return true
        }
      }
    }
    return false
  },

  // 判断能否下移
  canMoveBottom() {
    let board = this.data.board
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0 && i !== 3) {
          if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) return true
        }
      }
    }
    return false
  },

  // 判断水平方向两格之间是否有其他数字格子
  hasHorizontalBlock(row, col1, col2) {
    let board = this.data.board
    for (let i = col1 + 1; i < col2; i++) {
      if (board[row][i] !== 0) return true
    }
    return false
  },

  // 判断竖直方向两格之间是否有其他数字格子
  hasVerticalBlock(col, row1, row2) {
    let board = this.data.board
    for (let i = row1 + 1; i < row2; i++) {
      if (board[i][col] !== 0) return true
    }
    return false
  },
  // 实现移动格子的动画
  showMoveAnimation(fromx, fromy, tox, toy) {
    let characterList = this.data.characterList
    //创建一个动画实例
    let animation = wx.createAnimation({
      duration: 10000,
      timingFunction: 'linear',
    })
    animation.translate(-this.getDistance(tox, toy).top, -this.getDistance(tox, toy).left).step()
    characterList[fromx * 4 + fromy].animate = animation.export()
    this.setData({
      characterList
    })
  },

  // 向左移动
  moveToLeft() {
    if (!this.canMoveLeft()) return false
    let board = this.data.board
    let score = this.data.score
    let merge = this.data.merge
    // 每次循环前重置
    this.initMerge()
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        if (board[i][j] != 0) {
          for (let k = 0; k < j; k++) {
            // 需要判断落脚位置是否无值且中间没有其他数字格
            if (board[i][k] === 0 && !this.hasHorizontalBlock(i, k, j)) {
              // 开始移动
              // this.showMoveAnimation(i, j, i, k)
              board[i][k] = board[i][j]
              board[i][j] = 0
              this.setData({
                board
              })
              continue
            }
            // 落脚处数字相等且中间无其他数字格
            else if (board[i][k] === board[i][j] && !this.hasHorizontalBlock(i, k, j)) {
              // this.showMoveAnimation(i, j, i, k)
              if (merge[i][k] != 0) { //目标落脚点是否完成过合并
                board[i][k + 1] = board[i][j];
                board[i][j] = 0;
              } else {
                board[i][k] += board[i][j];
                board[i][j] = 0;
                merge[i][k] = 1;
                score += board[i][k]; //分数变更
              }
              this.setData({
                board,
                score,
                merge
              })
              continue;
            }
          }
        }
      }
    }
    setTimeout(() => this.updateBoardView(), 200)
    return true
  },

  // 向右移动
  moveToRight() {
    if (!this.canMoveRight()) return false
    let board = this.data.board
    let score = this.data.score
    let merge = this.data.merge
    // 每次循环前重置
    this.initMerge()
    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; j--) {
        if (board[i][j] != 0) {
          for (let k = 3; k > j; k--) {
            // 需要判断落脚位置是否无值且中间没有其他数字格
            if (board[i][k] === 0 && !this.hasHorizontalBlock(i, j, k)) {
              // 开始移动
              // this.showMoveAnimation(i, j, i, k)
              board[i][k] = board[i][j]
              board[i][j] = 0
              this.setData({
                board
              })
              continue
            }
            // 落脚处数字相等且中间无其他数字格
            else if (board[i][k] === board[i][j] && !this.hasHorizontalBlock(i, j, k)) {
              // this.showMoveAnimation(i, j, i, k)
              if (merge[i][k] != 0) { //目标落脚点是否完成过合并
                board[i][k - 1] = board[i][j];
                board[i][j] = 0;
              } else {
                board[i][k] += board[i][j];
                board[i][j] = 0;
                merge[i][k] = 1;
                score += board[i][k]; //分数变更
              }
              this.setData({
                board,
                score,
                merge
              })
              continue;
            }
          }
        }
      }
    }
    setTimeout(() => this.updateBoardView(), 200)
    return true
  },

  // 向上移动
  moveToTop() {
    if (!this.canMoveTop()) return false
    let board = this.data.board
    let score = this.data.score
    let merge = this.data.merge
    // 每次循环前重置
    this.initMerge()
    for (let j = 0; j < 4; j++) {
      for (let i = 1; i < 4; i++) {
        if (board[i][j] != 0) {
          for (let k = 0; k < i; k++) {
            // 需要判断落脚位置是否无值且中间没有其他数字格
            if (board[k][j] === 0 && !this.hasVerticalBlock(j, k, i)) {
              // 开始移动
              // this.showMoveAnimation(i, j, i, k)
              board[k][j] = board[i][j]
              board[i][j] = 0
              this.setData({
                board
              })
              continue
            }
            // 落脚处数字相等且中间无其他数字格
            else if (board[k][j] === board[i][j] && !this.hasVerticalBlock(j, k, i)) {
              // this.showMoveAnimation(i, j, i, k)
              if (merge[k][j] != 0) { //目标落脚点是否完成过合并
                board[k + 1][j] = board[i][j];
                board[i][j] = 0;
              } else {
                board[k][j] += board[i][j];
                board[i][j] = 0;
                merge[k][j] = 1;
                score += board[k][j]; //分数变更
              }
              this.setData({
                board,
                score,
                merge
              })
              continue;
            }
          }
        }
      }
    }
    setTimeout(() => this.updateBoardView(), 200)
    return true
  },

  // 向下移动
  moveToBottom() {
    if (!this.canMoveBottom()) return false
    let board = this.data.board
    let score = this.data.score
    let merge = this.data.merge
    // 每次循环前重置
    this.initMerge()
    for (let j = 0; j < 4; j++) {
      for (let i = 2; i >= 0; i--) {
        if (board[i][j] != 0) {
          for (let k = 3; k > j; k--) {
            // 需要判断落脚位置是否无值且中间没有其他数字格
            if (board[k][j] === 0 && !this.hasVerticalBlock(j, i, k)) {
              // 开始移动
              // this.showMoveAnimation(i, j, i, k)
              board[k][j] = board[i][j]
              board[i][j] = 0
              this.setData({
                board
              })
              continue
            }
            // 落脚处数字相等且中间无其他数字格
            else if (board[k][j] === board[i][j] && !this.hasVerticalBlock(j, i, k)) {
              // this.showMoveAnimation(i, j, i, k)
              if (merge[k][j] != 0) { //目标落脚点是否完成过合并
                board[k - 1][j] = board[i][j];
                board[i][j] = 0;
              } else {
                board[k][j] += board[i][j];
                board[i][j] = 0;
                merge[k][j] = 1;
                score += board[k][j]; //分数变更
              }
              this.setData({
                board,
                score,
                merge
              })
              continue;
            }
          }
        }
      }
    }
    setTimeout(() => this.updateBoardView(), 200)
    return true
  },

  noMove() {
    if (this.canMoveLeft() || this.canMoveRight() || this.canMoveTop() || this.canMoveBottom()) return false
    else return true
  },
  isGameOver() {
    if (!this.hasSpace() && this.noMove()) this.setData({gameOver: true})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.newGame()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})