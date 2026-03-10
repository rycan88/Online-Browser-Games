export const ChoiceDropdown = ({selectedChoice, setSelectedChoice, choices, isDisabled=false}) => {
    if (!choices) {
        return <></>
    }

    const handleSelect = (event) => {
        setSelectedChoice(event.target.value);
    };

    return (
        <div>
            <select className="dropdownMenu" 
                    id="choices" value={selectedChoice} 
                    onChange={handleSelect} 
                    disabled={isDisabled}>
                {
                    Object.entries(choices).map(([value, label]) => {
                        return <option value={value}>{label}</option>
                    })
                }
            </select>
        </div>
    );
}