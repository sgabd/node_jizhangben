const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs');
const AccountModel = require('../../models/AccountModel');
const { secret } = require('../../config/config')
const checkToken = (req, res, next) => {
  const token = req.get('token')
  if (!token) {
    return res.json({
      code: 2004,
      msg: 'token缺失',
      data: null
    })
  }
  jwt.verify(token, secret, (err, user)=> {
    if (err) {
      return res.json({
        code: 2003,
        msg: 'token 校验失败',
        data: null
      })
    }
    // 保存用户信息
    // req.user = user
    next()
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 获取所有账目
router.get('/account', checkToken, async (req, res, next) => {
  console.log('🚀 ~ router.get ~ req.user:', req.user)
  const data = await AccountModel.find().sort({time: -1}).exec()
  // console.log('🚀 ~ data:', data);
  res.json({
    code: 200,
    msg: '获取成功',
    data: data
  })
  res.render('list', { accounts: data, dayjs });
});

// 新增账目
router.post('/account', checkToken, (req, res, next) => {
  AccountModel.create({
    ...req.body,
    time: dayjs(req.body.time).toDate()
  }).then(account => {
    console.log('🚀 ~ AccountModel.create ~ account:', account)
    // res.render('success', { msg : '添加成功~~~~~', url : '/account' })
    res.json({
      code: 200,
      msg: '添加成功',
      data: account,
    })
  }).catch(err => {
    console.log(err)
    // res.status(500).send('插入失败')
    res.json({
      code: 500,
      msg: '插入失败',
      data: null,
    })
  })
})

// 删除账目
router.delete('/account/:id', checkToken, (req, res, next) => {
  let id = req.params.id
  AccountModel.deleteOne({_id: id}).then(result => {
    console.log('🚀 ~ AccountModel.deleteOne ~ result:', result)
    res.json({
      code: 200,
      msg: '删除成功',
      data: null,
    })
    // res.render('success', { msg : '删除成功~~~~~', url : '/account' })
  }).catch(err => {
    console.log(err)
    // res.status(500).send('删除失败')
    res.json({
      code: 500,
      msg: '删除失败',
      data: null,
    })
  })
})

// 获取单条数据
router.get('/account/:id', checkToken, (req, res, next) => {
  const { id } = req.params
  AccountModel.findById(id).then(account => {
    console.log('🚀 ~ AccountModel.findById ~ account:', account)
    res.json({
      code: 200,
      msg: '获取成功',
      data: account,
    })
  }).catch(err => {
    console.log(err)
    // res.status(500).send('获取失败')
    res.json({
      code: 500,
      msg: '获取失败',
      data: null,
    })
  })
})

// 更新账目
router.patch('/account/:id', checkToken, (req, res, next) => {
  const { id } = req.params
  AccountModel.updateOne({_id: id}, req.body).then(account => {
    console.log('🚀 ~ AccountModel.updateOne ~ account:', account)
    AccountModel.findById(id).then(data => {
      console.log('🚀 ~ AccountModel.findById ~ account:', data)
      res.json({
        code: 200,
        msg: '更新成功',
        data: data,
      })
    })
  }).catch(err => {
    console.log(err)
    // res.status(500).send('更新失败')
    res.json({
      code: 500,
      msg: '更新失败',
      data: null,
    })
  })
})


module.exports = router;
