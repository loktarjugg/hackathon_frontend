<template>
    <section class="container login">
        <div class="form-center">
            <h1 class="title">Sign in </h1>
            <Form ref="loginData" :model="loginData" :rules="formValidate" :label-width="110">
                <FormItem label="Mobile Number" prop="mobile">
                    <Input class="input" v-model="loginData.mobile" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="Password" prop="password">
                    <Input type="password" class="input" v-model="loginData.password" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('loginData')">Submit</Button>
                </FormItem>
            </Form>
            <router-link :to="{name: 'register'}"><span>Create Account</span></router-link>

        </div>
        <particles></particles>
    </section>
</template>

<script>
import { login } from '@/api/User'
import { setToken } from '@/utils/auth'
export default {
  data () {
    return {
      loginData: {
        mobile: '',
        password: ''
      },
      formValidate: {
        mobile: [{ required: true, message: 'The Mobile Number cannot be empty', trigger: 'blur' }],
        password: [{ required: true, message: 'The Password cannot be empty', trigger: 'blur' }]
      }
    }
  },
  components: {
    Particles: () => import('@/components/Particles')
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
        //   this.$Message.success('Success!')
          login(this.loginData.mobile, this.loginData.password)
            .then(res => {
              setToken(res.data.access_token)
              this.$router.push({ name: 'home' })
            }).catch(e => {
              this.$Message.error('Error in account or password')
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#particles-js{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
}
.login{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: stretch;
    height: 100vh;
    width: 100%;
    background: #fcfcfc;
    .form-center{
        z-index: 1;
        background: #fff;
        padding: 40px;
        .title{
            text-align: right;
            position: relative;
            bottom: 20px;
            color: #515a6e;
        }
        span{
            display: block;
            text-align: right;
            cursor: pointer;
            color: #72767f;
        }
    }

}
.input{
    width: 300px;
}
</style>
