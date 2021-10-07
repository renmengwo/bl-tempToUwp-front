import { login, logout, getUserInfo } from '@/api/user';
import { getToken, setToken, removeToken, setStorage, getStorage, removeStorage } from '@/utils/auth';
import { findStaffResList } from '@/api/common';
import { resetRouter } from '@/router';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userinfo: {},
    menu: [],
    regcodeList: getStorage('regcodeList'),
    regcode: getStorage('regcode')
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USERINFO: (state, info) => {
    /* const userInfo = JSON.parse(JSON.stringify(state));
    userInfo.userinfo = info;
    state.userinfo = userInfo.userinfo;*/
    state.userinfo = info;
  },
  SET_REGCODE: (state, regcode) => {
    state.regcode = regcode;
  },
  SET_REGCODELIST: (state, regcodeList) => {
    state.regcodeList = regcodeList;
  },
  SET_MENULIST: (stata, menu) => {
    state.menu = menu;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password }).then(response => {
        const { data: res } = response;
        commit('SET_TOKEN', res.data.token);
        setToken(res.data.token);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const { data: res } = response;
        if (res.code === 200) {
          commit('SET_USERINFO', res.data);
          findStaffResList().then(response => {
            const { data: res } = response;
            if (res.code === 200) {
              if (res.data.organizationList && res.data.organizationList.length > 0) {
                const ownlist = res.data.organizationList;
                commit('SET_REGCODELIST', JSON.stringify(ownlist));
                setStorage('regcodeList', JSON.stringify(ownlist));
                if (!getStorage('UWP_REGCHANG')) {
                  commit('SET_REGCODE', ownlist[0].regCode);
                  setStorage('regcode', ownlist[0].regCode);
                }
              }
              if (res.data.systemList && res.data.systemList.length > 0) {
                commit('SET_MENULIST', res.data.systemList);
                resolve(res.data.systemList);
              } else {
                removeToken(); // must remove  token  first
                resetRouter();
                commit('RESET_STATE');
                reject('该账号无权限访问，请先开通权限！');
              }
            }
          }).catch(error => {
            reject(error);
          });
        }
      });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken(); // must remove  token  first
        removeStorage('regcode');
        removeStorage('regcodeList');
        resetRouter();
        commit('RESET_STATE');
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

