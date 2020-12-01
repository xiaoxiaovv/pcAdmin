const getters = {
  isReload: state => state.user.isReload,
  isClosed: state => state.app.isClosed,
  visitedViews: state => state.tagsView.visitedViews,
  powerObj: state => state.menuList.powerObj
}

export default getters
