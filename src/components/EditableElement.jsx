import React, { useState } from 'react';

const EditableElement = ({ item, onUpdate, preview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text || 'Button Text');

  const getElementStyle = (type) => {
    switch (type) {
      case 'Red Button':
        return 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-all duration-200 min-w-[120px] text-center';
      case 'Green Button':
        return 'bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-all duration-200 min-w-[120px] text-center';
      case 'Blue Button':
        return 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-all duration-200 min-w-[120px] text-center';
      case 'Text':
        return 'text-gray-800 p-4 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px] text-base';
      case 'Divider':
        return 'border-t-2 border-gray-300 my-6 w-full min-w-[200px]';
      default:
        return '';
    }
  };

  const getPreviewStyle = (type) => {
    switch (type) {
      case 'Red Button':
        return 'bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm';
      case 'Green Button':
        return 'bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm';
      case 'Blue Button':
        return 'bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm';
      case 'Text':
        return 'text-gray-800 p-2 text-sm bg-gray-50 rounded-md';
      case 'Divider':
        return 'border-t-2 border-gray-300 my-2';
      default:
        return '';
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (item.value !== 'Divider') {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate({ ...item, text });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const renderElement = () => {
    if (item.type === 'image') {
      return (
        <div className={`group relative overflow-hidden rounded-lg ${preview ? 'h-full' : ''}`}>
          <img
            src={item.url}
            alt={item.name}
            className={`
              object-cover transition-transform duration-200
              ${preview ? 'w-full h-full' : 'w-32 h-32'}
              ${preview ? '' : 'hover:scale-105'}
            `}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>
      );
    }

    if (item.type === 'layout') {
      if (preview) {
        if (item.value === 'Divider') {
          return <hr className={getPreviewStyle('Divider')} />;
        }
        if (item.value.includes('Button')) {
          return (
            <button className={getPreviewStyle(item.value)}>
              {text}
            </button>
          );
        }
        if (item.value === 'Text') {
          return (
            <p className={getPreviewStyle('Text')}>
              {text}
            </p>
          );
        }
      } else {
        return renderFullElement();
      }
    }

    return null;
  };

  const renderFullElement = () => {
    if (item.value === 'Divider') {
      return <hr className={getElementStyle('Divider')} />;
    }

    if (isEditing) {
      return (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="border-2 border-blue-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    if (item.value.includes('Button')) {
      return (
        <button className={getElementStyle(item.value)}>
          {text}
        </button>
      );
    }

    if (item.value === 'Text') {
      return (
        <p className={getElementStyle('Text')}>
          {text}
        </p>
      );
    }
  };

  return (
    <div 
      onDoubleClick={handleDoubleClick} 
      className={`relative group cursor-pointer h-full flex items-center justify-center
        ${preview ? 'transform scale-90' : ''}`}
      title="Double click to edit"
    >
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="border-2 border-blue-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        renderElement()
      )}
    </div>
  );
};

export default EditableElement; 