const GET_ARROWS = 'arrows/GET_ARROWS';
const ADD_ARROW = 'arrows/ADD_ARROW';
// const EDIT_ARROW = 'arrows/EDIT_ARROW';
const DELETE_ARROW = 'arrows/DELETE_ARROW';
const RESET_ARROWS = 'symbols/RESET_ARROWS';


export const resetArrows = () => ({
    type: RESET_ARROWS
});

const getArrows = (arrows) => ({
    type: GET_ARROWS,
    arrows: arrows.arrows
});

const addArrow = arrow => ({
    type: ADD_ARROW,
    arrow
});

// const updateArrow = arrow => ({
//     type: EDIT_ARROW,
//     arrow
// });

const removeArrow = arrowId => ({
    type: DELETE_ARROW,
    arrowId
});


export const deleteArrow = (flowchartId, arrowId) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${flowchartId}/arrows/${arrowId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(removeArrow(arrowId));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}


// export const editArrow = (payload, flowchartId, symbolId, arrowId) => async dispatch => {
//     const res = await fetch(`/api/flowcharts/${flowchartId}/symbols/${symbolId}/arrows/${arrowId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//         const data = await res.json();
//         dispatch(updateArrow(data));
//         return data;
//     } else if (res.status < 500) {
//         const errorMessages = await res.json();
//         return errorMessages
//     } else {
//         return { server: "Something went wrong. Please try again" }
//     }
// }


export const createArrow = (payload, flowchartId) => async dispatch => {
    const res = await fetch(`/api/flowcharts/${flowchartId}/arrows/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addArrow(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

export const getArrowsThunk = (flowchartId) => async dispatch => {
    // const res = await fetch(`/api/flowcharts/${flowchartId}/symbols/${symbolId}/arrows/`);
    const res = await fetch(`/api/flowcharts/${flowchartId}/arrows/`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getArrows(data));
        return data;
    } else if (res.status < 500) {
        const errorMessages = await res.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
}

const arrowsReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_ARROW: {
            return { ...state, [action.arrow.id]: action.arrow };
        }
        case GET_ARROWS: {
            const arrows = action.arrows.reduce((obj, arrow) => {
                obj[arrow.id] = arrow;
                return obj
            }, {});
            return { ...arrows };
        }
        // case EDIT_ARROW: {
        //     return { ...state, [action.arrow.id]: action.arrow };
        // }
        case DELETE_ARROW: {
            const { arrowId } = action
            const newState = { ...state };
            delete newState[arrowId];
            return newState;
        }
        case RESET_ARROWS:
            return {};
        default:
            return state;
    }
}

export default arrowsReducer;
