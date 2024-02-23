const GET_SYMBOLS = 'symbol/GET_SYMBOLS';
const ADD_SYMBOL = 'symbol/ADD_SYMBOL';
const EDIT_SYMBOL = 'symbol/EDIT_SYMBOL';
const DELETE_SYMBOL = 'flowcharts/DELETE_SYMBOL';

const getSymbols = (symbols) => ({
    type: GET_SYMBOLS,
    symbols: symbols.symbols
});

const addSymbol = symbol => ({
    type: ADD_SYMBOL,
    symbol
});

const updateSymbol = symbol => ({
    type: EDIT_SYMBOL,
    symbol
});

const removeSymbol = symbolId => ({
    type: DELETE_SYMBOL,
    symbolId
});


export const deleteSymbol = (flowchartId, symbolId) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${flowchartId}/symbols/${symbolId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(removeSymbol(symbolId));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}


export const editSymbol = (payload, flowchartId, symbolId) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${flowchartId}/symbols/${symbolId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateSymbol(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}


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
        case EDIT_SYMBOL: {
            return { ...state, [action.symbol.id]: action.symbol };
        }
        case DELETE_SYMBOL: {
            const { symbolId } = action
            const newState = { ...state };
            delete newState[symbolId];
            return newState;
        }
        default:
            return state;
    }
}

export default symbolsReducer;
