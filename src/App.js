import React, { useEffect, useState } from 'react'

import './App.css';
import Editor from './components/Editor';
import Item from './components/Item';
import List from './components/List';
import Menu from './components/Menu';
import Panel from './components/Panel';
import Preview from './components/Preview';
import uuid from 'react-uuid';
import useDocumentTitle from './components/documentitle';
import ItemsContext from './components/items-context';
import { get, post, put } from './libs/http';
import StatusContext from './components/status-context'

const App = () => {
  const URL = 'http://localhost:3010/'
  const [items, setItems] = useState([]);
  const [copyItems, setCopyItems] = useState([]);
  const [actualIndex, setActualIndex] = useState(-1);

  const [lock, setLock] = useState(false);
  const [status, setStatus] = useState(0);

  useDocumentTitle(copyItems[actualIndex]?.title, 'Notes');

  useEffect(() => {
    getItems();

  }, [])
  async function getItems() {
    let data = await get(`${URL}`);
    let res = getOrderedNotes(data);

    setItems(res);
    setCopyItems(res);

    if (items.length > 0) setActualIndex(0);
  }

  const handleNew = async () => {
    const note = {
      id: uuid(),
      title: 'Add',
      text: 'add',
      pinned: false,
      created: Date.now()
    };

    let notes = [...items];

    notes.unshift(note);

    let res = getOrderedNotes(notes);

    setItems(res);
    setCopyItems(res);

    const data = await post(`${URL}new`, note)
  }
  const handlePinned = (item, i) => {
    setActualIndex(i);
    let id = item.id;
    let notes = [...items];
    notes[i].pinned = !notes[i].pinned;
    let res = getOrderedNotes(notes);
    setItems(res);
    setCopyItems(res);

    let index = res.findIndex(x => x.id === id);
    setActualIndex(index);
  }
  const getOrderedNotes = (arr) => {
    let items = [...arr];
    let pinned = items.filter(x => x.pinned === true);
    let rest = items.filter(x => x.pinned === false);

    pinned = sortByDate(pinned, true);
    rest = sortByDate(rest, true);

    return [...pinned, ...rest]
  }
  const sortByDate = (arr, asc = false) => {
    if (asc) return arr.sort((a, b) => new Date(b.created) - new Date(a.created));
    return arr.sort((a, b) => new Date(a.created) - new Date(b.created));

  }
  const handleSelectNote = (item, e) => {
    if (e.target.classList.contains('note')) return;
    const index = items.findIndex((note) => note === item);
    setActualIndex(index);
  }

  const onChangeTitle = (e) => {
    const title = e.target.value;
    let notes = [...items];
    notes[actualIndex].title = title;
    setItems(notes);
    setCopyItems(notes);
  }
  const onChangeText = (e) => {
    const text = e.target.value;
    let notes = [...items];
    notes[actualIndex].text = text;
    setItems(notes);
    setCopyItems(notes);
  }
  const autosave = () => {
    if (!lock) {
      setLock(true);
      setStatus(1);
      setTimeout(() => {
        save();
        setLock(false);
      }, 3000);
    }
  }

  async function save() {
    const item = items[actualIndex];
    const response = await put(`${URL}update`, item);
    setStatus(2);
    setTimeout(() => {
      setStatus(0);
    }, 1000);
  }


  const renderEditorandPreviewUI = () => {
    return (
      <>
        <StatusContext.Provider value={{ status: status, autosave: autosave }} >
          <Editor item={copyItems[actualIndex]} onChangeTitle={onChangeTitle} onChangeText={onChangeText} />
        </StatusContext.Provider>

        <Preview text={copyItems[actualIndex].text} />
      </>
    )
  }

  const handleSearch = (e) => {
    const q = e.target.value;
    if (q === '') {
      setCopyItems([...items]);
    } else {

      let res = items.filter(x => x.title.indexOf(q) >= 0 || x.text.indexOf(q) >= 0);
      if (res.length === 0) {
        setActualIndex(-1);
      } else {
        setCopyItems([...res]);
        setActualIndex(0);
      }

    }
  }
  return (
    <div className="App container" >
      <Panel>
        <ItemsContext.Provider value={{ onSearch: handleSearch, onNew: handleNew }}>
          <Menu />
        </ItemsContext.Provider>

        <List>
          {
            copyItems.map((item, i) => {
              return <Item key={item.id} actualIndex={actualIndex} item={item} index={i} onHandlePinned={handlePinned} onHandleSelectNote={handleSelectNote} />
            })
          }
        </List>
      </Panel>
      <>
        {
          (actualIndex >= 0) ? renderEditorandPreviewUI() : ''
        }

      </>
    </div >
  )
}

export default App
