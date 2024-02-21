import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getFlowchartsThunk } from '../../redux/flowcharts';
import { createFlowchart } from '../../redux/flowcharts';
import { deleteFlowchart } from '../../redux/flowcharts';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import GridTool from '../GridTool/GridTool';
import './MainPage.css';

const MainPage = () => {
    const user = useSelector((store) => store.session.user);
    const flowcharts = useSelector((store) => store.flowcharts);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [flowchart, setFlowchart] = useState({});
    const [selectedShape, setSelectedShape] = useState(null);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);
    const [title, setTitle] = useState('');

    useEffect(() => {
        dispatch(getFlowchartsThunk(user.id)).then(data => {
            if (!Object.keys(data.flowcharts).length) {
                dispatch(createFlowchart()).then(data => {
                    setIsLoaded(true);
                    setFlowchart(data);
                    setTitle(data.title);
                })
            }
            else {
                setIsLoaded(true);
                setFlowchart(data.flowcharts[0]);
                setTitle(data.flowcharts[0].title);
            }
        });
    }, [dispatch, user.id]);

    const handleSelectShape = shape => {
      setSelectedShape(shape);
    };

    const toggleRightPanel = () => {
        setRightPanelVisible(prevState => !prevState);
    };

    const handleDeleteFlowchart = (flowchartId) => {
        dispatch(deleteFlowchart(flowchartId)).then(() => {
            setTitle(flowchart.title);
        });
    };

    const handleCreateFlowchart = () => {
        dispatch(createFlowchart()).then(data => {
            setTitle(data.title);
        });
    }


    if (!isLoaded) return <h1>Loading...</h1>

    return (
        <div className="main-page">
            <LeftPanel
                onSelectShape={handleSelectShape}
                flowchart={flowchart}
                user={user}
                title={title}
                onCreate={handleCreateFlowchart}
            />
            <GridTool selectedShape={selectedShape} />
            <RightPanel
                isVisible={rightPanelVisible}
                onClose={toggleRightPanel}
                flowcharts={flowcharts}
                onDeleteFlowchart={handleDeleteFlowchart}
            />
        </div>
    );
  };

  export default MainPage;
