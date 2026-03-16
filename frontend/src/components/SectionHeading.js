
export const SectionHeading = ({text, color="slate-300"}) => {
    return (
        <div className={`flex items-center gap-3 text-${color} text-sm font-semibold uppercase tracking-wider`}
             style={{color: color}}
        >
            <div className={`flex-1 h-[2px] bg-${color}/50`}/>
            {text}
            <div className={`flex-1 h-[2px] bg-${color}/50`}/>
        </div>
    );
}