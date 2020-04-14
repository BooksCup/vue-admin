<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.searchKey"
        placeholder="请输入关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="350px" label="文件名">
        <template slot-scope="scope">
          <span v-html="scope.row.fileName">{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="800px" label="文件路径">
        <template slot-scope="scope">
          <span v-html="scope.row.filePath">{{ scope.row.filePath }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="磁盘">
        <template slot-scope="scope">
          <span>{{ scope.row.diskName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="文件大小">
        <template slot-scope="scope">
          <span>{{ scope.row.fileSize }}</span>
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
  import { searchFileItem } from '../../api/search'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'FileItem',
    components: { Pagination },
    directives: { waves },
    filters: {},
    data () {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          searchKey: ''
        },
        dialogStatus: '',
        temp: {}
      }
    },
    created () {
    },
    methods: {
      getList () {
        this.listLoading = true
        searchFileItem(this.listQuery).then(response => {
          const res = response.data
          this.list = res.content
          this.total = res.totalElements
          this.listLoading = false
        })
      },
      handleFilter () {
        this.listQuery.page = 1
        this.getList()
      },
    }
  }
</script>
