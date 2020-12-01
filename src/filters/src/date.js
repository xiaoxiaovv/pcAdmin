import { fmt } from '@/utils/dateFmt.js'

// 时间戳格式
export default (value, format) => {
  return fmt.date(value, format)
}
