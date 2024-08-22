import "../css/Overlay.css";

export function Overlay({ isOpen, onClose, children }) {
    return (
        <div>
            {isOpen ? (
                <div className="overlay"> 
                    <div className="background" onClick={onClose}>
                        <div className="overlayContainer">
                            <div className="controls">
                                <button className="closeButton" type="button" onClick={onClose}/>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}