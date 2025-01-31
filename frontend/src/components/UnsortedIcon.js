
import { HiSortAscending } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';  // Or any other icon for the slash

export const UnsortedIcon = ({size=30}) => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <HiSortAscending size={size} />
    <div style={{
      position: 'absolute', 
      top: -10, 
      left: -10, 
      right: 0, 
      bottom: 0, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      transform: 'rotate(-60deg)', 
      fontSize: size, 
      color: 'red',
      opacity: "80%",
    }}>
      /
    </div>
  </div>
);