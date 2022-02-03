import React, {UIEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {
    createConnection,
    destroyConnection,
    setClientName,
    setNewMessage, typeMessage
} from "./reducers/chat-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./index";


function App() {

    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    const messages = useSelector((state: AppStateType) => state.chat.messages);
    const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers);
    const dispatch = useDispatch();

    const messagesAnchorRef = useRef<HTMLDivElement | null>(null);
    const isAutoScrollActive = useRef(true);
    const lastScrollTop = useRef(0);

    const autoScrollHandler = (e: UIEvent<HTMLDivElement>) => {
        let element = e.currentTarget;
        let maxScrollPosition = element.scrollHeight - element.clientHeight;

        //если пользователь поднял скрол, то автоскрол включим только когда он докрутил сколл до самого низа - 5px
        isAutoScrollActive.current = element.scrollTop > lastScrollTop.current &&
            Math.abs(maxScrollPosition - element.scrollTop) < 5;

        lastScrollTop.current = e.currentTarget.scrollTop;
    }

    useEffect(() => {
        //если произойдет событие 'init-messages-published', сработает callback
        /*socket.on('init-messages-published', (messages: any) => {
            setMessages(messages)
        })
        socket.on('new-message-sent', (message: any) => {
            setMessages((messages) => [...messages, message])
        })*/
        dispatch(createConnection());

        //зачищаем когда компонента умирает
        return () => {
            dispatch(destroyConnection);
        }
    }, [dispatch])

    //опускаем автоматически скролл когда приходит новое собщение
    useEffect(() => {
        if (isAutoScrollActive.current) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [messages])


    return (
        <div className="App">
            <div style={{
                border: '1px solid black',
                padding: '10px',
                height: '300px',
                overflowY: 'auto',
                width: '300px',
            }}
                 onScroll={autoScrollHandler}>
                <div>{
                    messages.map((m: any) => (
                        <div key={Math.random()} style={{
                            borderBottom: '1px solid black',
                        }}>
                            <b>{m.user.name}:</b>
                            <span style={{marginLeft:'5px'}}>{m.message}</span>
                        </div>
                    ))
                }
                    {
                        typingUsers.map((u: any) => (
                            <div key={Math.random()} style={{
                                fontStyle:'italic',
                            }}>
                                <b>{u.name}:</b>
                                <span style={{marginLeft:'5px'}}>печатает...</span>
                            </div>
                        ))
                    }
                </div>
                <div ref={messagesAnchorRef}></div>
            </div>
            <input
                style={{
                    width: '310px',
                    marginTop: '15px',
                    fontSize: '18px',
                    padding: '5px',
                }}
                placeholder={'your name'}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
            />
            <button style={{
                width: '322px',
                padding: 0,
                margin: 0,
                marginTop: '15px',
                height: '40px',
                cursor: name && 'pointer'
            }}
                    disabled={!name}
                    onClick={() => {
                        //опубликуем событие
                        /*socket.emit(
                            'client-name-sent', //наменование (сам придумал)
                            name
                        );*/
                        dispatch(setClientName(name))
                    }}>Save name
            </button>
            <textarea style={{
                width: '310px',
                margin: 0,
                marginTop: '15px',
                fontSize: '18px',
                padding: '5px',
                minHeight: '100px'
            }}
                      value={message}
                      placeholder={'your messages'}
                      onKeyPress={() => {
                          dispatch(typeMessage())
                      }}
                      onChange={(e) => setMessage(e.currentTarget.value)}
            >
            </textarea>
            <button style={{
                width: '322px',
                padding: 0,
                margin: 0,
                marginTop: '15px',
                height: '40px',
                cursor: name && 'pointer'
            }}
                    disabled={!name}
                    onClick={() => {
                        //опубликуем событие
                        /*socket.emit(
                            'client-message-sent', //наменование (сам придумал)
                            message
                        );*/
                        dispatch(setNewMessage(message))
                        setMessage('');
                    }}>Send
            </button>
        </div>
    );
}

export default App;
