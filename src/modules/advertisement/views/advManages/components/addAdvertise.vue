<template>
  <div>
    <el-form  ref="validateForm" label-width="150px" :model="params" :rules="rules" @submit.native.prevent>
      <div style="max-height: 55vh; overflow-y: auto;">
      <el-form-item label="广告标题" prop="title">
        <el-input v-model.trim="params.title" size="medium" style="width: 300px;" :maxlength="50" clearable></el-input>
      </el-form-item>
      <el-form-item label="投放对象" prop="targetType">
        <el-button :type="params.targetType===1?'primary':''" size="medium" @click="params.targetType = 1">商户</el-button>
        <el-button :type="params.targetType===2?'primary':''" size="medium" @click="params.targetType = 2">客户</el-button>
        <el-button :type="params.targetType===3?'primary':''" size="medium" @click="params.targetType = 3">付款设备</el-button>
      </el-form-item>
      <el-form-item label="投放设备" prop="equType" v-if="params.targetType === 3">
        <el-button :type="params.equType===0?'primary':''" size="medium" @click="params.equType = 0">全部</el-button>
        <el-button :type="params.equType===1?'primary':''" size="medium" @click="params.equType = 1">蜻蜓</el-button>
        <el-button :type="params.equType===2?'primary':''" size="medium" @click="params.equType = 2">青蛙</el-button>
      </el-form-item>
      <el-form-item label="投放范围" prop="targetRange">
        <el-input v-model="params.targetRange" size="medium" style="width: 300px;display: none;" :maxlength="50" clearable ></el-input>
        <div v-if="params.targetType===1">
          <!--<el-button :type="zoneA===1?'primary':''" size="medium" @click="zoneA = 1">平台全部商户</el-button>-->
          <el-button :type="zoneA===2?'primary':''" size="medium" @click="zoneA = 2">{{levelAlias.firstName}}所有商户</el-button>
          <el-button :type="zoneA===3?'primary':''" size="medium" @click="zoneA = 3">{{levelAlias.secondName}}所有商户</el-button>
          <el-button :type="zoneA===15?'primary':''" size="medium" @click="zoneA = 15">{{levelAlias.thirdName}}所有商户</el-button>
          <el-button :type="zoneA===16?'primary':''" size="medium" @click="zoneA = 16">{{levelAlias.oemName}}所有商户</el-button>
          <!--<el-button :type="zoneA===4?'primary':''" size="medium" @click="zoneA = 4">指定商户</el-button>-->
          <el-button :type="zoneA===5?'primary':''" size="medium" @click="zoneA = 5">选择城市</el-button>
          <el-button :type="zoneA===11?'primary':''" size="medium" @click="zoneA = 11">商户收款后页面</el-button>
        </div>
        <div v-if="params.targetType===2">
          <el-button :type="zoneB===6?'primary':''" size="medium" @click="zoneB = 6">客户小程序</el-button>
          <el-button :type="zoneB===7?'primary':''" size="medium" @click="zoneB = 7">客户付完款页面</el-button>
        </div>
        <div v-if="params.targetType===3">
          <el-button :type="zoneC===8?'primary':''" size="medium" @click="zoneC = 8">启动页</el-button>
          <el-button :type="zoneC===9?'primary':''" size="medium" @click="zoneC = 9">收银页</el-button>
          <el-button :type="zoneC===12?'primary':''" size="medium" @click="zoneC = 12">支付成功页</el-button>
          <el-button :type="zoneC===10?'primary':''" size="medium" @click="zoneC = 10" v-if="propsInfo.showMemberPayStatus">会员支付成功页</el-button>
          <el-button :type="zoneC===13?'primary':''" size="medium" @click="zoneC = 13" v-if="false">收押金成功页</el-button>
          <!--<el-button :type="zoneC===14?'primary':''" size="medium" @click="zoneC = 14">退押金成功页</el-button>-->
        </div>
      </el-form-item>
      <el-form-item label="设为默认广告"  prop="targetType">
        <el-checkbox v-model="params.type" :true-label="1" :false-label="0">设为默认</el-checkbox>
      </el-form-item>
      <el-form-item label="行业分类" v-if="params.targetType===1 || params.targetType===3" prop="industryCategory">
        <el-checkbox-group :value="params.industryCategory">
          <el-checkbox v-for="item in industryCategoryArr" :label="item.value" :key="item.value" @change="changeCategory">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="投放城市" :prop="(params.targetType===1 && zoneA === 5)?'cityIds':''" v-if="params.targetType===1 &&  zoneA === 5">
        <el-select placeholder="请选择投放城市"
                   v-model="params.cityIds"
                   multiple
                   filterable
                   collapse-tags
                   clearable>
          <el-option-group v-for="group in provList"
                           :key="group.id"
                           :label="group.name">
            <el-option v-for="item in group.children"
                       :key="item.value"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <!--付款设备且是启动页-->
      <el-form-item label="媒体类型" prop="turn" v-if="params.targetType===3 && zoneC === 8">
        <el-radio v-model="params.adType" :label="0">图片广告</el-radio>
        <el-radio v-model="params.adType" :label="1">视频广告</el-radio>
      </el-form-item>
      <el-form-item label="展示图片:" prop="imageUrl" v-if="params.adType !== 1">
        <ImgUpload v-model="params.imageUrl" :urlType="2"></ImgUpload>
        <div>建议尺寸：{{imageRule(zoneStatu)}}<span class="advtips-img" @click="viewImg"><i class="el-icon-warning"></i>示例</span></div>
        <el-input v-model="params.imageUrl" style="display: none;"></el-input>
      </el-form-item>
      <el-form-item label="展示视频:" prop="videoUrl" v-if="params.adType === 1">
        <VideoUpload v-model="params.videoUrl" :urlType="2" :imgPixel="2"></VideoUpload>
        <div><span class="advtips-img" @click="viewImg"><i class="el-icon-warning"></i>示例</span></div>
        <!--<div>建议尺寸：{{imageRule(zoneStatu)}}<span class="advtips-img" @click="viewImg"><i class="el-icon-warning"></i>示例</span></div>-->
        <el-input v-model="params.videoUrl" style="display: none;"></el-input>
      </el-form-item>
      <!--<el-form-item label="使用外部浏览器打开" prop="turn" v-if="!(zoneB===6 || params.targetTyp===3 || params.adType === 1)">-->
      <el-form-item label="使用外部浏览器打开" prop="turn" v-if="!(params.targetType === 3 || (params.targetType === 2 && zoneB === 6) || params.adType === 1)">
        <el-radio v-model="params.isJump" :label="1">是</el-radio>
        <el-radio v-model="params.isJump" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="图片链接" prop="imageLink" v-if="!((params.targetType===2 && zoneB===6) || params.targetType===3)">
        <el-input v-model.trim="params.imageLink" size="medium" style="width: 300px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="有效日期" prop="beginTime" v-if="!params.type">
        <el-date-picker v-model="timeZone"
                        size="medium"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 300px;"
                        :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-input v-model="params.beginTime" size="medium" style="width: 300px;display: none;" :maxlength="50" clearable ></el-input>
      </el-form-item>
      </div>
      <el-form-item>
        <div class="vm-text-right" style="padding-top: 20px;">
          <el-button size="medium" @click="propsInfo.show = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitInfo('validateForm')">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--图片放大-->
    <el-dialog title="图片预览"
               :visible.sync="dialogImgView.show" append-to-body>
      <div style="text-align: center">
        <span  style="display:inline-block;max-height: 95vh;">
          <img style="width: 100%;" :src="dialogImgView.imgUrl"/>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImgView.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as advertiseApi from '../../../api/advManage'
