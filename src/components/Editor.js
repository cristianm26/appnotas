import React, { useContext } from 'react'
import Status from './Status';
import StatusContext from './status-context';
const Editor = ({ item, onChangeTitle, onChangeText }) => {
    const statusContext = useContext(StatusContext);
    const handleTitleChange = (e) => {
        onChangeTitle(e);
        statusContext.autosave();
    }
    const handleTextChange = (e) => {
        onChangeText(e);
        statusContext.autosave();
    }
    return (
        <div className="editor">
            <Status statusCode={statusContext.status} />
            <div>
                <input className="title" value={item.title} onChange={handleTitleChange} />
            </div>
            <div className="editor-textarea">
                <textarea className="content" value={item.text} onChange={handleTextChange} ></textarea>
            </div>
        </div>
    )
}

export default Editor
