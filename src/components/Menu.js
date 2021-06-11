import React, { useContext } from 'react'
import ItemsContext from './items-context'

const Menu = () => {
    const itemsContext = useContext(ItemsContext)
    const handleClick = () => {
        itemsContext.onNew();
    }

    const handleChange = (e) => {
        /* onSearch(e); */
        itemsContext.onSearch(e);
    }
    return (
        <div className="menu">
            <input className="search" placeholder="Buscar" onChange={handleChange} />
            <button className="btn" onClick={(e) => handleClick()} >Nueva Nota</button>
        </div>
    )
}

export default Menu
