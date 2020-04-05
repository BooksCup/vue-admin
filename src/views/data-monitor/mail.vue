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
      <el-table-column align="center" width="300px" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300px" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.mail }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300px" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.onOff | onOffTagFilter">{{ scope.row.onOff | onOffFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="handleUpdate(row, $index)"/>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row, $index)"/>
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
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" placeholder="姓名(必填)"/>
        </el-form-item>
        <el-form-item label="邮箱:" prop="mail">
          <el-input v-model="temp.mail" placeholder="邮箱(必填)"/>
        </el-form-item>
        <el-form-item label="任务类型:" prop="onOff">
          <el-select v-model="temp.onOff" class="filter-item">
            <el-option v-for="item in onOffOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createMailReceiver()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFormVisible">
      <el-form
        ref="updateForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" placeholder="姓名(必填)"/>
        </el-form-item>
        <el-form-item label="邮箱:" prop="mail">
          <el-input v-model="temp.mail" placeholder="邮箱(必填)"/>
        </el-form-item>
        <el-form-item label="任务类型:" prop="onOff">
          <el-select v-model="temp.onOff" class="filter-item">
            <el-option v-for="item in onOffOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateMailReceiver()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchMailReceiver, createMailReceiver, deleteMailReceiver, updateMailReceiver } from '../../api/data-monitor'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const onOffOptions = [
    { value: '0', label: '开启' },
    { value: '1', label: '关闭' }
  ]
  const onOffKeyValue = onOffOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'Mail',
    components: { Pagination },
    directives: { waves },
    filters: {
      onOffFilter (status) {
        return onOffKeyValue[status]
      },
      onOffTagFilter (onOff) {
        const onOffTagMap = {
          '0': 'success',
          '1': 'danger'
        }
        return onOffTagMap[onOff]
      }
    },
    data () {
      return {
        onOffOptions,
        tableKey: 0,
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
        temp: {}
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        this.listLoading = true
        fetchMailReceiver(this.listQuery).then(response => {
          const res = response.data
          this.list = res.list
          this.total = res.total
          this.listLoading = false
        })
      },
      handleFilter () {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp () {
        this.temp = {
          name: '',
          mail: '',
          onOff: '0'
        }
      },
      handleCreate () {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.createFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      initTemp (row) {
        this.temp = {
          id: row.id,
          name: row.name,
          mail: row.mail,
          onOff: row.onOff,
          createTime: row.createTime
        }
      },
      handleUpdate (row) {
        this.initTemp(row)
        this.dialogStatus = 'update'
        this.updateFormVisible = true
      },
      handleDelete (row, index) {
        this.$confirm('确定要删除这个邮箱?', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error'
        })
          .then(async () => {
            deleteMailReceiver(row.id).then(response => {
              const code = response.status
              if (code === 200) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: 2000
                })
                this.list.splice(index, 1)
              } else {
                this.$notify({
                  message: '删除失败!',
                  type: 'error',
                  duration: 2000
                })
              }
              console.log(response)
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      createMailReceiver () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createMailReceiver(this.temp).then(response => {
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
            }).catch(err => {
              this.$notify({
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      updateMailReceiver () {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            updateMailReceiver(this.temp).then(response => {
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
              this.$notify({
                message: '编辑失败',
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
