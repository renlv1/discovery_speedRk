//   公共请求数据
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import fetch from './api/api'
import {login} from "./api/login";
// import {getToken, setToken} from "./utils/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    merchantTask: {}, // 藏宝设置
    mStatus: {}, // 商户状态
    userInfo: [],
    isMerchant: '',
    userData: '',
    account: '',
    user: '',
    loginFlag: false,
    takeOrderDeposit: '', //chon
    takeOrderDraw: '', //提现
    isboss: '',
    piBalance: '',
    currentCoin: 'USD', // 当前支付的币种
    currentCoinIndex: '' || 0,
    bankId: '', // 银行卡id
    accountNumber: '', // 银行卡号
    accountType: '', // 银行卡类型
    address: '', // 用户地址
    label: '', // Tab状态
    voteLabel: '', // voteLabel的状态
    googleCode: '', // 谷歌验证码 1：未设置  2:开启  3:关闭
    userName: '', // 用户名
    email: '', // 邮箱
    // requestLoading: false, // loading状态
    votePageState: { // 记录选项卡的位置
      head: 0,
      foot: 0
    },

    // 记录藏宝的底部选项卡
    footerTreasureIndex: 0,

    // 记录共享者顶部状态
    currentShareStatusHeader: 2,
    currentShareStatusFooter: 0,

    footTab: 0,
    shareStatus: Number,
    topUpAmount: '',
    accountBankId: '',
    errMsg: '',
    taken: undefined,
    code: '',
    slideMode: 1,
    shareName: '',
    shareAdderss: '',
    sharePhoneNumber: '',
    shareGuarantor: '',
    shareRechargeFree: '',
    shareWithdrawFree: '',
    shareAccountType: '',
    shareAccount: '',
    usdBalance: '',
    fundBalance: '',
    voucherBalance: '',
    isiOS: false,
    setCenter: {lng: 0, lat: 0},
    setTaskIndex: 0,
    setTaskContent: '',
    setFriendNum: '不限',
    setWeeks: '',
    setMoney: '',
    setRealAddress: '',
    setSelectAddress: '',
    paiPurseBalance: '',
    setYuBaoTabs: 0,
    headTab: 0,
    merchantInfo: {},
    cartStatus: true,
    productCar: [],
    enterFlag: '',
    editFlag: '',
    orderFlag: '',
    merIdAddress: '',
    detailFlag: 0 // 0： pai付  1：商户信息
  },
  getters: {
    userInfo: state => state.userInfo, // 用户信息balanceData.user
    loginFlag: state => state.loginFlag,
    userData: state => state.userData,
    isboss: state => state.userData.isboss,
    account: state => state.account,
    piBalance: state => state.piBalance,
    voucherBalance: state => state.voucherBalance,
    fundBalance: state => state.fundBalance,
    isMerchant: state => state.isMerchant,
    currentCoin: state => state.currentCoin,
    currentCoinIndex: state => state.currentCoinIndex,
    bankId: state => state.bankId,
    accountNumber: state => state.accountNumber,
    accountType: state => state.accountType,
    address: state => state.address,
    label: state => state.label,
    voteLabel: state => state.voteLabel,
    googleCode: state => state.googleCode,
    userName: state => state.userName,
    usdBalance: state => state.usdBalance,
    email: state => state.email,
  },
  actions: {
    // user login
    login({commit}, userInfo) {
      const {username, password} = userInfo
      return new Promise((resolve, reject) => {
        login({username: username.trim(), password: password}).then((res) => {
          const {data} = res
          if (!data.success) {
            commit('SET_ERR', data.msg)
          } else {
            commit('SET_ERR', '')
            commit('SET_ADDRESS', data.data.account.address)
            commit('SET_USER_NAME', data.data.user.username)
            commit('SET_EMAIL', data.data.user.email)
            commit('SET_MENU_FOOT_TAB', 0)
            commit('SET_TOKEN', '123')
            commit('SET_GOOGLE', data.data.user.openGoogleCode)

            localStorage.setItem('userName', data.data.user.username)
          }
          resolve()
        }).catch(error => {
          reject(error)
          // this.toastD(res.msg)
        })
      })
    },

    // user info
    getUserBalance({commit}) {
      fetch.get('user/balance').then((res) => {
        if (res.success === true) {
          commit('GET_USER_INFO', res.data)
          commit('SET_GOOGLE', res.data.user.openGoogleCode)
          commit('SET_SHARE_STATUS',)
          commit('SET_ADDRESS', res.data.account.address)
          commit('SET_IS_MERCHANT', res.data.isMerchant)
        } else {
          router.push('/login')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
  },
  mutations: {
    GET_USER_INFO(state, data) {
      this.loginFlag = true
      state.account = data.account
      state.userData = data.user
      state.userName = data.user.username
      state.email = data.user.email
      state.isboss = data.user.isboss
      state.isMerchant = data
      state.userInfo = data
      state.address = data.user.address
      state.piBalance = data.account.piBalance
      state.paiPurseBalance = data.account.paiPurseBalance
      state.usdBalance = data.account.usdBalance
      state.fundBalance = data.account.fundBalance
      state.voucherBalance = data.account.voucherBalance
    },
    SET_CURRENT_COIN(state, currentCoin) {
      state.currentCoin = currentCoin
    },
    SET_CURRENT_COIN_INDEX(state, currentCoinIndex) {
      state.currentCoinIndex = currentCoinIndex
    },
    SET_BANK_ID(state, bankId) {
      state.bankId = bankId
    },
    SET_ACCOUNT_NUMBER(state, accountNumber) {
      state.accountNumber = accountNumber
    },
    SET_ACCOUNT_TYPE(state, accountType) {
      state.accountType = accountType
    },
    CART_TOTAL_NUM (state, data) {
      state.cartStatus = data
    },
    SET_ADDRESS(state, address) {
      state.address = address
    },
    SET_LABEL(state, label) {
      state.label = label
    },
    SET_VOTE_LABEL(state, voteLabel) {
      state.voteLabel = voteLabel
    },
    SET_GOOGLE(state, googleCode) {
      state.googleCode = googleCode
    },
    SET_USER_NAME(state, userName) {
      state.userName = userName
    },
    SET_EMAIL(state, email) {
      state.email = email
    },
    // SET_LOADING(state, boolean) {
    //   state.loading = boolean
    // },
    SET_TAB_RECORD(state, data) {
      state.votePageState = data
    },

    SET_CURRENT_SHARE_STATUS_HEADER(state, data) {
      state.currentShareStatusHeader = data
    },

    SET_CURRENT_SHARE_STATUS_FOOTER(state, data) {
      state.currentShareStatusFooter = data
    },

    SET_MENU_FOOT_TAB(state, index) {
      state.footTab = index
    },
    SET_SHARE_STATUS(state, status) {
      state.shareStatus = status
    },
    TOP_UP_AMOUNT(state, amount) {
      state.topUpAmount = amount
    },
    SET_ACCOUNT_BANK_ID(state, id) {
      state.accountBankId = id
    },
    SET_ERR(state, msg) {
      state.errMsg = msg
    },
    SET_TOKEN(state, taken) {
      state.taken = taken
    },
    SET_DEPOSIT(state, taken) {
      state.takeOrderDeposit = taken
    },
    SET_DRAW(state, taken) {
      state.takeOrderDraw = taken
    },
    SET_SLIDE_MODE(state, data) {
      state.slideMode = data
    },
    SET_SHARE_NAME(state, data) {
      state.shareName = data
    },
    SET_SHARE_ADDRESS(state, data) {
      state.shareAdderss = data
    },
    SET_SHARE_PHONE_NUMBER(state, data) {
      state.sharePhoneNumber = data
    },
    SET_SHARE_GUARANTOR(state, data) {
      state.shareGuarantor = data
    },
    SET_SHARE_RECHARGE_FREE(state, data) {
      state.shareRechargeFree = data
    },
    SET_SHARE_WITHDRAW_FREE(state, data) {
      state.shareWithdrawFree = data
    },
    SET_SHARE_ACCOUNT_TYPE(state, data) {
      state.shareAccountType = data
    },
    SET_SHARE_ACCOUNT(state, data) {
      state.shareAccount = data
    },
    IS_IOS(state, data) {
      state.isiOS = data
    },
    SET_FOOTET_TREASURE(state, data) {
      state.footerTreasureIndex = data
    },
    SET_CENTER(state, data) {
      state.setCenter = data
    },
    SET_TASK_INDEX(state, data) {
      state.setTaskIndex = data
    },
    SET_TASK_CONTENT(state, data) {
      state.setTaskContent = data
    },
    SET_FRIEND_NUM(state, data) {
      state.setFriendNum = data
    },
    SET_WEEKS(state, data) {
      state.setWeeks = data
    },
    SET_MONEY(state, data) {
      state.setMoney = data
    },
    SET_REAL_ADDRESS(state, data) {
      state.setRealAddress = data
    },
    SET_SELECT_ADDRESS(state, data) {
      state.setSelectAddress = data
    },
    SET_YU_BAO_TAB(state, data) {
      state.setYuBaoTabs = data
    },
    SET_HEAD_TAB(state, data) {
      state.headTab = data
    },
    SET_IS_MERCHANT(state, data) {
      state.isMerchant = data
    },
    SET_MERCHANT_INFO(state, data) {
      state.merchantInfo = data
    },
    SET_STATUS (state, data) {
      state.mStatus = data
    },
    SET_MERCHANT_TASK(state, data) {
      state.merchantTask = data
    },
    SET_PRODUCT_CAR(state, data) {
      state.productCar = data
    },
    SET_ENTER_FLAG(state, data) {
      state.enterFlag = data
    },
    SET_EDIT_FLAG(state, data) {
      state.editFlag = data
    },
    SET_ORDER_FLAG(state, data) {
      state.orderFlag = data
    },
    SET_MER_ID(state, data) {
      state.merIdAddress= data
    },
    SET_DETAIL_FLAG(state, data) {
      state.detailFlag= data
    }
  }
})
