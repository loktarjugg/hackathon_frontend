<template>
    <section>
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
  },
  created () {
    console.log(this.$router)
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

.layout-footer-center{
    text-align: center;
}
.content{
    min-height: 60vh;
}
</style>
