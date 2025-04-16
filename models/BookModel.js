const mongoose = require('mongoose')
// 创建一个Schema 包含文档的属性及属性
const BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
  is_hot: Boolean,
  tags: Array,
  create_date: Date,
})
// 创建一个模型对象   对文档操作的封装对象
const BookModel = mongoose.model('books', BookSchema)

module.exports = BookModel