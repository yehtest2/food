/**
 *
 */
class SearchView {
  //選擇元素
  _parentEl = document.querySelector('.search');
  /**選擇搜尋匡的值 */
  getQuery() {
    //選擇搜尋匡的值
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
  //清空資料
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  /**
   * 渲染搜尋事件
   */
  addHandlerSearch(handler) {
    //綁定事件
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //事件將執行渲染整個過程
      handler();
    });
  }
}

export default new SearchView();
