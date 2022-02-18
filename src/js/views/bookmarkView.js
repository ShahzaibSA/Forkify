import { View } from './View';
import previewView from './previewView';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  // _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it 🙂';

  addHandlerRender(handler) {
    window.addEventListener('load', () => handler());
  }

  _generateHtml() {
    return previewView._generateHtml(this._data);
  }
}

export default new BookmarkView();
