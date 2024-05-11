<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-divider content-position="left">菜单添加</el-divider>
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="父级" prop="parent">
        <!--         <el-input v-model="form.parent" autocomplete="on" />
 -->
        <el-col :lg="50" :md="54" :sm="54" :xl="56" :xs="54">
          <el-select
            ref="singleTree"
            v-model="singleSelectTreeVal"
            class="vab-tree-select"
            clearable
            popper-class="select-tree-popper"
            value-key="id"
            @clear="selectTreeClearHandle('single')"
          >
            <el-option :value="singleSelectTreeKey">
              <el-tree
                id="singleSelectTree"
                ref="singleSelectTree"
                :current-node-key="singleSelectTreeKey"
                :data="selectTreeData"
                :default-expanded-keys="selectTreeDefaultSelectedKeys"
                :highlight-current="true"
                node-key="id"
                :props="selectTreeDefaultProps"
                @node-click="selectTreeNodeClick"
              >
                <template #defalut="{ node }" class="vab-custom-tree-node">
                  <span class="vab-tree-item">{{ node.label }}</span>
                </template>
              </el-tree>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <input v-model="form.pid" autocomplete="off" type="hidden" />
      <el-form-item label="前端ICON" prop="icon">
        <el-input v-model="form.icon" autocomplete="off" />
      </el-form-item>
      <el-form-item label="前端名称" prop="name">
        <el-input v-model="form.name" autocomplete="on" />
      </el-form-item>
      <el-form-item label="组件模块(component)" prop="component">
        <el-input v-model="form.component" autocomplete="off" />
      </el-form-item>
      <el-form-item label="前端路径" prop="path">
        <el-input v-model="form.path" autocomplete="off" />
      </el-form-item>
      <el-form-item label="前端跳转" prop="redirect">
        <el-input v-model="form.redirect" autocomplete="off" />
      </el-form-item>
      <el-form-item label="后端路径" prop="action">
        <el-input v-model="form.action" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否菜单" prop="is_menu">
        <el-radio-group v-model="form.is_menu" class="ml-4">
          <el-radio :label="0" size="large" value="0">否</el-radio>
          <el-radio :label="1" size="large" value="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否禁用" prop="is_menu">
        <el-radio-group v-model="form.status" class="ml-4">
          <el-radio :label="0" size="large" value="0">否</el-radio>
          <el-radio :label="1" size="large" value="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/menuManagement'
  import { getRouterList as getList } from '@/api/router'

  export default {
    name: 'MenuManagementEdit',
    data() {
      return {
        form: {
          pid: 0,
        },
        rules: {
          id: [{ required: true, trigger: 'blur', message: '请输入路径' }],
        },
        title: '',
        dialogFormVisible: false,
        singleSelectTreeKey: '', //单选树默认key值
        singleSelectTreeVal: '',
        selectTreeDefaultSelectedKeys: [],
        selectLevel: 4, // 树可选叶子level等级
        selectTreeData: [], //单选树的值
        selectTreeDefaultProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    created() {},
    methods: {
      // 点击叶子节点
      selectTreeNodeClick(data, node, el) {
        this.form.parent_id = data.id
        this.form.pid = data.id
        //if (data.rank >= this.selectLevel) {
        this.singleSelectTreeVal = data.name
        this.singleSelectTreeKey = data.id
        this.$refs.singleTree.blur()
        // }
      },
      // 清除单选树选中
      selectTreeClearHandle(type) {
        this.selectTreeDefaultSelectedKeys = []
        this.clearSelected()
        if (type == 'single') {
          this.singleSelectTreeVal = ''
          this.singleSelectTreeKey = ''
          this.$refs.singleSelectTree.setCurrentKey('') // 设置默认选中
        } else {
          this.multipleSelectTreeVal = []
          this.multipleSelectTreeKey = ''
          this.$refs.multipleSelectTree.setCheckedKeys([])
        }
      },
      async showEdit(row) {
        var req = {}
        req.page = 1
        req.size = 10000
        req.status = 0
        req.is_menu = 1
        const datas = await getList(req)
        const treeArray = []
        const tree = {}
        tree.id = 0
        tree.pid = 0
        tree.name = 'root'
        tree.title = 'root'
        tree.path = '/'
        tree.value = 0
        tree.rank = 0
        tree.children = datas.data.Route
        treeArray.push(tree)
        this.selectTreeData = treeArray
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          row.icon = row.meta.icon
          row.is_menu = row.menu
          this.form.pid = row.parent_id
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
            if ('children' in this.form) {
              delete this.form['children']
            }
            const { msg } = await doEdit(this.form)
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
