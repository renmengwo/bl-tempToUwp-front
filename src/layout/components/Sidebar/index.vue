<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"></logo>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-openeds="defaultMenu"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :options= options
        >
        </sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/_variables.scss';
const { systemId } = require('@/settings');
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuList'
    ]),
     routes() {
      if(systemId &&  systemId !== '') {
        return this.menuList;
      } else {
        return this.$router.options.routes;
      }

    },
    options() {
      let nextList = ''
      if(systemId &&  systemId !== '') {
        nextList =  'childMenuList';
      } else {
        nextList = 'children';
      }
      return {
        children: nextList
      }
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    return {
      defaultMenu: []
    };
  },
  mounted() {
    this.defaultOpenMenu();
    // console.log(JSON.stringify(this.menuList));
  },
  methods: {
    defaultOpenMenu() {
      this.defaultMenu = this.menuList.map(item => item.path);
    }
  }
};
</script>
