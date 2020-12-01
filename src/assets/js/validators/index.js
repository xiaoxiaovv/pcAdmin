import validValidator from './validValidator'
import {
  account,
  password,
  passwords,
  mobile,
  phone,
  email,
  URL,
  currency,
  integer,
  positiveInteger,
  versionNum,
  urlMatch,
  wxNum
} from '@/utils/validator'
import groupValidator from './src/group'
import maxValidator from './src/max'
import minValidator from './src/min'
import maxlengthValidator from './src/maxlength'
import nameValidator from './src/name'

export {
  // 组合校验
  groupValidator,
  // 最大值校验
  maxValidator,
  // 最小值校验
  minValidator,
  // 姓名
  nameValidator,
  // 字数长度校验
  maxlengthValidator
}
// 账号
export const accountValidator = validValidator(account)
// 密码
export const passwordValidator = validValidator(password)
export const passwordsValidator = validValidator(passwords)
// 手机号码
export const mobileValidator = validValidator(mobile)
// 固定电话
export const phoneValidator = validValidator(phone)
// email
export const emailValidator = validValidator(email)
// URL
export const URLValidator = validValidator(URL)
// 货币
export const currencyValidator = validValidator(currency)
// 整数
export const integerValidator = validValidator(integer)
// 正整数
export const positiveIntegerValidator = validValidator(positiveInteger)
// 版本号
export const versionNumValidator = validValidator(versionNum)
// url
export const urlMatchValidator = validValidator(urlMatch)
// 微信号
export const wxNumValidator = wxNum
