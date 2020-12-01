/**
 *  type
 *  1--根据id进行排序
 *  其他值使用默认的方式排序
 */
export function sortArrayByKey (arr, type = 1, sortCompare) {
  if (type === 1) {
    arr.sort(compareById)
  } else {
    arr.sort(sortCompare)
  }
  return arr
}

export function sortArrayByKeyDeep (arr, type = 1, sortCompare) {
  arr = sortDeeply(arr, type, sortCompare)
  return arr
}

/**
 * 根据id进行排序
 * @param a
 * @param b
 * @returns {number}
 */
function compareById (a, b) {
  a = parseInt(a.id)
  b = parseInt(b.id)
  return a - b
}

/**
 * 根据id进行排序--深度排序
 * @param a
 * @param b
 * @returns {number}
 */
function sortDeeply (arr, type, sortCompare) {
  arr = arr || []
  arr = compareDeepSort(arr, type, sortCompare)
  return arr
}

/**
 * 根据id进行排序--进行深排序
 * @param a
 * @param b
 * @returns {number}
 */
function compareDeepSort (arr, type, sortCompare) {
  arr = arr || []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i].children) {
      arr[i].children = compareDeepSort(arr[i].children, type, sortCompare)
    }
  }
  if (type === 1) {
    arr.sort(compareById)
  } else {
    arr.sort(sortCompare)
  }
  return arr
}

