module.exports = {
  onName: [
    {required: true, message: '请输入投放名称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
  ],
  startTime: [
    {required: true, message: '请选中投放开始时间', trigger: 'blur'},
  ],
  endTime: [
    {required: true, message: '请选中投放结束时间', trigger: 'blur'},
  ],
  advertiseId: [
    {required: true, message: '请选择广告', trigger: 'blur'},
  ],
  strategicId: [
    {required: true, message: '请选择策略', trigger: 'blur'},
  ],
  money: [
    {required: true, message: '请输入投放预算', trigger: 'blur'},
  ],
  runCost: [
    {required: true, message: '请输入每单次跳转费用', trigger: 'blur'},
  ],
  showCost: [
    {required: true, message: '请输入每千次展示费用', trigger: 'blur'},
  ],
  clickCost: [
    {required: true, message: '请输入每点击单价', trigger: 'blur'},
  ],


  advertiseName: [
    {required: true, message: '请输入广告名称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
  ],
  imageId: [
    {required: true, message: '请上传图片', trigger: 'blur'},
  ],
  imageLink: [
    {required: true, message: '请输入跳转链接', trigger: 'blur'},
  ],


  strategicName: [
    {required: true, message: '请输入策略名称', trigger: 'blur'},
  ],

  payEntrys: [
    {required: true, message: '请选择平台', trigger: 'blur'},
  ],


};
