/**
 * 下载blob文件
 * @param {*} blob
 * @param {*} fileName
 * @param {*} clearTime
 */
const downloadFile = (blob, fileName, clearTime = 10000) => {
  if (!blob || !(blob instanceof Blob)) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([blob]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName || '下载.xlsx')
  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
  }, clearTime)
}
export default downloadFile
