<template>
  <div>
    <PageNavOrigin :sidebarItems="sidebarItems"/>
    <div class="icp-footer">
      <p>Copyright© 2022-{{(new Date()).getFullYear()}} _妄想何方</p>
      <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2022010321号-1</a>
    </div>
  </div>
</template>

<script>
import PageNavOrigin from '@vuepress/theme-default/components/PageNav.vue'

export default {
  name: 'PageNav',
  props: ['sidebarItems'],
  components: {
    PageNavOrigin
  },
}
</script>

<style>
.icp-footer {
  text-align: center;
}

</style>
