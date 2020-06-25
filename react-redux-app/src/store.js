import {createStore} from 'redux';

export default createStore(function(state, action){
    if(state === undefined){
        return {
            number:0
        }
    }

    if(action.type === 'INCREMENT'){
        var newNumber = state.number + action.size;
        console.log(newNumber);
        return {number:newNumber}
    }

    return state;

}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());