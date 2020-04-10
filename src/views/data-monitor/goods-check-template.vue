<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="temp" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + 'draft'">
        <el-button style="margin-left: 10px;" type="success" @click="submitForm">
          检测
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label-width="130px" label="物料号:" class="postInfo-container-item" prop="goodsNo">
          <el-input
            v-model="temp.goodsNo"
            placeholder="请输入物料号"
            style="width: 500px; margin-left: 10px;"
          />
        </el-form-item>

        <br>
        <br>

        <el-form-item label-width="130px" label="品名:" class="postInfo-container-item">
          <el-input v-model="temp.goodsName" style="width: 500px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="图片:" class="postInfo-container-item">
          <el-input v-model="temp.goodsPhoto" style="width: 500px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="属性:" class="postInfo-container-item">
          <el-input v-model="temp.goodsAttr" style="width: 500px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="检查结果:" class="postInfo-container-item">
          <el-input v-model="temp.checkInfo" style="width: 500px; margin-left: 10px;" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { checkGoods } from '@/api/data-monitor'

  export default {
    name: 'GoodsCheckTemplate',
    components: { Sticky },
    props: {},
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
          goodsNo: '',
          goodsName: '',
          goodsPhoto: '',
          goodsAttr: '',
          checkInfo: ''
        },
        loadingData: false,
        rules: {
          goodsNo: [{ required: true, trigger: 'blur', validator: validateRequire }]
        }
      }
    },
    computed: {},
    created() {
    },
    methods: {
      submitForm() {
        this.loadingData = true
        // return;
        this.$refs.postForm.validate(valid => {
          if (valid) {
            checkGoods(this.temp.goodsNo).then(response => {
              const code = response.status
              this.temp = response.data
              if (code === 200) {
                this.$notify({
                  message: '检测完成',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  message: '检测失败',
                  type: 'error',
                  duration: 2000
                })
              }
              this.loadingData = false
            }).catch(e => {
              this.$notify({
                message: '检测失败',
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
  }
</style>
