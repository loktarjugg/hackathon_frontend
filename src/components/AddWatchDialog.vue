<template>
    <section>
        <Modal
            on-ok="handleSubmit"
            title="ADD ADDRESS"
            :footer-hide="true"
            :value="dialogVisable"
            @on-cancel="onCancel"
            class-name="vertical-center-modal">
            <Form ref="formData" :model="formData" :rules="formRules" :label-width="140">
                <FormItem label="Ethereum Address" prop="address">
                    <Input v-model="formData.address" placeholder="Enter Ethereum Address"></Input>
                </FormItem>
            </Form>
            <div class="custom-submit">
                <Button type="primary" :loading="loading" @click="handleSubmit()">Submit</Button>
            </div>

        </Modal>
    </section>
</template>

<script>
import { addWatcher } from '@/api/Watcher'
import { isAddress } from '@/utils/helper'
import ethUtil from 'ethereumjs-util'
export default {
  data () {
    const validateAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter Ethereum address'))
      } else {
        if (this.formData.address !== '' && isAddress(value)) {
          callback()
        }
        callback(new Error('Please enter the correct Ethereum address'))
      }
    }
    return {
      dialog: true,
      loading: false,
      formData: {
        address: ''
      },
      formRules: {
        address: [
          { validator: validateAddress, trigger: 'blur' },
          { required: true, message: 'Please enter the Ethereum address', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    dialogVisable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSubmit () {
      this.loading = true
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.handleSign()
            .then(res => {
              addWatcher(this.formData.address)
                .then(() => {
                  this.loading = false
                  this.$Message.success('Add watch ethereum address success!')
                  this.handleEmit(false)
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(e => {
              this.loading = false
              this.$Message.error(e.message)
            })
        } else {
          this.loading = false
        }
      })
    },
    handleSign () {
      return new Promise((resolve, reject) => {
        window.web3.eth.getAccounts()
          .then(accounts => {
            let text = 'test message'

            let msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))

            let params = [msg, accounts[0]]

            let method = 'personal_sign'

            window.web3.currentProvider.sendAsync({
              method,
              params,
              from: accounts[0]
            }, function (err, res) {
              if (err || res.error) {
                reject(new Error('please confirm the sign.'))
              }
              if (res.result) {
                resolve(res)
              }
            })
          })
          .catch(() => {
            reject(new Error('please unlock your Metamask'))
          })
      })
    },
    handleEmit (visible) {
      this.$emit('onDialogClose', visible)
    },
    onCancel () {
      this.handleEmit(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
.custom-submit{
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
