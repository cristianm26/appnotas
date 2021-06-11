import { useEffect } from 'react'

const useDocumentTitle = (text, defaultValue) => {
    useEffect(() => {
        document.title = (!text) ? defaultValue : text;
    })
}

export default useDocumentTitle
