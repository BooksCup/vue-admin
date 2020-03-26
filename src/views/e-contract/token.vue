<template>
  <div class="createPost-container">
    <el-form ref="postForm" v-loading="loadingData" :model="temp" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + 'draft'">
        <el-button style="margin-left: 10px;" type="success" @click="submitForm">
          生成token
        </el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item label-width="130px" label="appId:" class="postInfo-container-item" prop="appId">
          <el-input
            v-model="temp.appId"
            placeholder="请输入appId"
            style="width: 400px; margin-left: 10px;"
          />
        </el-form-item>

        <el-form-item label-width="130px" label="secret:" class="postInfo-container-item" prop="secret">
          <el-input v-model="temp.secret" placeholder="请输入secret" style="width: 400px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="grantType:" class="postInfo-container-item" prop="grantType">
          <el-input v-model="temp.grantType" placeholder="请输入grantType" style="width: 400px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="token:" class="postInfo-container-item">
          <el-input v-model="temp.content" style="width: 700px; margin-left: 10px;" :disabled="true" />
        </el-form-item>

        <el-form-item label-width="130px" label="有效期:" class="postInfo-container-item">
          <el-input v-model="temp.expiryTime" style="width: 400px; margin-left: 10px;" :disabled="true" />
        </el-form-item>

        <el-form-item label-width="130px" label="code:" class="postInfo-container-item">
          <el-input v-model="temp.apiResultCode" style="width: 400px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="message:" class="postInfo-container-item">
          <el-input v-model="temp.apiResultMessage" style="width: 400px; margin-left: 10px;" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { fetchToken, addToken } from '@/api/econtract'

  export default {
    name: 'EcontractToken',
    components: { Sticky },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(rule.field + '为必传项'))
        } else {
          callback()
        }
      }
      return {
        temp: {
          appId: '',
          secret: '',
          grantType: '',
          content: '',
          expiresIn: 0,
          expiryTime: '',
          createTime: '',
          apiResultCode: '',
          apiResultMessage: ''
        },
        loadingData: false,
        rules: {
          appId: [{ required: true, trigger: 'blur', validator: validateRequire }],
          secret: [{ required: true, trigger: 'blur', validator: validateRequire }],
          grantType: [{ required: true, trigger: 'blur', validator: validateRequire }]
        }
      }
    },
    computed: {
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loadingData = true
        fetchToken().then(response => {
          this.temp = response.data
          this.loadingData = false
        })
      },
      submitForm() {
        this.loadingData = true
        // return;
        this.$refs.postForm.validate(valid => {
          if (valid) {
            addToken(this.temp).then(response => {
              const code = response.status
              this.temp = response.data
              if (code === 200) {
                this.$notify({
                  message: 'token生成成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  message: 'token生成失败',
                  type: 'error',
                  duration: 2000
                })
              }
              this.loadingData = false
            }).catch(e => {
              this.$notify({
                message: 'token生成失败',
                type: 'error',
                duration: 2000
              })
              this.temp = e.response.data
              this.loadingData = false
            })
          } else {
            this.loadingData = false
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
