import previewView from './previewView.js';
import { View } from './View.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query. Please try again.';

  _generateHtml() {
    return previewView._generateHtml(this._data);
  }
}

export default new ResultView();
