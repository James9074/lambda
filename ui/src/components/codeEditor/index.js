import React from 'react';
import MonacoEditor from 'react-monaco-editor'; //eslint-disable-line

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEditor: null,
      codeEditor: null,
      outputEditor: null
    }
  }

  editorDidMount(editor, monaco) {
    this.setState({ monaco, activeEditor: editor, activeModel: editor.getModel() })
    if (!window.editors)
      window.editors = []
    if (!window.monacos)
      window.monacos = []
    window.editors.push(editor)
    window.monacos.push(monaco)
  }

  onDidCreateEditor(editor) {
    console.log('NEW EDITOPR', editor, this);
  }

  onChange(newValue) {
    this.props.onChange(newValue);
  }

  componentWillReceiveProps(newProps){
    if (newProps.edit !== undefined){
      // window.editors[0] should be the code editor. This is a major hack and should be fixed.
      window.editors[0].updateOptions({ readOnly: !newProps.edit })
    }
  }

  render() {
    const requireConfig = {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        vs: 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs/'
      }
    };

    let options = {
      selectOnLineNumbers: true,
      theme: this.props.editorTheme || 'vs-dark',
      lineNumbersMinChars: 5,
      ...this.props.editorOptions
    };
    if (this.state.activeEditor){
      // this.state.monaco.editor.setModelLanguage(this.state.activeEditor, 'java')
      if (this.state.activeEditor._themeService._theme.id !== this.props.editorTheme){
        this.state.monaco.editor.setTheme(this.props.editorTheme)
      }
      if (this.props.language && this.state.activeEditor.model._languageIdentifier.language !== this.props.language){
        this.state.monaco.editor.setModelLanguage(this.state.activeEditor.model, this.props.language)
      }
    }
    // console.log(1)
    return (
      <MonacoEditor
        width="100%"
        height={this.props.height || '600'}
        language="javascript"
        value={this.props.code}
        options={options}
        onChange={this.props.onChange}
        editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)}
        requireConfig={requireConfig}
      />
    );
  }
}

export default Editor;
