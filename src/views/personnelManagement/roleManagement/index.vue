<template>
  <div class="roleManagement-container">
    <el-divider content-position="left">角色分配</el-divider>
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.permission" clearable placeholder="请输入查询条件" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="Key" prop="key" show-overflow-tooltip />
      <el-table-column label="角色名称" prop="role_name" show-overflow-tooltip />
      <el-table-column label="权限" prop="permission_str" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.size"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList, getRoute } from '@/api/roleManagement'
  import Edit from './components/RoleManagementEdit'
  export default {
    name: 'RoleManagement',
    components: { Edit },
    data() {
      return {
        permissionList: [],
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          page: 1,
          size: 10,
          permission: '',
        },
        timeOutID: null,
      }
    },
    created() {
      this.fetchData()
    },

    beforeDestroy() {
      clearTimeout(this.timeOutID)
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const req = []
            req.push(row.id)
            const { msg } = await doDelete({ ids: req })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const req = this.selectRows.map((item) => item.id)
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: req })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            // test
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.size = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.page = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.page = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const res = await getList(this.queryForm)
        console.log(res)
        this.list = res.data.list
        this.total = res.data.count
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
