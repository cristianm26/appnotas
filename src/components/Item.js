import React from 'react'

const Item = ({ item, onHandlePinned, onHandleSelectNote, index, actualIndex }) => {
    const handlePinned = (item, index) => {
        onHandlePinned(item, index);
    }
    const handleSelectNote = (item, e) => {
        onHandleSelectNote(item, e);
    }
    return (
        <div key={item.id}
            className={(index === actualIndex) ? 'note activeNote' : 'note'}
            onClick={(e) => handleSelectNote(item, e)} >
            <div>
                {item.title === '' ? '[Sin Titulo]' : item.title.substring(0, 20)}
            </div>
            <div>
                <button className="pinButton" onClick={() => handlePinned(item, index)} >
                    {item.pinned ? 'Pinned' : 'Pin'}
                </button>
            </div>
        </div>
    )
}

export default Item
