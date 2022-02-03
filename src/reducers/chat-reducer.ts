import {api} from "../dal/api";

const initialState = {
    messages: [],
    typingUsers: []
}

export const chatReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case 'messages-received': {
            return {...state, messages: action.messages}
        }
        case 'new-message-received': {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter((u: any) => u.id !== action.message.user.id) //убираем раз сообщение отправил
            }
        }
        case 'add-typing-user': {
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter((u: any) => u.id !== action.user.id)
                    , action.user]
            }
        }
        default: {
            return state
        }
    }
}

const messagesReceived = (messages: any) => ({
    type: 'messages-received',
    messages
});
const newMessagesReceived = (message: any) => ({
    type: 'new-message-received',
    message
});

const addTypingUser = (user: any) => ({
    type: 'add-typing-user',
    user,
});


export const createConnection = () => (dispatch: any) => {
    api.createConnection();
    api.subscribe((messages: any, fnBack: () => void) => {
            fnBack(); //вызываем функцию с бэка
            dispatch(messagesReceived(messages))
        }, (message: any) => {
            dispatch(newMessagesReceived(message))
        }, (user: any) => {
            dispatch(addTypingUser(user))
        },
    )
}

export const setClientName = (name: string) => (dispatch: any) => {
    api.sendName(name);
}
export const setNewMessage = (message: string) => (dispatch: any) => {
    api.sendMessage(message);
}

export const destroyConnection = () => (dispatch: any) => {
    api.destroyConnection();
}

export const typeMessage = () => (dispatch: any) => {
    api.typingMessage();
}