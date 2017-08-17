import React from 'react';
import MonacoEditor from 'react-monaco-editor';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEditor: null
    }
  }
  editorDidMount(editor, monaco) {
    this.setState({activeEditor: monaco.editor})
  }

  onChange(newValue, e) {
    this.props.onChange(newValue);
  }

  render() {
    const requireConfig = {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        'vs': 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs/'
      }
    };

    let options = {
      selectOnLineNumbers: true,
      theme: this.props.editorTheme || 'vs-dark',
      lineNumbersMinChars: 5,
      ...this.props.editorOptions
    };
    if(this.state.activeEditor){
      this.state.activeEditor.setTheme(this.props.editorTheme)
    }
    return (
      <MonacoEditor
        width="100%"
        height={this.props.height || "600"}
        language="javascript"
        value={this.props.code}
        options={options}
        onChange={this.props.onChange}
        editorDidMount={(editor, monaco)=>this.editorDidMount(editor, monaco)}
        requireConfig={requireConfig}
      />
    );
  }
}

export default Editor;