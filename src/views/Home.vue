<template>
  <section class="home">
    <div class="no-watcher" v-if="!hasWatcher">
      <Button type="dashed" class="empty-button" @click="watchDialogVisable = true">ADD ADDRESS</Button>
      <span>Click the `ADD ADDRESS` button to start watching</span>
    </div>
    <div class="custom-table" v-else>
      <div class="table-header">
        <Button type="success" size="default" @click="watchDialogVisable = true">ADD ADDRESS</Button>
      </div>
      <el-table
        @expand-change="handleExpand"
        :data="watcherLists.data"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
            size="small"
            border
            label-position="left"
            :data="props.row.events"
            style="width: 100%"
            inline
            class="table-expand">
            <el-table-column
            fixed
            type="index">
            </el-table-column>
            <el-table-column
            width="300"
            show-overflow-tooltip
            label="Hash">
              <template slot-scope="scope">
                <a target="_blank" :href="'https://etherscan.io/tx/' + scope.row.hash">{{ scope.row.hash }}</a>
              </template>
            </el-table-column>
            <el-table-column
            label="Value">
              <template slot-scope="scope">
                {{ scope.row.value | toWei }} ETH
              </template>
            </el-table-column>
            <el-table-column
            label="Status">
              <template slot-scope="scope">
                <Tag color="warning" v-if="scope.row.status === 0">Unknown</Tag>
                <Tag color="success" v-else-if="scope.row.status === 1">Clean</Tag>
                <Tag color="error" v-else>Black</Tag>
              </template>
            </el-table-column>
            <el-table-column
            label="Tag">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.tag != '' && scope.row.tag != 0"
                  :key="scope.row.tag"
                  :disable-transitions="false">
                  {{scope.row.tag}}
                </el-tag>
                <div v-else>
                    <el-input
                    class="input-new-tag"
                    v-if="inputVisible === scope.row.id"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <Button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">NONE</Button>
                </div>

              </template>
            </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
        prop="id"
        label="ID">
        </el-table-column>
        <el-table-column
          label="Address"
          width="400">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
          <el-table-column
            label="score"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.score }}</span>
            </template>
          </el-table-column>

        <el-table-column width="200" label="Auction">
          <template slot-scope="scope">
            <Poptip
                transfer
                popper-class="custom-poptip"
                confirm
                ok-text="Yes"
                cancel-text="Cancel"
                title="Are you sure you want to sync this item?"
                @on-ok="syncAgain(scope.row.id)">
                <Button style="margin-right:4px !important;" type="primary" size="small">Sync again</Button>
            </Poptip>

            <Poptip
                transfer
                popper-class="custom-poptip"
                confirm
                ok-text="Yes"
                cancel-text="Cancel"
                title="Are you sure you want to delete this item?"
                @on-ok="deleteWatch(scope.row.id)">
                <Button type="warning" size="small">Delete</Button>
            </Poptip>
          </template>
        </el-table-column>
      </el-table>
      <Page
      v-if="watcherLists && watcherLists.meta.last_page > 1"
      @on-change="handlePagiSizeChange"
      :page-size="watcherLists.meta.per_page"
      :total="watcherLists.meta.total"
      :current="watcherLists.meta.current_page"
      class="custom-paginate"
       size="small" />
    </div>
    <add-watch-dialog :dialogVisable.sync="watchDialogVisable" @onDialogClose="onDialogClose()"></add-watch-dialog>
  </section>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import { getWatchers, deleteWatcher, watcherAgain, getWatcher } from '@/api/Watcher'
import { updateTag } from '@/api/Event'
import { Table, TableColumn, Tag, Input } from 'element-ui'
import Vue from 'vue'
import { fromWei } from 'ethjs-unit'
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Tag.name, Tag)
Vue.component(Input.name, Input)
export default {
  name: 'home',
  data () {
    return {
      hasWatcher: false,
      watchDialogVisable: false,
      watcherLists: null,
      params: {
        page: 1
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  components: {
    AddWatchDialog: () => import('@/components/AddWatchDialog')
  },
  mounted () {
    this.init()
  },
  methods: {
    onDialogClose () {
      this.watchDialogVisable = false
      this.$Modal.remove()
      this.init()
    },
    init () {
      getWatchers(this.params)
        .then(res => {
          this.watcherLists = res.data
          if (this.watcherLists.data.length > 0 || this.watcherLists.meta.total > 1) {
            this.hasWatcher = true
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    handlePagiSizeChange (page) {
      this.params.page = page
    },
    deleteWatch (id) {
      deleteWatcher(id)
        .then(() => {
          this.$Message.success('deleted!')
          this.init()
        })
    },
    syncAgain (id) {
      watcherAgain(id)
        .then(() => {
          this.$Message.success('执行成功!等待队列完成')
        })
    },
    showInput (row) {
      this.inputVisible = row.id
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm (row) {
      let inputValue = this.inputValue
      if (inputValue) {
        updateTag(inputValue, row.id)
          .then(() => {
            row.tag = inputValue
            this.inputVisible = ''
            this.inputValue = ''
            this.$Message.success('Success!')
          }).catch(e => {
            this.$Message.error('Error!')
          })
      }
    },
    handleExpand (row, exRows) {
      if (exRows.length === 0) return
      getWatcher(row.id)
        .then(res => {
          console.log(row)
          row.score = res.data.score
          row.events = res.data.events
        })
    }
  },
  watch: {
    'params.page' () {
      this.init()
    }
  },
  filters: {
    toWei (value) {
      return fromWei(value, 'ether')
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('/element-ui/lib/theme-chalk/index.css');

  .home{
    min-height: 60vh;
    .no-watcher{
      height: 60vh !important;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      .empty-button{
        width: 200px;
        display: block;
      }
      span{
        display: block;
        padding-top: 20px;
        font-size: 12px;
        color: #807f7f;
      }
    }
    .custom-table{
      .table-header{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 25px;
      }
      .custom-paginate{
        margin-top: 20px;
      }
    }
  }

  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>
