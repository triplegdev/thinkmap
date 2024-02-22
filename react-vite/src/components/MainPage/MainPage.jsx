import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getFlowchartsThunk } from '../../redux/flowcharts';
import { createFlowchart } from '../../redux/flowcharts';
import { deleteFlowchart } from '../../redux/flowcharts';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import GridTool from '../GridTool/GridTool';
import { getSymbolsThunk } from '../../redux/symbols';
import './MainPage.css';


const MainPage = () => {
    const user = useSelector((store) => store.session.user);
    const flowcharts = useSelector((store) => store.flowcharts);
    const symbols = useSelector(store => store.symbols);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [flowchart, setFlowchart] = useState({});
    const [selectedShape, setSelectedShape] = useState(null);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);
    // const [title, setTitle] = useState('');

    useEffect(() => {
        dispatch(getFlowchartsThunk(user.id)).then(data => {
            if (!Object.keys(data.flowcharts).length) {
                dispatch(createFlowchart()).then(data => {
                    setIsLoaded(true);
                    setFlowchart(data);
                    // setTitle(data.title);
                })
            }
            else {
                setFlowchart(data.flowcharts[0]);
                // setTitle(data.flowcharts[0].title);
                dispatch(getSymbolsThunk(data.flowcharts[0].id)).then(() => {
                    setIsLoaded(true);
                });
            }
        });
    }, [dispatch, user.id]);


    const handleSelectShape = shape => {
      setSelectedShape(shape);
    };

    const handleSelectFlowchart = (selectedFlowchart) => {
        // console.log(selectedFlowchart)
        // console.log(selectedFlowchart.title, 'clicked')
        setFlowchart(selectedFlowchart);
        dispatch(getSymbolsThunk(selectedFlowchart.id));
    }

    const toggleRightPanel = () => {
        setRightPanelVisible(prevState => !prevState);
    };

    const handleDeleteFlowchart = (flowchartId) => {
        dispatch(deleteFlowchart(flowchartId)).then(() => {
            // setTitle(flowchart.title);
            const lastUpadatedFlowchart = Object.values(flowcharts)[0];
            console.log(lastUpadatedFlowchart)
            setFlowchart(lastUpadatedFlowchart);
            dispatch(getSymbolsThunk(lastUpadatedFlowchart.id));
        });
    };

    const handleCreateFlowchart = () => {
        dispatch(createFlowchart()).then(data => {
            // setTitle(data.title);
            setFlowchart(data)
            dispatch(getSymbolsThunk(data.id));
        });
    }


    if (!isLoaded) return <h1>Loading...</h1>

    return (
        <div className="main-page">
            <LeftPanel
                onSelectShape={handleSelectShape}
                flowchart={flowchart}
                user={user}
                // title={title}
                onCreate={handleCreateFlowchart}
            />
            <GridTool selectedShape={selectedShape} symbols={symbols} />
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
