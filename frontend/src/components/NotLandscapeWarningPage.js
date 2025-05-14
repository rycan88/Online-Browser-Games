import { FullscreenButton } from "./FullscreenButton";

export const NotLandscapeWarningPage = () => {
    return (
        <div className="entirePage rotate-notice">
            <div className="topTaskBar">
                <FullscreenButton shouldRotate={true}/>
            </div>
            <div>Please rotate your device to landscape mode.</div>
        </div>
    );
}