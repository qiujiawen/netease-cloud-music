// pages/detail/detail.js

import url from '../../config/url.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[], //数据
    id:'',
    name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({id: options.id, name: options.name});
    // 获取API数据
    wx.request({
      url:`${url.list}${this.data.id}`,
      success: res=> {
        // 储存数据
        this.setData({
          list: res.data.playlist.tracks.slice(0,10)
        });
        // 设置导航栏标题
        wx.setNavigationBarTitle({title: this.data.name});
      }
    });

  },

  onTap(event){
    let {id} = event.currentTarget.dataset;
    wx.navigateTo({
      url:`/pages/play/play?id=${id}`,
    });
  },

  lower:function(e){
    console.log(e)
  },
})