<template>
  <section class="home">
    <div class="no-watcher" v-if="!hasWatcher">
      <Button type="dashed" class="empty-button" @click="watchDialogVisable = true">ADD WATCH</Button>
      <span>Click the `ADD WATCH` button to start watching</span>
    </div>
    <div class="custom-table" v-else>
      <div class="table-header">
        <Button type="success" size="default" @click="watchDialogVisable = true">ADD WATCH</Button>
      </div>
      <el-table
        :data="watcherLists.data"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          fixed>
        </el-table-column>
        <el-table-column
          label="Address"
          width="370">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Block Number"
          prop="block_number"
          width="200">
          </el-table-column>
          <el-table-column
          label="Sync Block Number"
          prop="sync_block_number"
          width="200">
          </el-table-column>

          <el-table-column
            label="score"
            width="370">
            <template slot-scope="scope">
              <span>{{ scope.row.score }}</span>
            </template>
          </el-table-column>

        <el-table-column width="200" label="Auction" fixed="right">
          <template slot-scope="scope">
            <Button style="margin-right:4px !important;" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">Sync again</Button>
            <Button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">Delete</Button>
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
import { getWatchers } from '@/api/Watcher'
import { Table, TableColumn } from 'element-ui'
import Vue from 'vue'
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
export default {
  name: 'home',
  data () {
    return {
      hasWatcher: false,
      watchDialogVisable: false,
      watcherLists: null,
      params: {
        page: 1
      }
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
    }
  },
  watch: {
    'params.page' () {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('/element-ui/lib/theme-chalk/index.css');

  .home{
    height: 60vh;
    .no-watcher{
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
</style>
