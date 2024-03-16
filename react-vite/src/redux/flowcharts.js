const ADD_FLOWCHART = 'flowcharts/ADD_FLOWCHART';
const GET_USER_FLOWCHARTS = 'flowcharts/GET_USER_FLOWCHARTS';
const EDIT_FLOWCHART = 'flowcharts/EDIT_FLOWCHART';
const DELETE_FLOWCHART = 'flowchart/DELETE_FLOWCHART';
const RESET_FLOWCHART = 'flowchart/RESET_FLOWCHART';


export const resetFlowcharts = () => ({
    type: RESET_FLOWCHART
});

const addFlowchart = (flowchart) => ({
    type: ADD_FLOWCHART,
    flowchart
});

const getFlowcharts = (flowcharts) => ({
    type: GET_USER_FLOWCHARTS,
    flowcharts: flowcharts.flowcharts
});

const updateFlowchart = (flowchart) => ({
    type: EDIT_FLOWCHART,
    flowchart
});

const removeFlowchart = (flowchartId) => ({
    type: DELETE_FLOWCHART,
    flowchartId
});


export const deleteFlowchart = (id) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(removeFlowchart(id));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}


export const editFlowchart = (payload, id) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateFlowchart(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

export const createFlowchart = () => async dispatch => {
    const res = await fetch("/api/flowcharts/", {
        method: "POST"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addFlowchart(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

export const getFlowchartsThunk = (userId) => async dispatch => {
    const res = await fetch(`/api/users/${userId}/flowcharts`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getFlowcharts(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}



const flowchartsReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_FLOWCHART: {
            return { ...state, [action.flowchart.id]: action.flowchart };
        }
        case GET_USER_FLOWCHARTS: {
            const flowcharts = action.flowcharts.reduce((obj, flowchart) => {
                obj[flowchart.id] = flowchart;
                return obj
            }, {});
            return { ...flowcharts };
        }
        case EDIT_FLOWCHART: {
            return { ...state, [action.flowchart.id]: action.flowchart };
        }
        case DELETE_FLOWCHART: {
            const { flowchartId } = action
            const newState = { ...state };
            delete newState[flowchartId];
            return newState;
        }
        case RESET_FLOWCHART:
            return {};
        default:
            return state;
    }
}

export default flowchartsReducer;
