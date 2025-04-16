const express = require('express');
const dayjs = require('dayjs');
const AccountModel = require('../../models/AccountModel');
const router = express.Router();

const checkLogin = (req, res, next) => {
  if (!req.session.username) {
    res.redirect('/login')
  }
  next()
}


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/account') // 重定向到账目列表
});

router.get('/account', checkLogin, async function(req, res, next) {
  const data = await AccountModel.find().sort({time: -1}).exec()
  console.log(data);
  res.render('list', { accounts: data, dayjs });
  // const accounts = db.get('accounts').value()
  // res.render('list', { accounts });
});

router.get('/account/create', checkLogin, function(req, res, next) {
  res.render('create');
});

router.post('/account', checkLogin,(req, res, next) => {
  // console.log(req.body);
  AccountModel.create({
    ...req.body,
    time: dayjs(req.body.time).toDate()
  }).then(account => {
    console.log('🚀 ~ AccountModel.create ~ account:', account)
    res.render('success', { msg : '添加成功~~~~~', url : '/account' })
  }).catch(err => {
    console.log(err)
    res.status(500).send('插入失败')
    // res.render('error', { error : err.message })
  })
  // let id = shortid.generate()
  // db.get('accounts').unshift({id, ...req.body}).write()
  // res.send('account created');
  // res.render('success', { msg : '添加成功~~~~~', url : '/account' })
})

router.get('/account/:id', checkLogin, (req, res, next) => {
  let id = req.params.id
  AccountModel.deleteOne({_id: id}).then(result => {
    console.log('🚀 ~ AccountModel.deleteOne ~ result:', result)
    res.render('success', { msg : '删除成功~~~~~', url : '/account' })
  }).catch(err => {
    console.log(err)
    res.status(500).send('删除失败')
  })
  // db.get('accounts').remove({id}).write()
  // res.render('success', { msg : '删除成功~~~~~', url : '/account' })
})


module.exports = router;
