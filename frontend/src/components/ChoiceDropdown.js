export const ChoiceDropdown = ({selectedChoice, setSelectedChoice, choices}) => {
    if (!choices) {
        return <></>
    }

    const handleSelect = (event) => {
        setSelectedChoice(event.target.value);
    };

    return (
        <div>
            <select className="text-black" id="choices" value={selectedChoice} onChange={handleSelect}>
                {
                    Object.entries(choices).map(([value, label]) => {
                        return <option value={value}>{label}</option>
                    })
                }
            </select>
        </div>
    );
}