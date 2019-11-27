import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'is-active', /* 设置router-link 激活样式方法1 */
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    { // 登录
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue'),
    },
    { // 注册
      path: '/register',
      name: 'register',
      component: () => import('./views/register/register'),
    },
    { // 忘记密码
      path: '/forget',
      name: 'forget',
      component: () => import('./views/register/forget'),
      children: [
        {
          path: 'forgetNext',
          component: () => import('./views/register/forgetNext')
        }
      ]
    },
    { // 菜单
      path: '/menu',
      name: 'menu',
      component: () => import('./views/menu/index.vue'),
      meta: {requireAuth: true}
    },
    { // 公投中心
      path: '/voteCenter',
      name: 'voteCenter',
      component: () => import('./views/voteCenter/voteCenter.vue')
    },
    { // 公投详情
      path: '/voteCenter/:id',
      name: 'voteCenterDetail',
      component: () => import('./views/voteCenter/detail.vue')
    },

    { // 安全设置
      path: '/safeSetting',
      name: 'safeSetting',
      component: () => import('./views/safeSetting/index.vue')
    },
    { // 设置安全密码
      path: '/safeCode',
      name: 'safeCode',
      component: () => import('./views/safeSetting/safeCode.vue')
    },
    { // 未绑定谷歌
      path: '/notGoogle',
      name: 'notGoogle',
      component: () => import('./views/safeSetting/gogleSetting/notGoogle/notGoogle.vue')
    },
    { // 绑定谷歌第一步
      path: '/bindingOne',
      name: 'bindingOne',
      component: () => import('./views/safeSetting/gogleSetting/notGoogle/bindingOne.vue')
    },
    { // 绑定谷歌第二步
      path: '/bindingTwo',
      name: 'bindingTwo',
      component: () => import('./views/safeSetting/gogleSetting/notGoogle/bindingTwo.vue')
    },
    { // 已开启
      path: '/openGoogle',
      name: 'openGoogle',
      component: () => import('./views/safeSetting/gogleSetting/okGoogle/openGoogle.vue')
    },
    { // 未开启
      path: '/notOpenGoogle',
      name: 'notOpenGoogle',
      component: () => import('./views/safeSetting/gogleSetting/okGoogle/notOpenGoogle.vue')
    },
    { // 钱包
      path: '/wallet',
      name: 'wallet',
      component: () => import('./views/wallet/index')
    },
    { // 钱包 -- 钱包资产
      path: '/walletMoney',
      name: 'walletMoney',
      component: () => import('./views/wallet/walletMoney')
    },
    { // 账户管理
      path: '/accountManagement',
      name: 'accountManagement',
      component: () => import('./views/accountManagement/index')
    },
    { // 币种账户
      path: '/accountCurrency',
      name: 'accountCurrency',
      component: () => import('./views/accountManagement/accountCurrency')
    },
    { // 添加新账户 addBank
      path: '/addBank',
      name: 'addBank',
      component: () => import('./views/accountManagement/addBank')
    },
    { // 交易所
      path: '/exchange',
      name: 'exchange',
      component: () => import('./views/exchange.vue')
    },
    { // 行情
      path: '/market',
      name: 'home',
      component: () => import('./views/home.vue')
    },
    { // 充值
      path: '/topUp',
      name: 'topUp',
      component: () => import('./views/topUp/topUp'),
    },
    { // 充值类型
      path: '/topUp/payType',
      name: 'payType',
      component: () => import('./views/payType/payType'),
    },
    { // 充值账号
      path: '/topUp/payAccount',
      component: () => import('./views/payAccount/payAccount')
    },
    { // 选择共享者
      path: '/topUp/chooseShare',
      name: 'chooseShare',
      component: () => import('./views/chooseShare/chooseShare')
    },
    { // 充值订单
      path: '/topUp/topUpOrder',
      name: 'topUpOrder',
      component: () => import('./views/OrderTemplete/orderTemplate')
    },
    { // 充值订单详情
      path: '/topUp/topUpOrder/:id',
      component: () => import('./views/OrderTemplete/listDetail')
    },
    { // 账单
      path: '/bill',
      name: 'bill',
      component: () => import('./views/bill/bill')
    },
    { // 账单
      path: '/bill/:id',
      name: 'billDetail',
      component: () => import('./views/bill/billDetail')
    },
    { // 申述
      path: '/complaint',
      name: 'complaint',
      component: () => import('./views/complaint/complaint')
    },
    { // 申述订单
      path: '/complaintOrder',
      name: 'complaintOrder',
      component: () => import('./views/complaint/complaintOrder')
    },
    { // 申述订单详情
      path: '/complaintOrder/:id',
      name: 'complaintOrderDetail',
      component: () => import('./views/complaint/complaintOrderDetail')
    },
    { // 共享者(未开通)
      path: '/notOpenShare/notOpenShare',
      name: 'notOpenShare',
      component: () => import('./views/notOpenShare/notOpenShare')
    },
    { // 申请共享者
      path: '/notOpenShare/apply',
      name: 'apply',
      component: () => import('./views/notOpenShare/openForm')
    },
    { // 共享者申请---审核页面
      path: '/auditSharer',
      name: 'auditSharer',
      component: () => import('./views/notOpenShare/auditSharer')
    },
    { // 订单管理
      path: '/billManage/billManage',
      name: 'billManage',
      component: () => import('./views/billManage/billManage')
    },
    { // 选择区号
      path: '/notOpenShare/selectArea',
      name: 'selectArea',
      component: () => import('./views/notOpenShare/selectArea')
    },
    // 提现账号
    {
      path: '/withdrawDeposits/payAccount',
      name: 'payAccount',
      component: () => import('./views/withdrawDeposits/payAccount.vue')
    },
    { // 提现——renlv
      path: '/withdrawDeposit',
      name: 'withdrawDeposit',
      component: () => import('./views/withdrawDeposits/withdrawDeposit.vue')
    },
    { // 提现订单
      path: '/withdrawalOrder',
      name: 'withdrawalOrder',
      component: () => import('./views/withdrawDeposits/withdrawalOrder.vue')
    },
    // 提现订单详情
    {
      path: '/theOrderDetails',
      name: 'theOrderDetails',
      component: () => import('./views/withdrawDeposits/theOrderDetails.vue')
    },
    {
      path: '/tradeOrder', // 数字货币交易订单
      name: 'tradeOrder',
      component: () => import('./views/digitalTradeOrder/tradeOrder')
    },
    {
      path: '/orderDetail', // 订单详情
      name: 'orderDetail',
      component: () => import('./views/digitalTradeOrder/orderDetail')
    },
    {
      path: '/transfer', // 转账
      name: 'transfer',
      component: () => import('./views/transfer/transfer')
    },
    {
      path: '/transferRecord', // 转账记录
      name: 'transferRecord',
      component: () => import('./views/transfer/transferRecord')
    },
    {
      path: '/friendTransfer', // 向好友转账
      name: 'friendTransfer',
      component: () => import('./views/transfer/friendTransfer')
    },
    {
      path: '/transferUser', // 向用户转账
      name: 'transferUser',
      component: () => import('./views/transfer/transferUser')
    },
    {
      path: '/confirmTransfer', // 确认转账
      name: 'confirmTransfer',
      component: () => import('./views/transfer/confirmTransfer')
    },
    /*{
      path: '/sharer',
      redirect: {name: 'sharer'},
      component: () => import('./views/sharer/sharer.vue'),
      children: [
        // 共享者--充值订单
        {
          path: '/sharer',
          name: 'sharer',
          component: () => import('./views/sharer/orderTemplate.vue')
        },
        { // 共享者-- 提现订单
          path: '/withdrawalOrders',
          name: 'withdrawalOrders',
          component: () => import('./views/sharer/withdrawalOrders.vue')
        },
      ]
    }*/,
    // 共享者审核通过
    {
      path: '/sharer',
      name: 'sharer',
      component: () => import('./views/sharer/orderTemplate.vue')
    },
    // 共享者设置
    {
      path: '/sharerSettings',
      name: 'sharerSettings',
      component: () => import('./views/sharer/sharerSettings.vue')
    },
    // 共享者设置----支持币种管理
    {
      path: '/currencyManagement',
      name: 'currencyManagement',
      component: () => import('./views/sharer/currencyManagement.vue')
    },
    //共享者设置----支持币种管理---币种接单
    {
      path: '/orderReceiving',
      name: 'orderReceiving',
      component: () => import('./views/sharer/orderReceiving.vue')
    },
    // 共享者设置----添加币种新账户
    {
      path: '/addBankAccount',
      name: 'addBankAccount',
      component: () => import('./views/sharer/addBankAccount.vue')
    },
    // 共享者设置----联系方式
    {
      path: '/contactWay',
      name: 'contactWay',
      component: () => import('./views/sharer/contactWay.vue')
    },
    {
      path: '/billDetail', // 账单详情
      name: 'transferDetail',
      component: () => import('./views/transfer/billDetail')
    },
    {
      path: '/treasure', // 藏宝
      name: 'treasure',
      component: () => import('./views/treasure/treasure')
    },
    {
      path: '/findTreasure', // 寻宝
      name: 'findTreasure',
      component: () => import('./views/treasure/findTreasure')
    },
    {
      path: '/mergeMap', // 合并藏宝图
      name: 'mergeMap',
      component: () => import('./views/findTreasure/mergeMap')
    },
    {
      path: '/waBao', //寻宝 -- 挖宝
      name: 'waBao',
      component: () => import('./views/findTreasure/waBao')
    },
    {
      path: '/myFindTreasure', //寻宝 -- 我的藏宝图
      name: 'myFindTreasure',
      component: () => import('./views/findTreasure/myFindTreasure')
    },
    {
      path: '/findMy', //寻宝 -- 我的
      name: 'findMy',
      component: () => import('./views/findTreasure/findMy')
    },
    {
      path: '/findIncome', //寻宝 -- 我的 - 寻宝收入
      name: 'findIncome',
      component: () => import('./views/findTreasure/findIncome')
    },
    {
      path: '/propsCard', //寻宝 -- 我的 - 道具卡
      name: 'propsCard',
      component: () => import('./views/findTreasure/propsCard')
    },
    {
      path: '/map3', //寻宝 -- 选择地址
      name: 'map3',
      component: () => import('./views/findTreasure/map3')
    },
    {
      path: '/findDetails', //寻宝 -- 宝藏详情
      name: 'findDetails',
      component: () => import('./views/findTreasure/findDetails')
    },
    {
      path: '/taskDetails', //寻宝 -- 任务详情
      name: 'taskDetails',
      component: () => import('./views/findTreasure/taskDetails')
    },
    {
      path: '/treasureNext', // 寻宝下一步
      name: 'treasureNext',
      component: () => import('./views/treasure/treasureNext')
    },
    {
      path: '/task', // 藏宝任务
      name: 'task',
      component: () => import('./views/treasure/task')
    },
    {
      path: '/chooseTime', // 选择挖宝时间
      name: 'chooseTime',
      component: () => import('./views/treasure/chooseTime')
    },
    {
      path: '/PriorityAllocation',
      name: 'PriorityAllocation',
      component: () => import('./views/treasure/PriorityAllocation')
    },
    {
      path: '/confirmedTask',
      name: 'confirmedTask',
      component: () => import('./views/treasure/confirmedTask')
    },
    {
      path: '/myTask',
      name: 'myTask',
      component: () => import('./views/treasure/myTask')
    },
    {
      path: '/myTaskDetail',
      name: 'myTaskDetail',
      component: () => import('./views/treasure/myTaskDetail')
    },
    {
      path: '/createTemplate',
      name: 'createTemplate',
      component: () => import('./views/treasure/createTemplate')
    },
    {
      path: '/modify',
      name: 'modify',
      component: () => import('./views/treasure/modify')
    },
    {
      path: '/giveFraction',
      name: 'giveFraction',
      component: () => import('./views/treasure/giveFraction')
    },
    {
      path: '/paiFund',
      name: 'paiFund',
      component: () => import('./views/fund/paiFund')
    },
    {
      path: '/selfHelp',
      name: 'selfHelp',
      component: () => import('./views/fund/selfHelp')
    },
    {
      path: '/payWallet',
      name: 'payWallet',
      component: () => import('./views/fund/payWallet')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('./views/fund/order')
    },
    {
      path: '/fundDetail',
      name: 'fundDetail',
      component: () => import('./views/wallet/fundDetail')
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: () => import('./views/wallet/coupon')
    },
    {
      path: '/trans',
      name: 'trans',
      component: () => import('./views/fund/trans')
    },
    {
      path: '/fundOrderDetail',
      name: 'fundOrderDetail',
      component: () => import('./views/fund/orderDetail')
    },
    {
      path: '/addDetail',
      name: 'addDetail',
      component: () => import('./views/fund/addDetail')
    },
    {
      path: '/fundTransDetail',
      name: 'fundTransDetail',
      component: () => import('./views/fund/fundTransDetail')
    },
    {
      path: '/yuBao',
      name: 'yuBao',
      component: () => import('./views/yuBao/yuBao')
    },
    {
      path: '/yuBaoBill',
      name: 'yuBaoBill',
      component: () => import('./views/yuBao/yuBaoBill')
    },
    {
      path: '/income',
      name: 'income',
      component: () => import('./views/yuBao/income')
    },
    {
      path: '/transYuBao',
      name: 'transYuBao',
      component: () => import('./views/yuBao/transYuBao')
    },
    {
      path: '/faction',
      name: 'faction',
      component: () => import('./views/yuBao/faction')
    },
    {
      path: '/factionRecord',
      name: 'factionRecord',
      component: () => import('./views/yuBao/factionRecord')
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('./views/pay/index')
    },
    {
      path: '/filter',
      name: 'filter',
      component: () => import('./views/pay/filter')
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: () => import('./views/pay/productDetail')
    },
    {
      path: '/shopDetail',
      name: 'shopDetail',
      component: () => import('./views/pay/shopDetail')
    },
    {
      path: '/openShop',
      name: 'openShop',
      component: () => import('./views/shop/openShop')
    },
    {
      path: '/notOpen', // 未开通
      name: 'notOpen',
      component: () => import('./views/shop/notOpen')
    },
    {
      path: '/stepOne', // 申请商户
      name: 'stepOne',
      component: () => import('./views/shop/notOpen/stepOne')
    },
    {
      path: '/stepTwo',  // 申请商户
      name: 'stepTwo',
      component: () => import('./views/shop/notOpen/stepTwo')
    },
    {
      path: '/reason',  // 审核
      name: 'reason',
      component: () => import('./views/shop/notOpen/reason')
    },
    {
      path: '/shopInformation',
      name: 'shopInformation',
      component: () => import('./views/shop/shopInformation')
    },
    {
      path: '/paiOrder', // 商城订单
      name: 'paiOrder',
      component: () => import('./views/shop/paiOrder')
    },
    {
      path: '/confirmOrder', // 确认订单
      component: require('./views/pay/confirmOrder').default
    },
    {
      path: '/goodsmanage', // 商品管理
      component: require('./views/shop/goodsmanage').default
    },
    {
      path: '/myShopping', // 我的购物车
      name: 'myShopping',
      component: () => import('./views/shop/myShopping')
    },
    {
      path: '/shippingAddress', // 收获地址
      name: 'shippingAddress',
      component: () => import('./views/shop/shippingAddress')
  },
    {
      path: '/addAddress', // 新增地址
      name: 'addAddress',
      component: () => import('./views/shop/addAddress')
    },
    {
      path: '/addGoods', // 新增商品
      name: 'addGoods',
      component: () => import('./views/shop/addGoods')
    },
    {
      path: '/editGoods', // 编辑商品
      name: 'editGoods',
      component: () => import('./views/shop/editGoods')
    },
    {
      path: '/goodsType', // 商品类别
      name: 'goodsType',
      component: () => import('./views/shop/goodsType')
    },
    {
      path: '/hiddenSetting', // 商家 --- 藏宝设置
      component: require('./views/shop/hiddenSetting/hiddenSetting').default
    },
    {
      path: '/hideTime', // 商家 --- 藏宝时间
      component: require('./views/shop/hiddenSetting/hideTime').default
    },
    {
      path: '/payCode', // 收款码
      component: require('./views/shop/payCode/payCode').default
    },
    {
      path: '/myShop', // 我的个人商户
      component: require('./views/account/account').default
    },
    {
      path: '/paiPayDetail', // 派付返还详情
      component: require('./views/account/paiPayDetail').default
    },
    {
      path: '/myPiOrder', // 我的商城订单
      component: require('./views/account/myPiOrder').default
    },
    {
      path: '/myOrderDetail', // 我的商城订单
      component: require('./views/account/myOrderDetail').default
    },
    {
      path: '/Logistics', // 物流详情
      component: require('./views/account/Logistics').default
    },
    {
      path: '/offlineOrder', // 线下订单
      component: require('./views/account/offlineOrder').default
    },
    {
      path: '/offlineOrderDetail', // 线下订单详情
      component: require('./views/account/offlineOrderDetail').default
    },
    {
      path: '/payReturn', // π付返还
      component: require('./views/account/payReturn').default
    },
    {
      path: '/payResult', // 收款码结果
      component: require('./views/shop/payCode/payResult').default
    },
    {
      path: '/payResultSuccess', // 收款码结果
      component: require('./views/shop/payCode/payResultSuccess').default
    },
    {
      path: '/facePay', // 收款码结果
      component: require('./views/shop/payCode/facePay').default
    },
    {
      path: '/sellShip', // 卖家填写发货信息
      component: require('./views/shop/sellShip').default
    },
    {
      path: '/shopTransactionList', // 交易记录
      component: require('./views/shop/shopTransactionList').default
    },
    {
      path: '/shopTransactionListDetail', // 交易记录
      component: require('./views/shop/shopTransactionListDetail').default
    },
    {
      path: '/paymentCurrency', // 收款币种
      component: require('./views/shop/paymentCurrency').default
    },
    {
      path: '/marginTrade', // 商家支付保证金
      component: require('./views/shop/marginTrade').default
    },
    {
      path: '/postage', // 邮费设置
      component: require('./views/shop/postage').default
    },
    {
      path: '/categories', // 商品分类管理
      component: require('./views/shop/categories').default
    },
    {
      path: '/BulkManage', // 批量管理
      component: require('./views/shop/BulkManage').default
    },
    {
      path: '/userInformation', // 商户资料
      component: require('./views/shop/userInformation').default
    },
    {
      path: '/modifyOne', // 修改商户资料上面部分
      component: require('./views/shop/modifyOne').default
    },
    {
      path: '/modifyTwo', // 修改商户资料下面部分
      component: require('./views/shop/modifyTwo').default
    },
  ]
})

// const pathArr = []
// router.beforeEach((to, from, next) => {
//   const path = to.path
//   const index = pathArr.indexOf(path)
//
//   if (index > -1 || path === '/menu') {
//     const fromPathIndex = pathArr.indexOf(from.Path)
//     pathArr.splice(index, 1)
//     pathArr.splice(fromPathIndex, 1)
//     store.commit('SET_SLIDE_MODE', 0)
//   } else {
//     pathArr.push(from.path)
//     pathArr.push(path)
//     store.commit('SET_SLIDE_MODE', 1)
//   }
//   next()
// })

router.afterEach(() => {
  // 为什么要设100， 因为iOS webview电池栏有留白， 为了兼顾 ios 和 iosx
  document.body.scrollTop = -100;
})

export default router
