const GET_SYMBOLS = 'flowcharts/GET_SYMBOLS';
const ADD_SYMBOL = 'flowcharts/ADD_SYMBOL';
// const EDIT_SYMBOL = 'flowcharts/EDIT_SYMBOL';
// const DELETE_SYMBOL = 'flowcharts/DELETE_SYMBOL';

const getSymbols = (symbols) => ({
    type: GET_SYMBOLS,
    symbols: symbols.symbols
});

const addSymbol = symbol => ({
    type: ADD_SYMBOL,
    symbol
});


export const createSymbol = (payload, flowchartId) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${flowchartId}/symbols/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addSymbol(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

export const getSymbolsThunk = (flowchartId) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${flowchartId}/symbols/`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getSymbols(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

const symbolsReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_SYMBOL: {
            return { ...state, [action.symbol.id]: action.symbol };
        }
        case GET_SYMBOLS: {
            const symbols = action.symbols.reduce((obj, symbol) => {
                obj[symbol.id] = symbol;
                return obj
            }, {});
            return { ...symbols };
        }
        // case EDIT_FLOWCHART: {
        //     return { ...state, [action.flowchart.id]: action.flowchart };
        // }
        // case DELETE_FLOWCHART: {
        //     const { flowchartId } = action
        //     const newState = { ...state };
        //     delete newState[flowchartId];
        //     return newState;
        // }
        default:
            return state;
    }
}

export default symbolsReducer;
