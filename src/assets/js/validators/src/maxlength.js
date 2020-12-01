export default (rule, value, callback, source, options) => {
  let errors = []
  if (value && value.length > rule.maxlength) {
    errors.push(rule.message || `字数不能大于${rule.maxlength}个`)
  }
  callback(errors)
}