import * as commonApi from '@/api/common'
import * as utilsCollect from '@/utils/utilsCollect'
import {returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' // 图片操作API
import { levelAliasMixin } from '@/mixins'
import adv1 from '@/assets/images/advertise/adv1.png'
import adv6 from '@/assets/images/advertise/adv6.png'
import adv7 from '@/assets/images/advertise/adv7.png'
import adv8 from '@/assets/images/advertise/adv8.png'
import adv9 from '@/assets/images/advertise/adv9.png'
import adv10 from '@/assets/images/advertise/adv10.png'
import adv12 from '@/assets/images/advertise/adv12.png'
import adv13 from '@/assets/images/advertise/adv13.png'
import adv14 from '@/assets/images/advertise/adv14.png'
import ImgUpload from '@/components/imgUpload/index'
import VideoUpload from '@/components/videoUpload/index'
export default {
  mixins: [levelAliasMixin],
  components: {
    ImgUpload,
    VideoUpload
  },
  props: {
    propsInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    industryCategoryArr: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    const dateValidator = (rule, value, callback, source, options) => {
      let errors = []
      let currentTime = new Date().getTime() - 24 * 60 * 60 * 1000
      let nowTime = new Date(value).getTime()
      if (nowTime <= currentTime) {
        if (this.timeCheck.length && this.timeCheck[0] === value) {
          callback(errors)
        } else {
          errors.push('开始时间不能小于当前时间')
        }
      }
      callback(errors)
    }
    return {
      modify: true, // 用于初次校验时间，主要针对编辑的时候
      zoneA: '',
      zoneB: '',
      zoneC: '',
      provList: [],
      timeZone: null,
      cityIds: '',
      timeCheck: [],
      params: {
        adType: 0, // 1视频广告 0图片广告
        equType: 0, // 投放设备 0全部 1蜻蜓 2青蛙
        provVal: null,
        title: '',
        targetType: 1,
        targetRange: '', // 1平台所有商户 2一级代理所有商户 3二级代理所有商户 4指定商户 5指定城市（1-5，15，16 商户app首页广告） 6客户小程序 7（小程序）客户付完款页面 8（设备）启动页 9（设备）收银页 10（设备）支付成功页 11（app）商户收款后广告 12（设备）非会员支付页 13收押金页成功 14退押金成功15三级代理商所有商户 16服务商所有商户
        targetIds: [],
        imageUrl: '',
        videoUrl: '',
        isJump: 1,
        imageLink: '',
        cityIds: [],
        beginTime: '',
        endTime: '',
        type: 0, //  1默认广告 0不是
        industryCategory: [] // 行业分类 仅商户和付款设备可选 行业分类 0超市 1自助点餐 2医药 3加油站 4景区
      },
      imgRule: {
        1: '750*220',
        2: '750*220',
        3: '750*220',
        4: '750*220',
        5: '750*220',
        6: '750*220',
        7: '750*600',
        8: '750*1332',
        9: '720*500',
        10: '750*240',
        11: '750*600',
        12: '750*556',
        13: '750*778',
        14: '750*556',
        15: '750*220',
        16: '750*220'
      },
      /**
       * 1--平台全部商户
       * 2--firstName所有商户（一级）
       * 3--secondName所有商户（二级）
       * 4--指定商户
       * 5--选择城市
       * 6--客户小程序
       * 7--客户付完款页面
       * 8--启动页
       * 9--收银页
       * 10--支付成功页
       * 11--商户收款后页面
       * 12--非会员支付成功页
       * 13--收押金成功页
       * 14--退押金成功页
       * 15--thirdName所有商户(三级)
       * 16--oemName所有商户(服务商)
      **/
      imgUrl: {
        adv1: adv1,
        adv6: adv6,
        adv7: adv7,
        adv8: adv8,
        adv9: adv9,
        adv10: adv10,
        adv12: adv12,
        adv13: adv13,
        adv14: adv14
      },
      imgUrlVal: adv1,
      dialogImgView: {
        show: false
      },
      rules: {
        title: [
          { required: true, message: '请输入广告标题' },
          { max: 50, message: '请输入1~20个字' }
        ],
        targetType: [
          { required: true, message: '请选择投放对象' }
        ],
        equType: [
          { required: true, message: '请选择投放设备' }
        ],
        targetRange: [
          { required: true, message: '请选择投放范围' }
        ],
        cityIds: [
          { required: true, message: '请选择投放城市' }
        ],
        imageUrl: [
          { required: true, message: '请选择展示图片' }
        ],
        videoUrl: [
          { required: true, message: '请选择展示视频' }
        ],
        beginTime: [
          { required: true, message: '请选择开始时间与结束时间' },
          { required: true, validator: dateValidator }
        ],
        industryCategory: [
          { required: true, message: '请选择行业分类' }
        ]
      },
      // 图片上传-------------------
      filesData: {
        module: 'image'
      },
      url: uploadUrl + '/user',
      headers: {
        authorized: sessionStorage.token
      }
    }
  },
  watch: {
    'zoneStatu' (val) {
      this.params.targetRange = val
      this.params.targetIds = [val]
    },
    'params.provVal' (val) {
      val = val || []
      // let cityNameStr = val[val.length - 1] || ''
      // let cityName = cityNameStr.replace(/[0-9]/ig, '') // 去除字符串中的数字
      // let cityNameArr = cityName ? [cityName] : []
      this.$set(this.params, 'cityNames', val)
    },
    'timeZone' (val) {
      val = val || []
      this.params.beginTime = val[0] || ''
      this.params.endTime = val[val.length - 1] || ''
    },
    'params.targetType' (val) {
      if (val !== 3) {
        this.$set(this.params, 'adType', 0)
      }
    },
    'zoneC' (val) {
      if (val !== 8) {
        this.$set(this.params, 'adType', 0)
      }
    }
  },
  computed: {
    zoneStatu () {
      let obj = this.params.targetType
      let zoneVal = ''
      zoneVal = obj === 1 ? this.zoneA : obj === 2 ? this.zoneB : obj === 3 ? this.zoneC : ''
      return zoneVal
    }
  },
  created () {
    this.getProviceTreeCall()
    this.$nextTick(() => {
      this.getAdDetail()
    })
    // this.provList = utilsCall.initProvincialTree(2, 1)
  },
  methods: {
    /**
     * 获取广告详情
     * */
    getAdDetail () {
      if (this.propsInfo.type === 2) {
        let id = this.propsInfo.data.id
        advertiseApi.getAdDetail(id).then(res => {
          let industryCategory = [res.obj.industryCategory]
          delete res.obj.industryCategory
          this.$set(res.obj, 'industryCategory', industryCategory)
          this.setZoneVal(res.obj.targetType, res.obj.targetRange)
          if (res.obj.adType === 1) {
            this.$set(res.obj, 'videoUrl', res.obj.imageUrl)
            delete res.obj.imageUrl
          }
          if (res.obj.beginTime && res.obj.endTime && (res.obj.beginTime !== '2019-10-01 00:00:00') && (res.obj.endTime !== '2019-10-01 00:00:00')) {
            this.timeZone = [res.obj.beginTime, res.obj.endTime]
            this.timeCheck = [res.obj.beginTime, res.obj.endTime]
          }
          this.params = Object.assign({}, this.params, res.obj)
          console.log(res)
        })
      }
    },
    setZoneVal (targetType, targetRange) {
      switch (targetType) {
        case 1:
          this.zoneA = targetRange
          break
        case 2:
          this.zoneB = targetRange
          break
        case 3:
          this.zoneC = targetRange
          break
      }
    },
    imageRule (val) {
      val = val || 1
      this.showimgUrl(val)
      return this.imgRule[val]
    },
    showimgUrl (val) {
      let url = this.imgUrl.adv1
      switch (val) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 15:
        case 16:
          url = this.imgUrl.adv1
          break
        case 6:
          url = this.imgUrl.adv6
          break
        case 7:
        case 11:
          url = this.imgUrl.adv7
          break
        case 8:
          url = this.imgUrl.adv8
          break
        case 9:
          url = this.imgUrl.adv9
          break
        case 10:
          url = this.imgUrl.adv10
          break
        case 12:
          url = this.imgUrl.adv12
          break
        case 13:
          url = this.imgUrl.adv13
          break
        case 14:
          url = this.imgUrl.adv14
          break
      }
      this.imgUrlVal = url
    },
    /**
     * 图片预览
     */
    viewImg () {
      let status = true
      if (this.params.targetType === 1 && (!this.zoneA)) {
        status = false
      }
      if (this.params.targetType === 2 && (!this.zoneB)) {
        status = false
      }
      if (this.params.targetType === 3 && (!this.zoneC)) {
        status = false
      }
      if (!status) {
        this.$message.warning('请选择投放范围')
        return false
      }
      this.dialogImgView = {
        show: true,
        imgUrl: this.imgUrlVal
      }
    },
    /**
     *选择省市区
     */
    mactbgUpload: function (response, file) {
      console.log(response)
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      this.mctBgmPhoto = response.obj
      this.params.imageUrl = this.getImg(response.obj)
    },
    getProviceTreeCall () {
      let params = {
        level: 3
      }
      commonApi.getProviceTree(params).then(res => {
        let newArr = utilsCollect.sortArrayByKeyDeep(res.obj, 1)
        this.provList = newArr
      })
    },
    /**
     * 重置图片
     */
    removeImg: function (type) {
      this.mctBgmPhoto = ''
      this.params.imageUrl = ''
    },

    /**
     *图片上传失败
     **/
    handleImageFailed () {
      this.$message({
        message: '图片上传失败',
        type: 'error'
      })
    },
    /**
     *对类型、大小做限制
     **/
    beforeLogoUpload (file) {
      let isImage = file.type.substring(0, 5) === 'image'
      if (!isImage) {
        this.$message.error('只允许图片格式（jpg / jpeg / png）')
        return false
      }
      return true
    },
    /**
     * 换取图片
     */
    getImg: function (val) {
      let reg = /^[0-9]*$/
      if (reg.test(val) && val != '') {
        return returnFilesUrl(val)
      } else {
        let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
        return base64
      }
    },
    submitInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },
    confirmSubmit () {
      let params = Object.assign({}, this.params)
      delete params.provVal
      if (!params.beginTime) {
        params.beginTime = '2019-10-01 00:00:00'
        params.endTime = '2019-10-01 00:00:00'
      }
      if (this.zoneA === 5) {
        delete params.targetIds
      } else {
        delete params.cityIds
      }
      if (this.params.adType === 1) {
        params.imageUrl = params.videoUrl
      }
      if (!(params.targetType === 1 || params.targetType === 3)) {
        params.industryCategory = ''
      } else {
        params.industryCategory = parseInt(params.industryCategory.join(''))
      }
      advertiseApi.advertiseAdd(params).then(res => {
        let message = this.propsInfo.type === 1 ? '添加成功' : '编辑成功'
        this.$message.success(message)
        this.propsInfo.show = false
        this.$emit('getTableList')
      })
    },
    /**
     * 改变行业
     * @param val
     */
    changeCategory (checked, node) {
      let checkedId = parseInt(node.target.defaultValue)
      if (checked) {
        this.params.industryCategory = [checkedId]
      } else {
        // this.params.industryCategory = []
      }
    }
  }
}
</script>

<style scoped>
  .el-button--medium{
    margin-right: 10px;
  }
  .el-button + .el-button {
    margin-left: 0;
    margin-right:10px;
  }
  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    height: 102px;
    overflow: hidden;
    background-color: #f8f8f8;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px !important;
    height: 100px !important;
    line-height: 100px;
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px;
    display: block;
  }

  .advtips-img {
    margin-left: 10px;
    color: #3ebdff;
    opacity: 0.8;
    cursor: pointer;
  }
  .advtips-img:hover {
    opacity: 1;
  }
</style>
