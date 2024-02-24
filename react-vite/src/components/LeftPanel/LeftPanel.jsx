import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Link } from 'react-router-dom';
import { thunkLogout } from "../../redux/session";
// import { editFlowchart } from "../../redux/flowcharts";
import './LeftPanel.css';


const LeftPanel = ({ title, user, onCreateFlowchart, onEditFlowchart, onCreateSymbol }) => {
    const dispatch = useDispatch();
    const [localTitle, setLocalTitle] = useState(title);

    useEffect(() => {
        setLocalTitle(title);
    }, [title]);

    const handleSubmit = e => {
        e.preventDefault();

        const payload = { title: localTitle }

        onEditFlowchart(payload);
    }

    const createSymbolClick = type => {
        const symbol = {
            x_position: window.innerWidth / 2,
            y_position: window.innerHeight / 2,
            type,
            text: ''
        }
        onCreateSymbol(symbol);
    };

    const logout = (e) => {
        e.preventDefault();
        dispatch(thunkLogout());
    };

    return (
        <div id="leftpanel">
            <div className="leftpanel__form-symbols">
                <div className="form__title-create">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={localTitle}
                            onChange={e => setLocalTitle(e.target.value)}
                        />
                    </form>
                    <button id="form__create" onClick={onCreateFlowchart}>+</button>
                </div>
                <div className="leftpanel__symbol-buttons">
                    <button onClick={() => createSymbolClick('Terminal')}>Terminal</button>
                    <button onClick={() => createSymbolClick('Decision')}>Decision</button>
                    <button onClick={() => createSymbolClick('Process')}>Process</button>
                    <button onClick={() => createSymbolClick('Data')}>Data</button>
                </div>
            </div>
            <div className="leftpanel__user-logout">
                <div className="leftpanel__img-user">
                    <img id="leftpanel__img" src={user.avatar} alt="" />
                    <h2 id="leftpanel__user">{user.username}</h2>
                </div>
                {/* <Link to="/account">My Account</Link> */}
                <button onClick={logout}>Logout</button>
            </div>


        </div>
    );
};

export default LeftPanel;
