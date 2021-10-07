const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  menuList: state => state.permission.menuList,
  regcode: state => state.user.regcode,
  regcodeList: state => state.user.regcodeList,
  userinfo: state => state.user.userinfo
};
export default getters;
