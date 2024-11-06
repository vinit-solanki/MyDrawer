import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheckCircle } from 'react-icons/fa';
import EditableElement from './EditableElement';

const Assets = ({ assets, onUpdateAsset, onSelectAssets }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);

  const toggleAssetSelection = (index) => {
    setSelectedAssets(prev => {
      const newSelection = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      onSelectAssets(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Assets</h2>
      <Droppable droppableId="assets" type="ASSET">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-[200px] p-4 border-2 border-dashed rounded-lg
              ${snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
              transition-all duration-200
            `}
          >
            <div className="space-y-4">
              {assets.map((asset, index) => (
                <Draggable
                  key={asset.id}
                  draggableId={asset.id.toString()}
                  index={index}
                  type="ASSET"
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => toggleAssetSelection(index)}
                      className={`
                        relative bg-white p-2 rounded-lg
                        transform transition-all duration-200
                        ${snapshot.isDragging ? 'shadow-2xl scale-105 z-50' : 'shadow-md'}
                        ${selectedAssets.includes(index) ? 'ring-2 ring-blue-500' : ''}
                      `}
                    >
                      <EditableElement
                        item={asset}
                        preview={true}
                        onUpdate={(updatedItem) => onUpdateAsset(index, updatedItem)}
                      />
                      {selectedAssets.includes(index) && (
                        <FaCheckCircle
                          className="absolute top-2 right-2 text-green-500 text-xl"
                          title="Selected"
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Assets;