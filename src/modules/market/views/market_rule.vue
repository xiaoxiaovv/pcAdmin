<template>
  <div class="merchant-box">
   <el-row :gutter="12">
     <el-col :span="8">
       <div @click="dialogzfbVisible = true">
         <el-card shadow="hover" class="my-card">
           <div>
             <img src="../../../assets/images/extension/alipay.png" />
           </div>
           <div>支付宝配置规则</div>
         </el-card>
       </div>
     </el-col>
     <el-col :span="8">
       <div @click="dialogwxVisible = true">
         <el-card shadow="hover" class="my-card">
           <div>
             <img src="../../../assets/images/extension/wx.png" />
           </div>
           <div>微信配置规则</div>
         </el-card>
       </div>
     </el-col>
   </el-row>
   <el-dialog title="支付宝配置规则" :visible.sync="dialogzfbVisible">
     <el-form :model="form" label-position="top">
       <el-form-item label="活动截止日期" :label-width="formLabelWidth">
         <el-date-picker
           v-model="form.date"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
       </el-form-item>
       <el-form-item label="商户一个自然月最低抵扣券数量(低于此数量不给佣金)" :label-width="formLabelWidth">
         <el-input type="number" v-model="form.minNumber" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item label="同一商户同一用户每月可抵扣券数量" :label-width="formLabelWidth">
         <el-input type="number" v-model="form.maxNumber" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item label="商户每月最多抵扣券数量" :label-width="formLabelWidth">
         <el-input type="number" v-model="form.saleNumber" autocomplete="off"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogzfbVisible = false">取 消</el-button>
       <el-button type="primary" @click="editZfb">确 定</el-button>
     </div>
   </el-dialog>
   <el-dialog title="微信配置规则" :visible.sync="dialogwxVisible">
     <el-form :model="form1" label-position="top">
       <el-form-item label="活动截止日期" :label-width="formLabelWidth">
         <el-date-picker
           v-model="form1.date"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
       </el-form-item>
       <el-form-item label="商户一个自然月最低抵扣券数量(低于此数量不给佣金)" :label-width="formLabelWidth">
         <el-input type="number" v-model="form1.minNumber" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item label="同一商户同一用户每月可抵扣券数量" :label-width="formLabelWidth">
         <el-input type="number" v-model="form1.maxNumber" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item label="商户每月最多抵扣券数量" :label-width="formLabelWidth">
         <el-input type="number" v-model="form1.saleNumber" autocomplete="off"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogwxVisible = false">取 消</el-button>
       <el-button type="primary" @click="editWx">确 定</el-button>
     </div>
   </el-dialog>
  </div>
</template>

<script>
  import { getRuleList, editRule, doRule } from '../api/market.js'
  export default {
      data() {
        return {
          dialogzfbVisible: false,
          dialogwxVisible: false,
          form: {
            date: '',
            minNumber: 0,
            maxNumber: 0,
            saleNumber: 0,
          },
          form1: {
            date: '',
            minNumber: 0,
            maxNumber: 0,
            saleNumber: 0,
          },
          ruleList: [],
          zfbid: '',
          wxid: '',
          zfbItem: '',
          wxItem: '',
          formLabelWidth: '400px'
        }
      },
      mounted() {
          this.getRuleList()
      },
      methods: {
          getRuleList() {
            getRuleList().then(res => {
              if (res.code === 200 && res.obj.length != 0) {
                this.ruleList = res.obj;
                this.ruleList.map(item => {
                  if (item.paltform == 'aliPay') {
                    this.zfbid = item.id
                    this.form = {
                      date: item.marketEndDate,
                      minNumber: item.merchantOrderLimit,
                      maxNumber: item.merchantUserLimit,
                      saleNumber: item.merchantVoucherLimit,
                    }
                    this.zfbItem = item
                  }
                  if (item.paltform == 'weChat') {
                    this.wxid = item.id
                    this.form1 = {
                      date: item.marketEndDate,
                      minNumber: item.merchantOrderLimit,
                      maxNumber: item.merchantUserLimit,
                      saleNumber: item.merchantVoucherLimit,
                    }
                    this.wxItem = item
                  }
                })
              }
            })
          },
          editZfb () {
            if (this.zfbid == '') { //添加
            const params = {
              marketEndDate: this.form.date,
              merchantOrderLimit: this.form.minNumber,
              merchantUserLimit: this.form.maxNumber,
              merchantVoucherLimit: this.form.saleNumber,
              paltform: 'aliPay'
            }
              editRule(params).then(res => {
                  if (res.code === 200) {
                    this.dialogzfbVisible = false
                    this.$message.success(res.msg)
                    this.getRuleList()
                  }
              })
            } else {
              this.zfbItem.marketEndDate = this.form.date,
              this.zfbItem.merchantOrderLimit = this.form.minNumber,
              this.zfbItem.merchantUserLimit = this.form.maxNumber,
              this.zfbItem.merchantVoucherLimit = this.form.saleNumber,
              doRule(this.zfbItem).then(res => {
                  if (res.code === 200) {
                    this.dialogzfbVisible = false
                    this.$message.success(res.msg)
                    this.getRuleList()
                  }
              })
            }
          },
          editWx () {
            if (this.wxid == '') { //添加
            const params = {
              marketEndDate: this.form1.date,
              merchantOrderLimit: this.form1.minNumber,
              merchantUserLimit: this.form1.maxNumber,
              merchantVoucherLimit: this.form1.saleNumber,
              paltform: 'weChat'
            }
              editRule(params).then(res => {
                  if (res.code === 200) {
                    this.dialogwxVisible = false
                    this.$message.success(res.msg)
                    this.getRuleList()
                  }
              })
            } else {
              this.wxItem.marketEndDate = this.form1.date,
              this.wxItem.merchantOrderLimit = this.form1.minNumber,
              this.wxItem.merchantUserLimit = this.form1.maxNumber,
              this.wxItem.merchantVoucherLimit = this.form1.saleNumber,
              doRule(this.wxItem).then(res => {
                  if (res.code === 200) {
                    this.dialogwxVisible = false
                    this.$message.success(res.msg)
                    this.getRuleList()
                  }
              })
            }
          },
      },
    }
</script>

<style lang="scss" scoped>
.merchant-box {
  padding: 40px;
  .my-card {
    cursor: pointer;
    text-align: center;
  }
}
</style>
