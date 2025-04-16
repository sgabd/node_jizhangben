const mongoose = require('mongoose')
// 创建一个Schema 包含文档的属性及属性
const AccountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  time: Date,
  type: {
    type: Number,
    default: 1,
  },
  account: {
    type: Number,
    required: true
  },
  remarks: {
    type: String,
  }
})
// 创建一个模型对象   对文档操作的封装对象
const AccountModel = mongoose.model('accounts', AccountSchema)

module.exports = AccountModel