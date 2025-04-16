/**
 * 
 * @param {*} success  // 成功的回调函数
 * @param {*} error  // 失败的回调函数
 */
module.exports = function (success, error) {
  // 判断是否传入失败的回调函数  如果没有传入则使用默认的失败回调函数
  if (typeof error !== 'function') {
    error = () => {
      console.log('数据库连接失败');
    }
  }
  const mongoose = require('mongoose');
  // 导入config配置文件
  const { DBHost, DBPort, DBName } = require('../config/config')
  // mongoose.connect('mongodb://127.0.0.1:27017/bilibili') // 链接数据库  bilibili为数据库名称
  mongoose.connect(`mongodb://${DBHost}/${DBPort}:${DBName}`);
  // 也可以使用once方法  once 只执行一次
  mongoose.connection.once('open', () => {
    success(); // 连接成功的回调函数
  });

  mongoose.connection.on('error', () => {
    // console.log('数据库连接失败');
    error(); // 连接失败的回调函数
  }); //设置连接失败的回调函数

  mongoose.connection.on('close', () => {
    console.log('数据库连接断开');
  }); //设置连接断开的回调函数
};
