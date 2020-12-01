// validator为 @/utils/Validator 实例
export default (validator) => (rule, value, callback, source, options) => {
  let errors = []
  if (value && !validator.valid(value)) {
    errors.push(rule.message || validator.msg)
  }
  callback(errors)
}
