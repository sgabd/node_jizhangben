var express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../../models/UserModel');
const { secret } = require('../../config/config')

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  UserModel.findOne({username, password: md5(password)}).then(user => {
    console.log('🚀 ~ UserModel.findOne ~ user:', user)
    if (user) {
      //创建token
      const token = jwt.sign({
        username: user.username,
        _id: user._id,
      }, secret, {
        expiresIn: 60 * 60 * 24 * 7, // 单位秒  7day
      })
      res.json({
        code: 200,
        msg: '登录成功',
        data: token
      })
    } else {
      res.json({
        code: 2001,
        msg: '用户名或密码错误',
        data: null
      })
    }
  }).catch(err => {
    console.log('err', err)
    res.json({
      code: 20001,
      msg: '数据库读取失败',
      data: null
    })
  })
})

router.post('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.render('success', { msg: '退出成功', url: '/login' })
  })
})

module.exports = router;
