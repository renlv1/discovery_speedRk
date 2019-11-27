import router from './router'
import store from './store'


// const whiteList = ['login', 'register', 'forget'] // whitelist
// const LOGIN_PAGE_NAME = 'login'
// const homeName = 'menu'


// router.beforeEach((to, from, next) => {
//   // console.log(!store.state.taken && to.name === LOGIN_PAGE_NAME)
//   if (!store.state.taken && to.name !== LOGIN_PAGE_NAME) {
//     // 未登录且要跳转的页面不是登录页
//     next({
//       name: LOGIN_PAGE_NAME // 跳转到登录页
//     })
//   } else if (!store.state.taken && to.name === LOGIN_PAGE_NAME) {
//
//     // 未登录且要跳转的页面是登录页
//   } else if (store.state.taken && to.name === LOGIN_PAGE_NAME) {
//     next({
//       name: homeName
//     })
//
//   } else {
//     next()
//   }
// })

// router.beforeEach((to, from, next) => {
//   // console.log(to.matched.some(r => r.meta.requireAuth), store.state.taken)
//   if (to.matched.some(r => r.meta.requireAuth)) {
//     if (store.state.taken) {
//       next();
//     }
//     else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath}
//       })
//     }
//   }
//   else {
//     next();
//   }
// })
