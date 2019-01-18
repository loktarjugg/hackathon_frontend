<template>
    <section class="container register">
        <div class="form-center">
            <h1 class="title">Register Account </h1>
            <Form ref="loginData" :model="loginData" :rules="formRules" :label-width="130">
                <FormItem label="Name" prop="name">
                    <Input class="input" v-model="loginData.name" placeholder="Enter your Name"></Input>
                </FormItem>
                <FormItem label="Mobile Number" prop="mobile">
                    <Input class="input" v-model="loginData.mobile" placeholder="Enter your Mobile Number"></Input>
                </FormItem>
                <FormItem label="IC Number" prop="ic_number">
                    <Input class="input" v-model="loginData.ic_number" placeholder="Enter your IC Number"></Input>
                </FormItem>
                <FormItem label="IC Photo" prop="ic_photo">
                    <Upload
                        name="file"
                        ref="upload"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError"
                        :on-success="handleSuccess"
                        :on-exceeded-size="handleMaxSize"
                        :max-size="2048"
                        type="drag"
                        :action="uploadPath">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>Click or drag files here to upload your IC Photo</p>
                        </div>
                    </Upload>
                    <div class="img" v-if="loginData.ic_photo != ''">
                        <img :src="loginData.ic_photo">
                        <Icon type="ios-close" class="close" @click="loginData.ic_photo = ''" />
                    </div>
                    <Input style="display:none;" class="input" v-model="loginData.ic_photo" placeholder="Enter your IC Number"></Input>
                </FormItem>
                <FormItem label="Password" prop="password">
                    <Input type="password" class="input" v-model="loginData.password" placeholder="Enter your password"></Input>
                </FormItem>
                <FormItem label="Password confirm" prop="password_confirmation">
                    <Input type="password" class="input" v-model="loginData.password_confirmation" placeholder="Enter your confirm password"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('loginData')">Submit</Button>
                </FormItem>
            </Form>
            <router-link :to="{name: 'login'}"><span>Already have? Sign in!</span></router-link>

        </div>
        <particles></particles>
    </section>
</template>

<script>
import { register } from '@/api/User'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'))
      } else {
        if (this.loginData.password_confirmation !== '') {
          this.$refs.loginData.validateField('password_confirmation')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'))
      } else if (value !== this.loginData.password) {
        callback(new Error('The two input passwords do not match!'))
      } else {
        callback()
      }
    }
    return {
      uploadPath: process.env.VUE_APP_BASE_API + '/upload',
      loginData: {
        name: '',
        mobile: '',
        ic_number: '',
        ic_photo: '',
        password: '',
        password_confirmation: ''
      },
      formRules: {
        name: [
          { required: true, message: 'The Mobile Number cannot be empty', trigger: 'blur' },
          { type: 'string', max: 200, message: 'Name no greater than 200 words', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: 'The Mobile cannot be empty', trigger: 'blur' }
        ],
        ic_number: [
          { required: true, message: 'The IC Number cannot be empty', trigger: 'blur' },
          { type: 'string', max: 200, message: 'IC Number no greater than 200 words', trigger: 'change' }
        ],
        ic_photo: [
          { required: true, message: 'The Ic Photo cannot be empty', trigger: 'blur' },
          { type: 'url', message: 'Ic Photo must be a URL', trigger: 'change' }
        ],
        password: [
          { required: true, message: 'The Password cannot be empty', trigger: 'blur' },
          { type: 'string', min: 6, max: 20, message: 'Password no between 6 ~ 20 words', trigger: 'change' },
          { validator: validatePass, trigger: 'blur' }
        ],
        password_confirmation: [
          { required: true, message: 'The Password Confirm cannot be empty', trigger: 'blur' },
          { type: 'string', min: 6, max: 20, message: 'Password Confirm no between 6 ~ 20 words', trigger: 'change' },
          { validator: validatePassCheck, trigger: 'blur' }
        ]
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
          register(this.loginData)
            .then(res => {
              this.$Message.success('Register Success!')
              this.$router.push({ name: 'login' })
            })
            .catch(() => {
              this.$Message.error('Register Failed!')
            })
        }
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleSuccess (res, file) {
      this.loginData.ic_photo = res
    }
  }
}
</script>

<style lang="scss" scoped>
.register{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: stretch;
    min-height: 100vh;
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
        .img{
            position: absolute;
            top: 0;
            background: #b9b6b6;
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
            }
            .close{
                position: absolute;
                right: 5px;
                top: 5px;
                font-size: 25px;
                font-weight: bold;
                cursor: pointer;
                color: #ffffff;
            }
        }
    }

}
.input{
    width: 300px;
}
</style>
