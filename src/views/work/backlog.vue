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
        type="primary"
        icon="el-icon-document-add"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="left" width="340px" label="标题">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeTagFilter">{{ scope.row.type | typeFilter }}</el-tag>
          <span v-if="scope.row.moduleName === null || scope.row.moduleName === ''">{{ scope.row.title }}</span>
          <span v-else>【{{ scope.row.moduleName }}】{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="迭代">
        <template slot-scope="scope">
          <span v-if="scope.row.sprintName === null || scope.row.sprintName === ''">--</span>
          <span v-else>{{ scope.row.sprintName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="当前处理人">
        <template slot-scope="scope">
          <span>{{ scope.row.currentUserName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="优先级顺序">
        <template slot-scope="scope">
          <span>{{ scope.row.priorityOrder }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="优先级">
        <template slot-scope="scope">
          <el-tag :type="scope.row.priority | priorityTagFilter">{{ scope.row.priority | priorityFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="重要程度">
        <template slot-scope="scope">
          <el-tag :type="scope.row.importance | importanceTagFilter">{{ scope.row.importance | importanceFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="预计结束日期">
        <template slot-scope="scope">
          <span v-if="scope.row.endDate === null || scope.row.endDate === ''">--</span>
          <span v-else>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="handleUpdate(row, $index)" />
          <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row, $index)" />
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
        :rules="createBacklogRules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="状态" prop="statusId">
          <el-select v-model="temp.statusId" class="filter-item" placeholder="">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理人" prop="currentUserId">
          <el-select v-model="temp.currentUserId" class="filter-item" placeholder="">
            <el-option v-for="item in currentUserOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="moduleId">
          <el-select v-model="temp.moduleId" class="filter-item" placeholder="">
            <el-option v-for="item in moduleOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="迭代" prop="sprintId">
          <el-select v-model="temp.sprintId" class="filter-item" placeholder="" clearable @change="choseSprint">
            <el-option v-for="item in sprintOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="showIsLinkSprint" label="是否联动预计开始结束日期？" prop="isLinkSprint">
          <el-radio-group v-model="temp.isLinkSprint" @change="linkSprint">
            <el-radio :label="'0'">
              否
            </el-radio>
            <el-radio :label="'1'">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预计开始日期" prop="beginDate">
          <el-date-picker
            v-model="temp.beginDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始日期"
          />
        </el-form-item>
        <el-form-item label="预计结束日期" prop="endDate">
          <el-date-picker v-model="temp.endDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择结束日期" />
        </el-form-item>
        <el-form-item label="优先级顺序" prop="priorityOrder">
          <el-select v-model="temp.priorityOrder" class="filter-item" placeholder="">
            <el-option v-for="item in priorityOrderOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="temp.priority" class="filter-item" placeholder="">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度" prop="importance">
          <el-select v-model="temp.importance" class="filter-item" placeholder="">
            <el-option v-for="item in importanceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createBacklog()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFormVisible">
      <el-form
        ref="updateForm"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" disabled="true">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="状态" prop="statusId">
          <el-select v-model="temp.statusId" class="filter-item" placeholder="">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理人" prop="currentUserId">
          <el-select v-model="temp.currentUserId" class="filter-item" placeholder="">
            <el-option v-for="item in currentUserOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="moduleId">
          <el-select v-model="temp.moduleId" class="filter-item" placeholder="">
            <el-option v-for="item in moduleOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="迭代" prop="sprintId">
          <el-select v-model="temp.sprintId" class="filter-item" placeholder="" clearable @change="choseSprint">
            <el-option v-for="item in sprintOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否联动预计开始结束日期？" prop="isLinkSprint">
          <el-radio-group v-model="temp.isLinkSprint" @change="linkSprint">
            <el-radio :label="'0'">
              否
            </el-radio>
            <el-radio :label="'1'">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预计开始日期" prop="beginDate">
          <el-date-picker
            v-model="temp.beginDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始日期"
          />
        </el-form-item>
        <el-form-item label="预计结束日期" prop="endDate">
          <el-date-picker v-model="temp.endDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择结束日期" />
        </el-form-item>
        <el-form-item label="优先级顺序" prop="priorityOrder">
          <el-select v-model="temp.priorityOrder" class="filter-item" placeholder="">
            <el-option v-for="item in priorityOrderOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="temp.priority" class="filter-item" placeholder="">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度" prop="importance">
          <el-select v-model="temp.importance" class="filter-item" placeholder="">
            <el-option v-for="item in importanceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateBacklog()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchOptions } from '@/api/options'
  import { createBacklog, fetchBacklogList, deleteBacklog, updateBacklog } from '@/api/backlog'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  // type
  // story/bug
  const typeOptions = [
    { value: '0', label: 'story' },
    { value: '1', label: 'bug' }
  ]

  const typeKeyValue = typeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  // 优先级
  const priorityOptions = [
    { value: '0', label: '低' },
    { value: '1', label: '中' },
    { value: '2', label: '高' }
  ]

  const priorityKeyValue = priorityOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  // 重要程度
  const importanceOptions = [
    { value: '0', label: '提示' },
    { value: '1', label: '一般' },
    { value: '2', label: '重要' },
    { value: '3', label: '关键' }
  ]

  const importanceKeyValue = importanceOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'Backlog',
    components: { Pagination },
    directives: { waves },
    filters: {
      typeFilter(type) {
        return typeKeyValue[type]
      },
      typeTagFilter(type) {
        const typeTagMap = {
          '0': 'success',
          '1': 'danger'
        }
        return typeTagMap[type]
      },
      priorityFilter(priority) {
        return priorityKeyValue[priority]
      },
      priorityTagFilter(priority) {
        const priorityTagMap = {
          '0': 'info',
          '1': 'warning',
          '2': 'danger'
        }
        return priorityTagMap[priority]
      },
      importanceFilter(importance) {
        return importanceKeyValue[importance]
      },
      importanceTagFilter(importance) {
        const importanceTagMap = {
          '0': 'success',
          '1': 'info',
          '2': 'warning',
          '3': 'danger'
        }
        return importanceTagMap[importance]
      }
    },
    data() {
      const validateTitle = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('标题不能为空'))
        } else {
          callback()
        }
      }
      return {
        currentUserOptions: null,
        statusOptions: null,
        moduleOptions: null,
        sprintOptions: null,
        priorityOptions,
        typeOptions: [
          { value: '0', label: 'story' },
          { value: '1', label: 'bug' }
        ],
        priorityOrderOptions: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          { value: '8', label: '8' },
          { value: '9', label: '9' },
          { value: '10', label: '10' }
        ],

        importanceOptions: [
          { value: '0', label: '提示' },
          { value: '1', label: '一般' },
          { value: '2', label: '重要' },
          { value: '3', label: '关键' }
        ],
        createBacklogRules: {
          title: [{ required: true, trigger: 'blur', validator: validateTitle }],
          statusId: [{ required: true, trigger: 'blur' }],
          currentUserId: [{ required: true, trigger: 'blur' }],
          priority: [{ required: true, trigger: 'blur' }],
          importance: [{ required: true, trigger: 'blur' }]
        },
        showIsLinkSprint: false,
        linkSprintId: '',
        tableKey: 0,
        pvData: [],
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        createFormVisible: false,
        updateFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑backlog',
          create: '添加backlog'
        },
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: '0'
        },
        backlogId: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      refreshBeginAndEndDate(sprintId) {
        this.sprintOptions.filter(item => {
          if (item.id === sprintId) {
            this.temp.beginDate = item.beginDate
            this.temp.endDate = item.endDate
          }
        })
      },
      choseSprint(sprintId) {
        if (sprintId) {
          this.showIsLinkSprint = true
          this.linkSprintId = sprintId
          if (this.temp.isLinkSprint === '1') {
            // 需要联动，更改为新选中迭代的开始日期和结束日期
            this.refreshBeginAndEndDate(sprintId)
          }
        } else {
          this.showIsLinkSprint = false
          this.temp.isLinkSprint = '0'
          this.temp.beginDate = ''
          this.temp.endDate = ''
        }
      },
      linkSprint(isLinkSprint) {
        if (isLinkSprint === '0') {
          // 不联动
          this.temp.beginDate = ''
          this.temp.endDate = ''
        } else {
          // 联动
          this.refreshBeginAndEndDate(this.linkSprintId)
        }
      },
      getList() {
        this.listLoading = true
        fetchBacklogList(this.listQuery).then(response => {
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
          title: '',
          type: '0',
          statusId: '',
          currentUserId: '',
          moduleId: '',
          sprintId: '',
          isLinkSprint: '0',
          priorityOrder: '1',
          priority: '1',
          importance: '1',
          beginDate: '',
          endDate: ''
        }
        this.showIsLinkSprint = false
      },
      initTemp(row) {
        this.temp = {
          id: row.id,
          title: row.title,
          type: row.type,
          statusId: row.statusId,
          currentUserId: row.currentUserId,
          moduleId: row.moduleId,
          sprintId: row.sprintId,
          isLinkSprint: row.isLinkSprint,
          priorityOrder: row.priorityOrder,
          priority: row.priority,
          importance: row.importance,
          beginDate: row.beginDate,
          endDate: row.endDate
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.createFormVisible = true
        fetchOptions(this.listQuery).then(response => {
          const res = response.data
          this.currentUserOptions = res.currentUserList
          this.statusOptions = res.statusList
          this.moduleOptions = res.moduleList
          this.sprintOptions = res.sprintList
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update'
        this.updateFormVisible = true
        fetchOptions(this.listQuery).then(response => {
          const res = response.data
          this.currentUserOptions = res.currentUserList
          this.statusOptions = res.statusList
          this.moduleOptions = res.moduleList
          this.sprintOptions = res.sprintList

          this.initTemp(row)
        })
      },
      handleDelete(row, index) {
        this.$confirm('确定要删除这条工作项?', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error'
        })
          .then(async() => {
            this.backlogId = row.id
            deleteBacklog(row.id).then(response => {
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
                  message: '删除失败',
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
      createBacklog() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createBacklog(this.temp).then(response => {
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
            })
          }
        })
      },
      updateBacklog() {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            updateBacklog(this.temp).then(response => {
              this.updateFormVisible = false
              const code = response.status
              if (code === 200) {
                this.$notify({
                  message: '编辑成功',
                  type: 'success',
                  duration: 2000
                })
                const index = this.list.findIndex(v => v.id === this.temp.id)
                this.list.splice(index, 1, response.data)
              } else {
                this.$notify({
                  message: '编辑失败',
                  type: 'error',
                  duration: 2000
                })
              }
            })
          }
        })
      }
    }
  }
</script>
