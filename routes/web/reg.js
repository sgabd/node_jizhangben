var express = require('express');
const md5 = require('md5');
var router = express.Router();
const UserModel = require('../../models/UserModel');
const { get } = require('mongoose');

router.get('/reg', (req, res, next) => {
  res.render('auth/reg');
})

router.post('/reg', (req, res, next) => {
  UserModel.create({...req.body, password: md5(req.body.password)}).then(() => {
    res.render('success', {msg: '注册成功', url: '/login'})
  }).catch(err => {
    console.log('err', err)
    res.status(400).send('注册失败')
  })
})

router.get('/login', (req, res, next) => {
  res.render('auth/login');
})


router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  UserModel.findOne({username, password: md5(password)}).then(user => {
    console.log('🚀 ~ UserModel.findOne1 ~ user:', user)
    if (user) {
      req.session.username = user.username;
      req.session.userId = user._id;
      res.render('success', {msg: '登录成功', url: '/account'})
      // res.redirect('/account');
    } else {
      res.status(400).send('用户名或密码错误')
    }
  }).catch(err => {
    console.log('err', err)
    res.status(400).send('登录失败')
  })
})

router.post('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.render('success', { msg: '退出成功', url: '/login' })
  })
})

module.exports = router;
