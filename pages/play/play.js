// pages/play/play.js
import url from '../../config/url';
var app = getApp(); //获取APP实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    song: {},     //请求api返回的数据
    duration: 0,  //播放时间
    currentTime: 0, //当前播放时间
    isDownSlider: false,   //滑块是否有滑动，默认是没有
    icon: 'icon-xiayiye', //播放按钮的状态
    lrc: {'0':'正在获取歌词'},
    currentLrc: '',       //当前显示的歌词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取歌词
    wx.request({
      url: `${url.lyric}${options.id || '1374056687'}`,
      success: res=>{
        let {lyric} = res.data.lrc;
        let r = /\[(.*?)](.*)/g;
        var obj = {};
        lyric.replace(r, ($0, $1, $2)=>{
          // console.log($1, $2)
          obj[$1.substring(0,5)] = $2;
        });
        this.setData({lrc: obj});
      }
    });

    // 获取歌曲详情
    wx.request({
      url: `${url.song}${options.id}`,
      success: res=>{
        // 储存数据
        this.setData({
          song: res.data.songs[0]
        });
      }
    });

    var { song } = app.globalData;
    if(!song){
      song = app.globalData.song = wx.createInnerAudioContext();
    }
    song.src = `https://music.163.com/song/media/outer/url?id=${options.id}.mp3`;
    song.play();
    song.paused ? this.setData({icon:'icon-suspend_icon'}):this.setData({icon: 'icon-xiayiye'});
    song.onTimeUpdate(()=>{
      // console.log(song);
      if(this.data.duration !== song.duration) this.setData({
        duration: song.duration
      });

      if(!this.data.isDownSlider) {
          //播放进度
        this.setData({
          currentTime: song.currentTime
        });
      }

      let { currentTime: time} = song,
          minute = Math.floor(time/60),
          second = Math.floor(time%60),
          strTime = (minute > 10 ? '' + minute : '0' + minute) + ':' + (second > 10 ? '' + second : '0' + second);
      
      if(strTime in this.data.lrc && 'el-' + strTime !== this.data.currentLrc){
        this.setData({currentLrc: 'el-' + strTime});
      }
      
      

    });

  },

  //滑块拖动事件
  sliderChangeIng(event){
    this.setData({isDownSlider: true})
  },

  //抬起滑块时的事件
  sliderChangeEnd(event){
    
    this.setData({
      isDownSlider: false,
      currentTime: event.detail.value
    });
    app.globalData.song.seek(event.detail.value);
  },

  // 播放和暂停事件
  onMusicPlay(event){
    let { song } = app.globalData;
    song.paused ? song.play() : song.pause();
    song.paused ? this.setData({icon:'icon-suspend_icon'}):this.setData({icon: 'icon-xiayiye'});
  },

  onMusicPrevious(event){
    app.globalData.previous = '上一首';
  }

})