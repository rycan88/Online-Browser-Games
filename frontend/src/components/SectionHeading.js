
export const SectionHeading = ({text, color="rgb(203,213,225)"}) => { // slate-300
    return (
        <div className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-wider`}
             style={{color: color}}
        >
            <div className={`flex-1 h-[2px]`}
                 style={{backgroundColor: color, opacity: 0.5}}
            />
            {text}
            <div className={`flex-1 h-[2px]`}
                 style={{backgroundColor: color, opacity: 0.5}}
            />
        </div>
    );
}