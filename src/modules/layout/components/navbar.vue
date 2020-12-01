<template>
  <el-menu
    class="navbar"
    mode="horizontal"
  >
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleBar"
      :isActive="isClosed"
    ></hamburger>
    <breadcrumb></breadcrumb>
    <div class="avatar-container username">{{username}}</div>
    <div class="avatar-container messageicon">
      <img
        style="cursor: pointer;"
        v-if="userType==='1'||userType==='undefined'"
        src="../../../assets/images/nav/mes.png"
        alt=""
        @click="toNoticeList"
      >
    </div>
    <el-dropdown
      class="avatar-container"
      trigger="click"
    >

      <span class="el-dropdown-link">
        个人中心<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item @click.native="resetPasswordDialogOpen">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>
    <div
      class="avatar-container powerIcon"
      @click="logout"
    >
      <i class="el-icon-switch-button"></i>
    </div>
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordDialog"
      width="30%"
      :before-close="resetPasswordDialogClose"
      append-to-body
    >
      <el-form
        :model="resetForm"
        ref="resetForm"
        label-width="100px"
      >
        <el-form-item
          label="原密码"
          prop="password"
        >
          <el-input
            v-model="resetForm.oldPassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="password"
        >
          <el-input
            v-model="resetForm.newPassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="password"
        >
          <el-input
            v-model="resetForm.confirmPassword"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetPasswordDialogClose">取 消</el-button>
        <el-button
          type="primary"
          @click="saveNewPssword"
        >提 交</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>
<script>
import { mapGetters } from 'vuex'
import breadcrumb from '@/components/breadcrumb'
import hamburger from '@/components/hamburger'
import { MessageBox } from 'element-ui'
import { updatePwd } from '@/modules/manager/api/manager'
import * as validatorRules from '@/utils/validator'

export default {
  name: 'navbar',
  data () {
    return {
      username: '你好，' + (sessionStorage.name ? sessionStorage.name : sessionStorage.username),
      resetPasswordDialog: false, // 修改密码对话框
      resetForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      userType: ''
    }
  },
  components: {
    breadcrumb,
    hamburger
  },
  mounted () {
    this.userType = sessionStorage.getItem('userType')
  },
  methods: {
    toggleBar () {
      this.$store.dispatch('toggleBar')
    },
    toNoticeList () {
      this.$router.push({ path: '/notice/views/index' })
    },
    logout () {
      MessageBox.confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        sessionStorage.clear()
        location.reload()
      })
    },
    initRestForm () {
      this.resetForm.oldPassword = ''
      this.resetForm.newPassword = ''
      this.resetForm.confirmPassword = ''
    },
    // 重置密码
    resetPasswordDialogOpen: function () {
      console.log(111)
      this.initRestForm()
      // 获取被修改的ID
      this.resetPasswordDialog = true
    },
    resetPasswordDialogClose: function () {
      this.initRestForm()
      this.resetPasswordDialog = false
    },
    saveNewPssword: function () {
      if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        this.$message({
          message: '两次密码输入不一致',
          type: 'error'
        })
        return
      }
      if (this.resetForm.newPassword) {
        let isValid = validatorRules.password.valid(this.resetForm.newPassword)
        if (!isValid) {
          this.$message.warning(validatorRules.password.msg)
          return
        }
      }
      // 保存密码
      updatePwd(this.resetForm.oldPassword, this.resetForm.newPassword).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.resetForm.password = ''
        this.initRestForm()
        this.resetPasswordDialog = false
      })
      .catch(() => {
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['isClosed'])
  }
}
</script>
