import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheckCircle } from 'react-icons/fa';
import EditableElement from './EditableElement';

const SECTIONS = [
  {
    id: 'navigation',
    title: 'Navigation',
    minHeight: '80px',
    bg: 'bg-slate-50',
    dropZones: [
      { id: 'nav-left', title: 'Logo & Brand', width: 'w-1/4' },
      { id: 'nav-center', title: 'Menu Items', width: 'w-2/4' },
      { id: 'nav-right', title: 'Call to Action', width: 'w-1/4' }
    ]
  },
  {
    id: 'hero',
    title: 'Hero Section',
    minHeight: '600px',
    bg: 'bg-white',
    dropZones: [
      { id: 'hero-left', title: 'Content & CTA', width: 'w-1/2' },
      { id: 'hero-right', title: 'Hero Media', width: 'w-1/2' }
    ]
  },
  {
    id: 'features',
    title: 'Features Grid',
    minHeight: '400px',
    bg: 'bg-slate-50',
    dropZones: [
      { id: 'feature-1', title: 'Feature Card 1', width: 'w-1/3' },
      { id: 'feature-2', title: 'Feature Card 2', width: 'w-1/3' },
      { id: 'feature-3', title: 'Feature Card 3', width: 'w-1/3' }
    ]
  },
  {
    id: 'content',
    title: 'Main Content',
    minHeight: '500px',
    bg: 'bg-white',
    dropZones: [
      { id: 'content-main', title: 'Primary Content', width: 'w-2/3' },
      { id: 'content-sidebar', title: 'Sidebar Content', width: 'w-1/3' }
    ]
  },
  {
    id: 'cta',
    title: 'Call to Action',
    minHeight: '300px',
    bg: 'bg-slate-50',
    dropZones: [
      { id: 'cta-content', title: 'CTA Content', width: 'w-full' }
    ]
  },
  {
    id: 'footer',
    title: 'Footer',
    minHeight: '250px',
    bg: 'bg-slate-900',
    dropZones: [
      { id: 'footer-1', title: 'Column 1', width: 'w-1/4' },
      { id: 'footer-2', title: 'Column 2', width: 'w-1/4' },
      { id: 'footer-3', title: 'Column 3', width: 'w-1/4' },
    ]
  }
];

function Canvas({ sectionItems, onSelectFiles, onUpdateElement }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleFileSelection = (sectionId, itemIndex) => {
    setSelectedFiles(prev => {
      const key = `${sectionId}-${itemIndex}`;
      return prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key];
    });
  };

  useEffect(() => {
    onSelectFiles(selectedFiles);
  }, [selectedFiles, onSelectFiles]);

  return (
    <div className='w-full bg-white rounded-xl shadow-xl overflow-hidden'>
      <div className='flex flex-col w-full'>
        {SECTIONS.map(section => (
          <div 
            key={section.id}
            className={`w-full ${section.bg} p-8 gap-x-3 border-b border-gray-200 transition-all duration-300`}
            style={{ minHeight: section.minHeight }}
          >
            <div className='max-w-7xl mx-auto w-full flex flex-col gap-y-1'>
              <div className='text-xl font-semibold text-gray-700 mb-6'>
                {section.title}
              </div>
              
              <div className="flex flex-wrap w-full justify-evenly">
                {section.dropZones.map(zone => (
                  <Droppable 
                    key={zone.id}
                    droppableId={zone.id}
                    type="ASSET"
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          ${zone.width} p-3
                          min-h-[120px] rounded-lg
                          ${snapshot.isDraggingOver 
                            ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                            : 'bg-white/80 border border-gray-200'}
                          transition-all duration-200 backdrop-blur-sm
                          hover:shadow-md
                        `}
                      >
                        <div
                          className={`
                            w-full h-full rounded-lg
                            ${snapshot.isDraggingOver 
                              ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                              : 'bg-white/80 border-2 border-dashed border-gray-200'}
                            transition-all duration-200 backdrop-blur-sm
                            hover:shadow-lg
                          `}
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">
                              {zone.title}
                            </span>
                          </div>
                          <div className='p-4 min-h-[calc(100%-48px)]'>
                            <div className='flex flex-col gap-3 h-full'>
                              {sectionItems[zone.id]?.map((item, index) => (
                                <Draggable 
                                  key={item.id}
                                  draggableId={item.id.toString()} 
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => toggleFileSelection(zone.id, index)}
                                      className={`
                                        relative w-full transition-all duration-200
                                        ${snapshot.isDragging ? 'scale-105 z-50 shadow-xl' : 'shadow-sm'}
                                        hover:shadow-md
                                      `}
                                    >
                                      <EditableElement 
                                        item={item}
                                        onUpdate={(updatedItem) => onUpdateElement(zone.id, index, updatedItem)}
                                      />
                                      {selectedFiles.includes(`${zone.id}-${index}`) && (
                                        <FaCheckCircle
                                          className='absolute top-2 right-2 text-green-500 text-xl bg-white rounded-full'
                                          title='Selected'
                                        />
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {(!sectionItems[zone.id] || sectionItems[zone.id].length === 0) && (
                                <div className="flex items-center justify-center h-full min-h-[100px] text-gray-400 text-sm">
                                  Drop items here
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Canvas;