const mongoose = require('mongoose')
// 创建一个Schema 包含文档的属性及属性
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
})
// 创建一个模型对象   对文档操作的封装对象
const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel