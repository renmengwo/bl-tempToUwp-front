<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate';
import { mapGetters } from 'vuex';
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return 'a';
      }
      return 'router-link';
    },
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: `${to}?token=${this.token}`,
          // target: '_blank',
          rel: 'noopener'
        };
      }
      return {
        to: to
      };
    }
  }
};
</script>
