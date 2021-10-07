import { aynscRoutes, constantRoutes, errorPath } from '@/router';
import router from '@/router';
const setting = require('@/settings');

/*
* @params routerParams 后台返回的所有系统的菜单列表
* @params routerParamsIdList 筛选的的menuCode（菜单code）集合和moduleIds（按钮code集合）
* */
const filterCurrentRoute = (routerParamsIdList, routerParams) => {
  const currentMenus = routerParams.filter(item => {
    return item.systemId === setting.systemId;
  });
  if (currentMenus.length > 0) {
    const currentRoute = currentMenus[0].menuList;
    creatRouterParamsIdList(routerParamsIdList, currentRoute);
  }
};

/*
* @params routerParams 过滤后的当前系统菜单列表
* @params routerParamsIdList 筛选的的menuCode（菜单code）集合和moduleIds（按钮code集合）
* */
const creatRouterParamsIdList = (routerParamsIdList, routerParams) => {
  if (routerParams) {
    routerParams.forEach(item => {
      const { menuCode } = item;
      let moduleIds = [];
      if (item.btnResourceList && item.btnResourceList.length > 0) {
        moduleIds = item.btnResourceList.map(btn => btn.code);
      }
      const obj = { menuCode, moduleIds };
      routerParamsIdList.push(obj);
      if (item.childMenuList && item.childMenuList.length > 0) {
        creatRouterParamsIdList(routerParamsIdList, item.childMenuList);
      }
    });
  }
};

/*
* @params route 前端定义的异步路由表
* @params routerParamsIdList 筛选的的menuCode（菜单code）集合和moduleIds（按钮code集合）
* */
const hasPermission = (routerParamsIdList, route) => {
  if (route.meta && route.meta.menuCode) {
    const arr = routerParamsIdList.filter(item => { return item.menuCode === route.meta.menuCode; });
    route.meta.moduleIds = arr[0] ? arr[0].moduleIds : [];
    return arr.length > 0;
  } else {
    if (route.meta && route.meta.permissionId) {
      const arr = routerParamsIdList.filter(item => { return item.menuCode === route.meta.permissionId; });
      route.meta.moduleIds = arr[0] ? arr[0].moduleIds : [];
      return arr.length > 0;
    } else {
      return false;
    }
  }
};

/*
* @params accessedRoutes 最终完整的用户路由表
* @params route 前端定义的异步路由表
* @params routerParamsIdList 筛选的的menuCode（菜单code）集合和moduleIds（按钮code集合）
* */
const filterAsyncRoutes = (accessedRoutes, routes, routerParamsIdList) => {
  routes.forEach(route => {
    const r = { ...route };
    if (hasPermission(routerParamsIdList, r)) {
      accessedRoutes.push(r);
      if (r.children) {
        const res = [];
        filterAsyncRoutes(res, r.children, routerParamsIdList);
        r.children = res;
      }
    }
  });
};

/*
* @params routerParams 后台返回的所有系统的菜单列表
* @params route 前端定义的异步路由表
* @params accessedMenus 完整的菜单
* */
const creatMenuList = (accessedMenus, routerParams, route) => {
  /* =====这一块是处理当前系统的菜单，可根据实际情况调整body是否存在======*/
  const body = {
    path: '/',
    meta: {
      title: '',
      icon: setting.icon
    },
    systemId: '',
    systemName: '',
    systemUrl: '',
    childMenuList: []
  };
  const { systemId } = setting;
  const currentMenuList = routerParams.filter(item => { return item.systemId === systemId; });
  if (currentMenuList.length > 0 && currentMenuList[0].menuList && currentMenuList[0].menuList.length > 0) {
    const MenuList = currentMenuList[0].menuList;
    const { systemName: title, systemId, systemUrl } = currentMenuList[0];
    body.meta.title = title;
    body.systemId = systemId;
    body.systemName = title;
    body.systemUrl = systemUrl;
    MenuList.forEach(item => {
      compareMenuLis(item, route);
      body.childMenuList.push(item);
    });
    accessedMenus.push(body);
  }
  /* =====这一块是处理当前系统的菜单，可根据实际情况调整body是否存在======*/
  const otherMenuList = routerParams.filter(item => { return item.systemId !== systemId; });
  if (otherMenuList.length > 0) {
    const rightMenuList = creatOtherMenu(otherMenuList);
    rightMenuList.forEach(item => {
      item.childMenuList = item.menuList;
      accessedMenus.push(item);
    });
  }
};

/*
* @params otherMenuList 后台返回的所有系统的菜单列表中过滤出不是当前登录系统的菜单
* */
const creatOtherMenu = (otherMenuList) => {
  otherMenuList.forEach(item => {
    if (item.systemId) {
      const { systemName: title, systemUrl: Prefixpath } = item;
      item.path = Prefixpath;
      item.meta = {
        title
      };
      if (item.menuList && item.menuList.length > 0) {
        item.menuList.forEach(child => {
          const { menuName: title, menuUrl: path } = child;
          child.path = `${Prefixpath}#${path}`;
          child.meta = {
            title
          };
          setOtherMenuList(child, 'childMenuList', Prefixpath);
        });
      }
    }
  });
  return otherMenuList;
};

const compareRouteList = (obj, List) => {
  List.forEach(item => {
    if (item.meta && item.meta.menuCode) {
      if (item.meta.menuCode === obj.menuCode) {
        const { path, meta } = item;
        obj.path = path;
        obj.meta = meta;
      }
      if (item.children && item.children.length > 0) {
        compareRouteList(obj, item.children);
      }
    }
  });
};

const compareMenuLis = (menuObj, route) => {
  if (menuObj.menuCode) {
    compareRouteList(menuObj, route);
  }
  if (menuObj.childMenuList && menuObj.childMenuList.length > 0) {
    menuObj.childMenuList.forEach(child => {
      compareMenuLis(child, route);
    });
  }
};

const setOtherMenuList = (menuObj, key, Prefixpath) => {
  if (menuObj[key] && menuObj[key].length > 0) {
    menuObj[key].forEach(item => {
      const { menuName: title, menuUrl: path } = item;
      item.path = `${Prefixpath}#${path}`;
      item.meta = {
        title
      };
      setOtherMenuList(item, key, Prefixpath);
    });
  }
};

const state = {
  menuList: [], // 完整的菜单列表
  routes: [], // 完整的用户路由表
  dynamicRoutes: [] // 处理后的异步路由（不完整的路由）
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.dynamicRoutes = routes;
    state.routes = [...constantRoutes, ...routes];
  },
  RESET_ROUTES: (state) => {
    state.dynamicRoutes = [];
    state.routes = [];
  },
  SET_FULLMENU: (state, menuList) => {
    state.menuList = menuList;
  }
};

const actions = {
  /*
* @params routerParams 后台返回的菜单列表
* */
  GenerateRoutes({ commit }, routerParams) {
    const routerParamsIdList = [];
    filterCurrentRoute(routerParamsIdList, routerParams);
    let accessedRoutes = [];
    filterAsyncRoutes(accessedRoutes, aynscRoutes, routerParamsIdList);
    accessedRoutes = [...accessedRoutes, ...[errorPath]];
    router.addRoutes(accessedRoutes);
    commit('SET_ROUTES', accessedRoutes);
    const accessedMenus = [];
    creatMenuList(accessedMenus, routerParams, aynscRoutes);
    commit('SET_FULLMENU', accessedMenus);
  },
  ResetRoutes({ commit }) {
    commit('RESET_ROUTES');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
