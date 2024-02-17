import { useState } from 'react';

const MainPage = () => {
    const [selectedShape, setSelectedShape] = useState(null);

    const handleSelectShape = (shape) => {
      setSelectedShape(shape);
    };

    return (
      <div>
        <LeftPanel onSelectShape={handleSelectShape} />
        <Grid selectedShape={selectedShape} />
      </div>
    );
  };

  export default MainPage;
