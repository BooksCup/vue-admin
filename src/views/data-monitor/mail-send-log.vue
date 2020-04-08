<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="300px" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.receiverName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300px" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.receiverMail }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="210px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="small" type="primary" icon="el-icon-refresh" @click="resendMail(row, $index)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { fetchMailSendLog, resendMail } from '../../api/data-monitor'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const statusOptions = [
    { value: '0', label: '成功' },
    { value: '1', label: '失败' }
  ]
  const statusKeyValue = statusOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'MailSendLog',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        return statusKeyValue[status]
      },
      statusTagFilter(onOff) {
        const statusTagMap = {
          '0': 'success',
          '1': 'danger'
        }
        return statusTagMap[onOff]
      }
    },
    data() {
      return {
        statusOptions,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        temp: {},
        listQuery: {
          page: 1,
          limit: 10
        }
      }
    },
    created() {
      const taskId = this.$route.params && this.$route.params.id
      this.getList(taskId)
    },
    methods: {
      getList(taskId) {
        this.listLoading = true
        this.listQuery.taskId = taskId
        fetchMailSendLog(this.listQuery).then(response => {
          const res = response.data
          this.list = res.list
          this.total = res.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      initTemp(row) {
        this.temp = {
          id: row.id,
          receiverName: row.receiverName,
          receiverMail: row.receiverMail,
          taskId: row.taskId,
          status: row.status,
          createTime: row.createTime
        }
      },
      resendMail(row) {
        this.initTemp(row)
        this.listLoading = true
        resendMail(this.temp).then(response => {
          this.listLoading = false
          const code = response.status
          if (code === 200) {
            this.$notify({
              message: '发送成功',
              type: 'success',
              duration: 2000
            })
            this.temp.status = '0'
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
          } else {
            this.$notify({
              message: '发送失败',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(err => {
          this.$notify({
            message: '发送失败',
            type: 'error',
            duration: 2000
          })
        })
      }
    }
  }
</script>
