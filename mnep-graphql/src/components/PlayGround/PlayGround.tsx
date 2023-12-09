import { JSX, useId, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import styles from './PlayGround.module.scss';
import { graphql } from 'cm6-graphql';
import { EditorView } from '@codemirror/view';
import { langs } from '@uiw/codemirror-extensions-langs';
import { format } from '../../utils/formatGraphQL';


const PlayGround = (): JSX.Element => {
  const inputId = useId();
  const [graphRequest, setGraphRequest] = useState('');
  const [variablesRequest, setVariablesRequest] = useState('');
  const [jsonResponse, setJsonResponse] = useState('');
  const [uri, setUri] = useState('https://rickandmortyapi.com/graphql');

  const handleRequest = async () => {
    setJsonResponse('');
    const address = uri || 'https://rickandmortyapi.com/graphql';
    const body = JSON.stringify({query: graphRequest, variables: JSON.parse(variablesRequest)}).replace(/\\n/g, '').replace(/\s+/g, ' ')
    console.log(body)

    const response = await fetch(address, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body
    })
    const data = await response.json();
    setJsonResponse(JSON.stringify(data, null, 2));
  };

  const handlePrettify = () => {
    setVariablesRequest(prevState => JSON.stringify(JSON.parse(prevState), null, 2))
    setGraphRequest(prevState => format(prevState))
    setJsonResponse(prevState => JSON.stringify(JSON.parse(prevState), null, 2))
  }

  const disableFormat = () => {
    setGraphRequest(prevState => prevState.replace(/\\n/g, '').replace(/\s+/g, ' '))
    setVariablesRequest(prevState => prevState.replace(/\\n/g, '').replace(/\s+/g, ' '))
    setJsonResponse(prevState => prevState.replace(/\\n/g, '').replace(/\s+/g, ' '))
  }

  return (
    <div className={styles.playground}>

      <div className={styles.playground__actions}>
        <button onClick={handleRequest}>Request</button>
        <button onClick={handlePrettify}>Prettify</button>
        <button onClick={disableFormat}>disable format</button>
        <label htmlFor={inputId}>URI for GraphQL</label> <input className={styles.playground__url}
                                                                id={inputId}
                                                                type="text"
                                                                value={uri}
                                                                onChange={(e) => setUri(e.target.value)}/>
      </div>

      <div className={styles.playground__body}>

        <div className={styles.playground__request}>
          <div className={styles.playground__graph}>
            <h2>GraphQL</h2>
            <CodeMirror className={styles.playground__cm}
                        theme={'dark'}
                        value={graphRequest}
                        height="100%"
                        onChange={(value) => {
                          setGraphRequest(value);
                        }}
                        extensions={[graphql(), EditorView.lineWrapping]}/>
          </div>
          <div className={styles.playground__var}>
            <h2>Variables</h2>
            <CodeMirror className={styles.playground__cm}
                        value={variablesRequest}
                        height="100%"
                        onChange={(value) => {
                          setVariablesRequest(value);
                        }}
                        extensions={[langs.json(), EditorView.lineWrapping]}
                        theme={'dark'}/>
          </div>
        </div>

        <div className={styles.playground__response}>
          <h2>Response</h2>
          <CodeMirror className={styles.playground__cm}
                      theme={'dark'}
                      height="auto"
                      maxHeight="calc(100vh - 15.3rem)"
                      value={jsonResponse}
                      extensions={[langs.json(), EditorView.lineWrapping]}
                      readOnly/>
        </div>
      </div>
    </div>
  );
};
export default PlayGround;
