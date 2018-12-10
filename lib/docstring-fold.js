'use babel';

import { CompositeDisposable, Point, Range} from 'atom';

export default {
  subscriptions: null,
  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'docstring-fold:fold-current-docstring': () => this.fold()
    }));
    // this.subscriptions.add(atom.commands.add('atom-text-editor', {
    //   'docstring-fold:fold-all-docstrings': () => this.foldAll()
    // }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  fold() {
    const editor = atom.workspace.getActiveTextEditor();
    const cursorPosition = editor.getCursorBufferPosition();
    const backwardRange = [0, cursorPosition];
    const docstring_regex = new RegExp(/("""|''')/g);
    let foundStart = null;
    editor.backwardsScanInBufferRange(docstring_regex, backwardRange, match => {
      foundStart = match.range;
      return match.stop();
    });

    // now look for the end
    const numberOfLines = editor.getLineCount();
    const forwardRange = [foundStart.end, new Point(numberOfLines + 1, 0)];
    let foundEnd = null;
    editor.scanInBufferRange(docstring_regex, forwardRange, match => {
      foundEnd = match.range;
      return match.stop();
    });

    editor.setSelectedBufferRange([foundStart.start, foundEnd.end]);
    var selection = editor.selections[0];
    selection.fold();
  },

  foldAll() {
    console.log("Not yet implemented");
  }
};
