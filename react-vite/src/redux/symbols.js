const GET_SYMBOLS = 'flowcharts/GET_SYMBOLS';

const getSymbols = (symbols) => ({
    type: GET_SYMBOLS,
    symbols: symbols.symbols
});

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
        // case ADD_FLOWCHART: {
        //     return { ...state, [action.flowchart.id]: action.flowchart };
        // }
        case GET_SYMBOLS: {
            console.log(action.symbols)
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
