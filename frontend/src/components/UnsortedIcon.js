import { TbSlash, TbSortAscending } from 'react-icons/tb';

export const UnsortedIcon = ({size=30}) => (
  <div className='relative flex'>
    <div className="rotate-180">
      <TbSortAscending size={size} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center rotate-[100deg] text-red-500">
        <TbSlash size={size * 1.1} />
      </div>
  </div>
);