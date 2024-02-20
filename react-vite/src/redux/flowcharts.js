const NEW_FLOWCHART = 'flowcharts/NEW_FLOWCHART';
const GET_USER_FLOWCHARTS = 'flowcharts/GET_USER_FLOWCHARTS';

const newFlowchart = (flowchart) => ({
    type: NEW_FLOWCHART,
    flowchart: flowchart.flowchart
});

const getFlowcharts = (flowcharts) => ({
    type: GET_USER_FLOWCHARTS,
    flowcharts: flowcharts.flowcharts
});

export const createFlowchart = () => async dispatch => {
    const res = await fetch("/api/flowcharts/", {
        method: "POST"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(newFlowchart(data));
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
        case NEW_FLOWCHART: {
            return { ...state, [action.flowchart.id]: action.flowchart }
        }
        case GET_USER_FLOWCHARTS: {
            const flowcharts = action.flowcharts.reduce((obj, flowchart) => {
                obj[flowchart.id] = flowchart;
                return obj
            }, {});
            return { ...flowcharts }
        }
        default:
            return state;
    }
}

export default flowchartsReducer;
