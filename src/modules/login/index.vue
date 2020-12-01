<template>
  <div class="login-container"
       v-bind:style="bgStyle">
    <div class="login-header">
      <div class="header-left">
        <!--<img src="../../assets/images/login/logo.png">-->
        <img v-if="siteInfo.logo"
             :src="siteInfo.logo">
      </div>
      <div class="header-right">
        <!-- <span>客服热线：400-021-1220</span>
        <span><img src="../../assets/images/login/weChat.png">关注微信公众号</span> -->
      </div>
    </div>
    <div class="login-form loginform">
      <p class="title_zh">刷脸支付后台登录系统</p>
      <p class="title_en">Face payment background login system</p>
      <el-form class="form-box">
        <el-form-item class="form-item-box">
          <!-- <p class="input-p">用户名：</p> -->
          <el-input v-model.trim="loginForm.username"
                    placeholder="请输入登录账号"></el-input>
          <i class="horn hornTF"></i>
          <i class="horn hornTR"></i>
          <i class="horn hornBF"></i>
          <i class="horn hornBR"></i>
        </el-form-item>
        <el-form-item>
          <!-- <p class="input-p">密&nbsp&nbsp&nbsp码：</p> -->
          <el-input v-model="loginForm.password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    autocomplete="off"
                    placeholder="请输入密码"></el-input>
          <i class="horn hornTF"></i>
          <i class="horn hornTR"></i>
          <i class="horn hornBF"></i>
          <i class="horn hornBR"></i>
          <!--<span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>-->
        </el-form-item>

        <el-form-item class="loginBtn">
          <el-button type="primary"
                     :loading="loading"
                     @click="handleLogin"
                     class="login-btn"
                     style="">登录</el-button>
        </el-form-item>
        <div class="fogotBtn_lay">
          <div style="float:left;">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <!-- <div style="float:right;">
            <el-button type="text"
                       class="fogotBtn"
                       @click="goFogotPw">&nbsp忘记密码</el-button>
          </div> -->
        </div>

      </el-form>
      <!-- <div class="null-box"></div> -->
    </div>
    <div class="login-footer">
      <p>技术支持：{{info.techSupport||''}}</p>
      <p>网站ICP备案号：<span @click="openCript" style="text-decoration: underline;cursor: pointer;">{{info.icpInfo||''}}</span> Copyright {{info.copyrightInfo||''}}</p>
    </div>
    <!--超级管理员登录-->
    <el-dialog title="提示"
               :visible.sync="dialogLogin.open"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="closeUserList"
               width="600px">
      <div class="role-tree" style="max-height: 56vh; overflow: auto;" v-if="dialogLogin.open">
        <el-tree :data="dialogLogin.treeData" :props="defaultProps" highlight-current :check-strictly="true" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserList">取 消</el-button>
        <el-button type="primary" @click="comfirmLogin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSiteInfo, getUserList } from '@/modules/login/api/login'
import { returnThumbnailUrl, returnFilesUrl, uploadUrl } from '@/modules/file/api/upload' // 图片操作API
import loginLogo from '@/assets/images/login/logo.png'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      checked: false,
      siteInfo: {
        bg: '',
        logo: loginLogo,
        loginLogo: loginLogo
      },
      bgStyle: {
        background: '',
        backgroundSize: ''
      },
      loading: false,
      pwdType: 'password',
      info: {},
      // 登录角色
      defaultProps: {
        children: 'children',
        label: 'companyName'
      },
      dialogLogin: {
        open: false
      }
    }
  },
  mounted () {
    // 获取默认信息
    this.getInfo()
    this.getCookie()
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    /**
     * 登录
     * */
    handleLogin (event, loginInfo) {
      // 判断复选框是否被勾选 勾选则调用配置cookie方法
      if (this.checked) {
        // 传入账号名，密码，和保存天数3个参数
        this.setCookie(this.loginForm.username, this.loginForm.password, 7)
      } else {
        // 清空Cookie
        this.clearCookie()
      }
      this.loading = true
      let params = loginInfo || Object.assign({}, this.loginForm)
      this.$store.dispatch('login', params).then((res) => {
        if (res.obj.superLogin && res.obj.superLogin === 'Y') {
          this.loading = false
          // 需要选择角色登录
          this.turnToCheckRole()
        } else {
          this.$router.replace({ path: '/' })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 选择角色登录
     * */
    turnToCheckRole() {
      getUserList().then(res => {
        this.dialogLogin = {
          open: true,
          treeData: res.obj
        }
      })
    },
    /**
     * 选择登录的角色
     * */
    handleNodeClick (node) {
      this.$set(this.dialogLogin, 'node', node)
    },
    /**
     *确认登录
     **/
    comfirmLogin() {
      if (this.dialogLogin.node && this.dialogLogin.node.userName) {
        let params = {
          username: this.dialogLogin.node.userName
        }
        this.handleLogin('', params)
      } else {
        this.$message.warning('请选择登录账号')
      }
    },
    /**
     * 关闭--弹窗需要清除缓存
     * */
    closeUserList() {
      this.dialogLogin.open = false
      delete this.dialogLogin.node
      sessionStorage.clear()
    },
    /**
     * 获取信息
     */
    getInfo: function () {
      getSiteInfo().then(res => {
        console.log(res)
        let data = res.obj
        // 如果有背景图
        if (data.bgmPhoto !== '' && data.bgmPhoto != null) {
          this.siteInfo.bg = "url('" + this.getImg(data.bgmPhoto) + "') 50% no-repeat"
          this.bgStyle.background = this.siteInfo.bg // 背景图片background: url(/static/img/bg.e499aee.png) 50% no-repeat;
          this.bgStyle.backgroundSize = 'cover' // 100%大小
        }
        // 如果有LOGO
        if (data.logo !== '' && data.logo != null) {
          // this.siteInfo.logo = this.getImg(data.logo)
          sessionStorage.removeItem('logoImg')
          sessionStorage.setItem('logoImg', this.getImg(data.logo))
        }
        // 如果有LOGO
        if (data.loginLogo !== '' && data.loginLogo != null) {
          this.siteInfo.logo = this.getImg(data.loginLogo)
          // sessionStorage.removeItem('logoImg')
          // sessionStorage.setItem('logoImg', this.getImg(data.loginLogo))
        }
        this.info = data
      })
    },
    /**
     * 换取图片
     */
    getImg: function (val) {
      let reg = /^[0-9]*$/
      if (reg.test(val)) {
        return returnFilesUrl(val)
      } else {
        let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
        return base64
      }
    },
    /**
     * 忘记密码
     */
    goFogotPw () {
      console.log('go')
      this.$router.push({ path: '/fogot' })
    },
    // 设置cookie
    setCookie (c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie = 'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.loginForm.username = arr2[1] // 保存到保存数据的地方
            this.checked = true
          } else if (arr2[0] == 'userPwd') {
            this.loginForm.password = arr2[1]
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    openCript () {
      window.open('http://www.beian.miit.gov.cn')
    }
  }
}
</script>
