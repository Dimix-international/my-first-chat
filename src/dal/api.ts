import {io, Socket} from "socket.io-client";

//export const socket = io("http://localhost:4009");//подключаемся к серверу
const socket = io("https://chat-samurai.herokuapp.com/");//подключаемся к серверу

/*socket.on('init-messages-published', (messages: any) => {
    setMessages(messages)
})
socket.on('new-message-sent', (message: any) => {
    setMessages((messages) => [...messages, message])
})*/

export const api = {
    socket: null as null | Socket,

    createConnection() {
        this.socket = io("https://chat-samurai.herokuapp.com/");
    },
    //методы принимающий коллбэки
    subscribe(
        initMessagesHandler: (messages: any, fnBack:() => void) => void,
        newMessageHandler: (message: any) => void,
        userTypingHandler: (user: any) => void,
    ) {
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessageHandler)
        this.socket?.on('user-typing', userTypingHandler)
    },
    destroyConnection() {
        this.socket?.disconnect();
        this.socket = null;
    },
    sendName(name: string) {
        this.socket?.emit('client-name-sent', //наменование (сам придумал)
            name,
            //функция в которой придет ответ с сервера (error например)
            (error: string | null) => {
                error && alert(error)
            }
        );
    },
    sendMessage(message: string) {
        this.socket?.emit(
            'client-message-sent', //наменование (сам придумал)
            message,
            //функция в которой придет ответ с сервера (error например)
            (error: string | null) => {
                error && alert(error)
            }
        );
    },
    typingMessage() {
        this.socket?.emit(
            'client-typing-message'
        )
    }
}