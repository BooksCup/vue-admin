<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-document-add"
        @click="handleCreate"
      >
        创建
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="210px" label="任务类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="210px" label="任务名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="210px" label="批号">
        <template slot-scope="scope">
          <span>{{ scope.row.batchNo }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="210px" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="210px" label="异常数据">
        <template slot-scope="scope">
          <span>{{ scope.row.outLierDataNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="210px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="small" type="primary" icon="el-icon-download" @click="handleUpdate(row, $index)" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="createFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="任务类型:" prop="type">
          <el-select v-model="temp.type" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名:" prop="name">
          <el-input v-model="temp.email" placeholder="任务名(选填)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createAccount()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { createAccount, updateAccount } from '../../api/econtract'
  import { fetchTask } from '../../api/data-monitor'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const typeOptions = [
    { value: '0', label: '物品' }
  ]

  const typeKeyValue = typeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  const statusOptions = [
    { value: '0', label: '进行中' },
    { value: '1', label: '成功' },
    { value: '2', label: '失败' }
  ]
  const statusKeyValue = statusOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'Task',
    components: { Pagination },
    directives: { waves },
    filters: {
      typeFilter(type) {
        return typeKeyValue[type]
      },
      statusFilter(status) {
        return statusKeyValue[status]
      }
    },
    data() {
      return {
        typeOptions,
        statusOptions,
        tableKey: 0,
        pvData: [],
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        createFormVisible: false,
        updateFormVisible: false,
        dialogStatus: '',
        textMap: {
          create: '创建任务'
        },
        temp: {
          id: '',
          name: '',
          thirdPartyUserId: '',
          idType: 'CRED_PSN_CH_IDCARD',
          idNumber: '',
          mobile: '',
          email: '',
          createTime: ''
        },
        accountId: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchTask(this.listQuery).then(response => {
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
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          type: '0'
        }
      },
      initTemp(row) {
        this.temp = {
          id: row.id,
          name: row.name,
          thirdPartyUserId: row.thirdPartyUserId,
          idType: row.idType,
          idNumber: row.idNumber,
          mobile: row.mobile,
          email: row.email,
          createTime: row.createTime
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.createFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row, index) {
        this.initTemp(row)
        this.dialogStatus = 'update'
        this.updateFormVisible = true
      },
      createAccount() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createAccount(this.temp).then(response => {
              this.createFormVisible = false
              const code = response.status
              if (code === 200) {
                this.list.unshift(response.data)
                this.$notify({
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  message: '创建失败',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              const errorMsg = error.response.data.apiResultMessage
              this.$notify({
                message: '创建失败:' + errorMsg,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      updateAccount() {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            updateAccount(this.temp).then(response => {
              this.updateFormVisible = false
              const code = response.status
              if (code === 200) {
                this.$notify({
                  message: '编辑成功',
                  type: 'success',
                  duration: 2000
                })
                const index = this.list.findIndex(v => v.id === this.temp.id)
                this.list.splice(index, 1, this.temp)
              } else {
                this.$notify({
                  message: '编辑失败',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              const errorMsg = error.response.data.apiResultMessage
              this.$notify({
                message: '编辑失败:' + errorMsg,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>
