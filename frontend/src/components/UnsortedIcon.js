import { FaSlash } from 'react-icons/fa6';
import { PiSortDescendingBold } from 'react-icons/pi';

export const UnsortedIcon = ({size=30}) => (
  <div className='relative flex'>
    <div className='rotate-[180deg]'>
      <PiSortDescendingBold size={size} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center rotate-[10deg] text-red-500">
      <FaSlash size={size} />
    </div>
  </div>
);