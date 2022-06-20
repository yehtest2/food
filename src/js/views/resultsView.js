import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';
  //委託渲染  先委託pre 因為直接回傳到這 在join 最後在渲染出去

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join();
  }
}

export default new ResultsView();
