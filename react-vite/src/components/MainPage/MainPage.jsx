import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getFlowchartsThunk, createFlowchart, editFlowchart, deleteFlowchart } from '../../redux/flowcharts';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import GridTool from '../GridTool/GridTool';
import { deleteSymbol, getSymbolsThunk, createSymbol, editSymbol } from '../../redux/symbols';
import './MainPage.css';


const MainPage = () => {
    const user = useSelector((store) => store.session.user);
    const flowcharts = useSelector((store) => store.flowcharts);
    const symbols = useSelector(store => store.symbols);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [flowchart, setFlowchart] = useState({});
    const [title, setTitle] = useState('');
    // const [symbol, setSymbol] = useState({});
    // const [selectedShape, setSelectedShape] = useState(null);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);

    useEffect(() => {
        dispatch(getFlowchartsThunk(user.id)).then(data => {
            if (!Object.keys(data.flowcharts).length) {
                dispatch(createFlowchart()).then(data => {
                    setFlowchart(data);
                    setTitle(data.title);
                    setIsLoaded(true);
                })
            }
            else {
                setFlowchart(data.flowcharts[0]);
                dispatch(getSymbolsThunk(data.flowcharts[0].id)).then(() => {
                    setTitle(data.flowcharts[0].title);
                    setIsLoaded(true);
                });
            }
        });
    }, [dispatch, user.id]);

    const handleCreateSymbol = symbol => {
      dispatch(createSymbol(symbol, flowchart.id))
    };

    const handleEditSymbol = (payload, symbolId) => {
        dispatch(editSymbol(payload, flowchart.id, symbolId));
    }

    const handleDeleteSymbol = (symbolId) => {
        dispatch(deleteSymbol(flowchart.id, symbolId));
    }

    const handleSelectFlowchart = (selectedFlowchart) => {
        setFlowchart(selectedFlowchart);
        setTitle(selectedFlowchart.title)
        dispatch(getSymbolsThunk(selectedFlowchart.id));
    }

    const toggleRightPanel = () => {
        setRightPanelVisible(prevState => !prevState);
    };

    const handleDeleteFlowchart = (flowchartId) => {
        dispatch(deleteFlowchart(flowchartId)).then(() => {
            const lastUpadatedFlowchart = Object.values(flowcharts)[0];
            // console.log(lastUpadatedFlowchart)
            setFlowchart(lastUpadatedFlowchart);
            setTitle(lastUpadatedFlowchart.title);
            dispatch(getSymbolsThunk(lastUpadatedFlowchart.id));
        });
    };

    const handleCreateFlowchart = () => {
        dispatch(createFlowchart()).then(data => {
            setFlowchart(data);
            setTitle(data.title)
            dispatch(getSymbolsThunk(data.id));
        });
    }

    const handleEditFlowchart = (payload) => {
        dispatch(editFlowchart(payload, flowchart.id)).then(data => {
            setTitle(data.title);
        });
    }


    if (!isLoaded) return <h1>Loading...</h1>

    return (
        <div className="main-page">
            <LeftPanel
                flowchart={flowchart}
                title={title}
                user={user}
                onCreateFlowchart={handleCreateFlowchart}
                onEditFlowchart={handleEditFlowchart}
                onCreateSymbol={handleCreateSymbol}
            />
            <GridTool
                onEditSymbol={handleEditSymbol}
                onDeleteSymbol={handleDeleteSymbol}
                symbols={symbols}
            />
            <RightPanel
                isVisible={rightPanelVisible}
                onClose={toggleRightPanel}
                flowcharts={flowcharts}
                onDeleteFlowchart={handleDeleteFlowchart}
                onSelectFlowchart={handleSelectFlowchart}
            />
        </div>
    );
  };

  export default MainPage;
