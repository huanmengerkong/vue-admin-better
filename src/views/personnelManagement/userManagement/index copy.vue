<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.name" clearable placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" />
      <el-table-column label="id" prop="id" show-overflow-tooltip />
      <el-table-column label="用户名" prop="name" show-overflow-tooltip />
      <el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
      <el-table-column label="邮箱" prop="email" show-overflow-tooltip />

      <el-table-column label="权限" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.permissions" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="datatime" show-overflow-tooltip />
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/userManagement'
  import Edit from './components/UserManagementEdit'

  export default {
    name: 'UserManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          name: '',
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
          var save = {}
          save.email = row.email
          save.password = '1'
          save.name = row.name
          save.status = row.status
          save.mobile = row.mobile
          save.id = row.id
          save.permissions = row.permissions
          alert(111)
          this.$refs['edit'].showEdit(save)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const ids = row.id.toString()
            const { msg } = await doDelete({ ids: ids })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const lists = await getList(this.queryForm)
        this.list = lists.data.adminList
        this.total = lists.data.count
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
