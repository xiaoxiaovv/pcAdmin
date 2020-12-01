export default (rule, value, callback, source, options) => {
  let errors = []
  if (value) {
    if (value.length < (rule.minlength || 2) || rule.maxlength < (rule.maxlength || 20)) {
      errors.push(rule.message || '请输入2到20以内的姓名')
    }
  }
  callback(errors)
}
