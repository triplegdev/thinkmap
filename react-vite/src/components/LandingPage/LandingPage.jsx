import './LandingPage.css';

const LandingPage = () => {
    return (
        <div id="landing">
            <h1 id="landing__logo">
                <span id="landing__logo-think">
                    <span id="landing__t" className="animate">t</span>
                    <span id="landing__h" className="animate">h</span>
                    <span id="landing__i" className="animate">i</span>
                    <span id="landing__n" className="animate">n</span>
                    <span id="landing__k" className="animate">K</span>
                </span>
                <span id="map">map</span>
            </h1>
            <button id="landing__button">Create</button>
        </div>
    )
}

export default LandingPage;
