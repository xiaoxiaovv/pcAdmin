import cityJson from '@/assets/city/city.json'
export function initProvincialTree (type = 2, selectType = 2) {
  // selectType- 1=select, 2-cascader
  // type === 1 --- 省
  // type === 2 --- 省、市
  // type === 3 --- 省、市、区
  let cityJson = cityJsonTree()
  let provAndCity = []
  let index = 1
  for (let i = 0; i < cityJson.length; i++) {
    if (i === 0) {
      for (let j = 0; j < cityJson[i].prov.length; j++) {
        let name = cityJson[i].prov[j]
        let value = name
        if (selectType === 2) {
          value = name + index++
        }
        let params = {
          label: name,
          value: value
        }
        if (type === 2 || type === 3) {
          params.children = []
        }
        provAndCity.push(params)
      }
    } else {
      if (type !== 1) {
        for (let k in cityJson[i]) {
          if (k !== 'class1') {
            let key = parseInt(k.split('_')[1])
            let cityArr = []
            for (let m = 0; m < cityJson[i][k].length; m++) {
              let name = cityJson[i][k][m]
              let value = name
              if (selectType === 2) {
                value = name + index++
              }
              let params = {
                label: name,
                value: value
              }
              if (type === 3) {
                params.children = []
              }
              cityArr.push(params)
            }
            if (type === 3) {
              for (let n = 0; n < cityJson[i].class1.length; n++) {
                let zoneArr = []
                for (let s = 0; s < cityJson[i].class1[n].class2.length; s++) {
                  let name = cityJson[i].class1[n].class2[s]
                  let value = name
                  if (selectType === 2) {
                    value = name + index++
                  }
                  let params = {
                    label: name,
                    value: value
                  }
                  zoneArr.push(params)
                }
                cityArr[n].children = zoneArr
              }
            }
            provAndCity[key].children = cityArr
          }
        }
      }
    }
  }
  return provAndCity
}

function cityJsonTree () {
  return cityJson.selectProv
}
