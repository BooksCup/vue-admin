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
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="170px" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="170px" label="第三方账号">
        <template slot-scope="scope">
          <span>{{ scope.row.thirdPartyUserId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="170px" label="证件类型">
        <template slot-scope="scope">
          <span>{{ scope.row.idType | idTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="170px" label="证件号">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="170px" label="手机">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="170px" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="170px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="50px" label="印章">
        <template slot-scope="{row}">
          <router-link :to="'/e-contract/personal-seal/'+row.id">
            <el-button type="warning" size="small" icon="el-icon-menu" />
          </router-link>
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
        :rules="createAccountRules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" placeholder="姓名(必填)" />
        </el-form-item>
        <el-form-item label="第三方账号:" prop="thirdPartyUserId">
          <el-input v-model="temp.thirdPartyUserId" placeholder="第三方账号(必填)" />
        </el-form-item>
        <el-form-item label="证件类型:" prop="idType">
          <el-select v-model="temp.idType" class="filter-item">
            <el-option v-for="item in idTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号:" prop="idNumber">
          <el-input v-model="temp.idNumber" placeholder="证件号(必填)" />
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="手机(必填)" />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="temp.email" placeholder="邮箱(选填)" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFormVisible">
      <el-form
        ref="updateForm"
        :rules="createAccountRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="第三方账号" prop="thirdPartyUserId">
          <el-input v-model="temp.thirdPartyUserId" />
        </el-form-item>
        <el-form-item label="证件类型" prop="idType">
          <el-select v-model="temp.idType" class="filter-item" :disabled="true">
            <el-option v-for="item in idTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="idNumber">
          <el-input v-model="temp.idNumber" :disabled="true" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateAccount()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { createAccount, fetchAccount, deleteAccount, updateAccount } from '../../api/econtract'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const idTypeOptions = [
    { value: 'CRED_PSN_CH_IDCARD', label: '大陆身份证' },
    { value: 'CRED_PSN_CH_TWCARD', label: '台湾来往大陆通行证' },
    { value: 'CRED_PSN_CH_MACAO', label: '澳门来往大陆通行证' },
    { value: 'CRED_PSN_CH_HONGKONG', label: '香港来往大陆通行证' },
    { value: 'CRED_PSN_FOREIGN', label: '外籍证件' },
    { value: 'CRED_PSN_PASSPORT', label: '护照' },
    { value: 'CRED_PSN_CH_SOLDIER_IDCARD', label: '军官证' },
    { value: 'CRED_PSN_CH_SSCARD', label: '社会保障卡' },
    { value: 'CRED_PSN_CH_ARMED_POLICE_IDCARD', label: '武装警察身份证件' },
    { value: 'CRED_PSN_CH_RESIDENCE_BOOKLET', label: '户口簿' },
    { value: 'CRED_PSN_CH_TEMPORARY_IDCARD', label: '临时居民身份证' },
    { value: 'CRED_PSN_CH_GREEN_CARD', label: '外国人永久居留证' },
    { value: 'CRED_PSN_SHAREHOLDER_CODE', label: '股东代码证' },
    { value: 'CRED_PSN_POLICE_ID_CARD', label: '警官证' },
    { value: 'CRED_PSN_UNKNOWN', label: '未知类型' }
  ]

  const idTypeKeyValue = idTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'EcontractAccount',
    components: { Pagination },
    directives: { waves },
    filters: {
      idTypeFilter(type) {
        return idTypeKeyValue[type]
      }
    },
    data() {
      const validateName = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('姓名不能为空'))
        } else {
          callback()
        }
      }
      const validateThirdPartyUserId = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('第三方账号不能为空'))
        } else {
          callback()
        }
      }
      const validateIdNumber = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('证件号不能为空'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('手机不能为空'))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('邮箱不能为空'))
        } else {
          callback()
        }
      }
      return {
        idTypeOptions,
        createAccountRules: {
          name: [{ required: true, trigger: 'blur', validator: validateName }],
          thirdPartyUserId: [{ required: true, trigger: 'blur', validator: validateThirdPartyUserId }],
          idNumber: [{ required: true, trigger: 'blur', validator: validateIdNumber }],
          mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
          email: [{ required: true, trigger: 'blur', validator: validateEmail }]
        },
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
          update: '编辑个人账号',
          create: '添加个人账号'
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
        fetchAccount(this.listQuery).then(response => {
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
          thirdPartyUserId: '',
          idType: 'CRED_PSN_CH_IDCARD',
          idNumber: '',
          mobile: '',
          email: '',
          createTime: ''
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
      handleDelete(row, index) {
        this.$confirm('删除操作无法恢复，请谨慎删除。', '是否删除"' + row.name + '"?', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error'
        })
          .then(async() => {
            this.accountId = row.id
            deleteAccount(row.id).then(response => {
              console.log(response)
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
            }).catch(error => {
              this.$notify({
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            })
          })
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
