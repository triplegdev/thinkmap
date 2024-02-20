import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getFlowchartsThunk } from '../../redux/flowcharts';
import { createFlowchart } from '../../redux/flowcharts';
import LeftPanel from '../LeftPanel/LeftPanel';
import Grid from '../Grid/Grid';

const MainPage = () => {
    const user = useSelector((store) => store.session.user);
    // const flowcharts = useSelector((store) => store.flowcharts)
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [flowchart, setFlowchart] = useState({});
    const [selectedShape, setSelectedShape] = useState(null);

    useEffect(() => {
        dispatch(getFlowchartsThunk(user.id)).then(data => {
            if (!Object.keys(data.flowcharts).length) {
                dispatch(createFlowchart()).then(data => {
                    setIsLoaded(true);
                    setFlowchart(data);
                })
            }
            else {
                setIsLoaded(true);
                setFlowchart(data.flowcharts[0]);
            }
        });
    }, [dispatch, user.id]);

    const handleSelectShape = (shape) => {
      setSelectedShape(shape);
    };

    if (!isLoaded) return <h1>Loading...</h1>

    return (
        <div>
            <Grid selectedShape={selectedShape} />
            <LeftPanel
                onSelectShape={handleSelectShape}
                flowchartTitle={flowchart.title}
                user={user}
            />
        </div>
    );
  };

  export default MainPage;
