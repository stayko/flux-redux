import { createStore, combineReducers } from 'redux';

//actions
export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';

//default state
const defaultState = {
  messages: [{
    date: new Date('2016-10-10 10:11:55'),
    postedBy: 'Stan',
    content: 'I love the new productivity app!'
  },
  {
    date: new Date('2016-8-5 13:13:45'),
    postedBy: 'Jerry',
    content: 'Some other message!'
  },
  {
    date: new Date('2016-11-9 1:43:33'),
    postedBy: 'Jenny',
    content: 'I love my life!'
  }
],
  userStatus: ONLINE
}

//reducers
const userStatusReducer = (state=defaultState.userStatus, {type,value})=>{
  switch(type){
    case UPDATE_STATUS:
      return value;
      break;
  }
  return state;
}

const messageReducer = (state = defaultState.messages, {type,value,postedBy,date}) => {
  switch(type){
    case CREATE_NEW_MESSAGE:
      const newState = [{date, postedBy, content:value}, ...state];
      return newState;
  }
  return state;
}

const combinedReducer = combineReducers({
  userStatus : userStatusReducer,
  messages : messageReducer
});

const store = createStore(combinedReducer);


//render
const render = ()=>{
  const {messages, userStatus} = store.getState();
  document.getElementById("messages").innerHTML = messages
    .sort((a,b)=>b.date - a.date)
    .map(message=>(`
      <div>
        ${message.postedBy} : ${message.content}
      </div>
    `)).join("");

  document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
  document.forms.newMessage.newMessage.value = "";
}

//action creators
const statusUpdateAction = (value)=>{
  return {
    type: UPDATE_STATUS,
    value
  }
}

const newMessageAction = (content, postedBy)=>{
  const date = new Date();
  return {
    type: CREATE_NEW_MESSAGE,
    value: content,
    postedBy,
    date
  }
}

//event listeners
document.forms.newMessage.addEventListener("submit", (e)=>{
  e.preventDefault();
  const value = e.target.newMessage.value;
  const username = localStorage['preferences'] ? JSON.parse(localStorage[`preferences`]).userName : "Jim";
  store.dispatch(newMessageAction(value, username));
});

document.forms.selectStatus.status.addEventListener("change", (e)=>{
  store.dispatch(statusUpdateAction(e.target.value));
});


render();
store.subscribe(render);
