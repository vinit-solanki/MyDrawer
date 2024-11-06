import React from 'react';
import { IoIosFolderOpen } from "react-icons/io";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaRegStickyNote } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const Navbar = ({ onFileUpload, onDelete, onElementSelect }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file) {
        onFileUpload(URL.createObjectURL(file));
      }
    });
  };

  const handleElementSelect = (element) => {
    onElementSelect({
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'layout',
      value: element,
      text: element.includes('Button') ? 'Click Me' : 'Text Content'
    });
  };
  
  const tooltips = {
    layouts: ["Red Button", "Green Button", "Blue Button", "Text", "Divider"],
  };

  return (
    <div className="w-full bg-white shadow-lg p-4 px-6 flex justify-center items-center gap-4">
      {/* Layout Icon with Tooltip */}
      <div className='relative group cursor-pointer flex flex-col items-center gap-1 border-2 border-black p-1 px-4 rounded-md'>
        <FaRegStickyNote className='text-xl text-blue-600' />
        <span className='text-gray-700 font-semibold'>Layouts</span>
        <ul className="absolute z-50 top-full hidden group-hover:flex flex-col bg-white border shadow-lg p-2 rounded-md">
          {tooltips.layouts.map((layout, index) => (
            <li 
              key={index} 
              onClick={() => handleElementSelect(layout)}
              className="text-gray-600 text-sm px-2 py-1 hover:bg-gray-200 rounded cursor-pointer"
            >
              {layout}
            </li>
          ))}
        </ul>
      </div>

      <div onClick={onDelete} className='cursor-pointer flex flex-col items-center gap-1 border-2 border-black p-1 px-4 rounded-md'>
        <RiDeleteBinLine className='text-xl text-blue-600' />
        <span className='text-gray-700 font-semibold'>Delete</span>
      </div>

      <div className='flex items-center gap-2 border-2 border-black p-3 rounded-md'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <IoIosFolderOpen className='text-xl text-blue-600' />
          <span className='text-gray-700 font-semibold'>Upload Files</span>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Navbar;
