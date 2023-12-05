import { graphql } from 'cm6-graphql';
import CodeMirror from '@uiw/react-codemirror';
import './App.css';
import styles from './styles/Code.module.scss';
import React, { useCallback, useState } from 'react';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

function App() {
  const [value, setValue] = useState('console.log(\'hello world!\');');
  const onChange = useCallback((val, viewUpdate) => {
    console.log(viewUpdate);
    setValue(val);
  }, []);

  const [codeWidth, setCodeWidth] = useState(40)
  const [codeHeight, setCodeHeight] = useState(60);

  const handleMouseDown = (e:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!(e.nativeEvent.target instanceof HTMLElement)) return
    if (
      e.nativeEvent.offsetX < 5 &&
      e.nativeEvent.target.className === styles.code__border
    ) {
      const m_pos = e.nativeEvent.x;
      document.addEventListener("mousemove", resize, false);
    }
  }


  return (<div className={styles.code}>
    <CodeMirror value={value}
                height={`${codeHeight}vh`}
                width={`${codeWidth}vw`}
                theme={vscodeDark}
                extensions={[graphql()]}
                onChange={onChange}/>
    <div className={styles.code__border} onMouseDown={handleMouseDown} />
  </div>);
}

export default App;
