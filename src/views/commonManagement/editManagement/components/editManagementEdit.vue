<template>
  <el-dialog label-width="800px" :title="title" :visible.sync="dialogFormVisible" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <div v-for="(column, index) in headerData" :key="index">
        <el-form-item :label="column.field" :prop="column.field">
          <el-input v-model.trim="form[column.field]" autocomplete="off" />
        </el-form-item>
      </div>
      <input v-model="form.permission_id" autocomplete="off" type="hidden" />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit, field } from '@/api/editManagement'

  export default {
    name: 'EditManagementEdit',
    data() {
      return {
        headerData: [],
        title: '添加',
        form: {},
        rules: {},
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      async showEdit(row) {
        const fields = await field({})
        this.headerData = fields.data.list
        this.form = {}
        this.headerData.forEach((column, index) => {
          this.$set(this.form, column.field, '')
        })
        this.$set(this.form, 'permission_id', 1)
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          //this.form.permissions = row.role_id
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const permissionId = this.form.permission_id
            delete (this.form, 'permission_id')
            const params = JSON.stringify(this.form)
            const req = {}
            req.permission_id = permissionId
            req.params = params
            const { msg } = await doEdit(req)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
