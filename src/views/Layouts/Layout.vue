<template>
    <section class="layout-content">
        <custom-header></custom-header>
        <Content :style="{padding: '0 50px', margin:'0 0 50px 0'}">
            <Card :style="{margin: '40px 0'}">
                <div class="content">
                    <transition name="fade" mode="out-in">
                        <router-view :key="key"></router-view>
                    </transition>
                </div>
            </Card>
        </Content>
        <custom-footer></custom-footer>
    </section>
</template>

<script>
export default {
  components: {
    CustomHeader: () => import('@/views/Layouts/Header'),
    CustomFooter: () => import('@/views/Layouts/Footer')
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-content{
    min-height: 100vh;
}
.layout-footer-center{
    text-align: center;
    display: inline-block;
}
.footer{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.content{
    // min-height: 70vh;
}
</style>
