import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist
const setting = require('./settings');
const ENV = process.env.NODE_ENV;
const IS_LOCALTION = process.env.VUE_APP_BASE_API === '/api';
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);
  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (IS_LOCALTION && to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.userinfo.staffId;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          const accessRoutes = await store.dispatch('user/getUserInfo');
          console.log(accessRoutes);
          await store.dispatch('permission/GenerateRoutes', accessRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          await store.dispatch('permission/ResetRoutes');
          Message.error(error || 'Has Error');
          if (IS_LOCALTION) {
            // if is logged in, redirect to the home page
            next(`/login?redirect=${to.path}`);
          } else {
            window.location.replace(`${setting.redirect[ENV]}?orignFrom=${location.href}`);
            next();
          }
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    if (IS_LOCALTION && whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      if (IS_LOCALTION) {
        // if is logged in, redirect to the home page
        next(`/login?redirect=${to.path}`);
      } else {
        window.location.replace(`${setting.redirect[ENV]}?orignFrom=${location.href}`);
        next();
      }
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
