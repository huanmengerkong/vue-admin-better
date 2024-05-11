<template>
  <el-dialog label-width="800px" :title="title" :visible.sync="dialogFormVisible" @close="close">
    <!--     <el-form ref="form" label-width="80px" :model="form" :rules="rules">
 -->
    <el-form ref="form" class="demo-form-inline" :inline="true" :model="form" :rules="rules">
      <el-form-item label="表名称(英文)" style="display: inline-block">
        <el-input v-model="form.name" clearable placeholder="name" />
      </el-form-item>
      <el-form-item label="表注释">
        <el-input v-model="form.comment" clearable placeholder="comment" />
      </el-form-item>
      <el-form-item v-for="(item, index) in form.formItems" :key="index">
        <span>字段：</span>
        <el-input v-model="item.field" clearable placeholder="field" style="width: 90px" />
        <span style="margin-left: 10px">类型：</span>
        <el-select v-model="item.type" clearable placeholder="类型" style="width: 90px">
          <el-option label="tinyint" value="Tinyint" />
          <el-option label="int" value="int" />
          <el-option label="varchar" value="varchar" />
          <el-option label="text" value="text" />
          <el-option label="bigint" value="bigint" />
        </el-select>
        <span style="margin-left: 5px">长度：</span>
        <el-input-number v-model="item.length" clearable placeholder="length" />
        <span style="margin-left: 5px">注释：</span>
        <el-input v-model="item.text" clearable placeholder="字段释义" style="width: 100px" />
        <el-button circle icon="el-icon-delete" type="danger" @click="removeFormItem(index)" />
        <el-button v-if="index === form.formItems.length - 1" circle icon="el-icon-check" type="success" @click="addFormItem(index)" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/databaseManagement'
  import { getList } from '@/api/roleManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      // 自定义校验规则
      var validateTel = (rule, value, callback) => {
        if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(value)) {
          callback(new Error('输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
      var validateFormItems = (rule, value, callback) => {
        alert(111)
        // 判断是否每个表单项都有值
        const isValid = value.every((item) => item.field && item.type && item.length && item.text)
        if (!isValid) {
          callback(new Error('请完整填写所有字段'))
        } else {
          callback()
        }
      }
      return {
        roleList: [],
        title: '编辑数据库',
        form: {
          name: '',
          comment: '',
          formItems: [{ field: '', type: '', length: null, text: '' }],
        },
        rules: {
          name: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
          comment: [{ required: true, message: '请输入表注释', trigger: 'blur' }],
          formItems: [{ validator: validateFormItems, message: '不能为空', trigger: 'blur' }],
        },
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      async showEdit(row) {
        var req = {}
        req.page = 1
        req.size = 10000
        req.status = 1
        const res = await getList(req)
        this.roleList = res.data.list
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form.permissions = row.role_id
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
            console.log(this.form)
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
      addFormItem(index) {
        this.form.formItems.push({ field: '', type: '', length: null, text: '' })
      },
      removeFormItem(index) {
        this.form.formItems.splice(index, 1)
      },
    },
  }
</script>
