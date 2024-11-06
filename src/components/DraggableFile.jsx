import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemType } from '../constants';

const DraggableFile = ({ index, file, isVideo, x, y, moveFile }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.FILE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.FILE,
    hover: (item, monitor) => {
      if (!monitor.didDrop()) {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const newX = x + delta.x;
          const newY = y + delta.y;
          moveFile(item.index, newX, newY);
        }
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        zIndex: isDragging ? 1 : 0,
      }}
    >
      {isVideo ? (
        <video
          src={file}
          controls
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="w-64 h-64 border rounded object-cover shadow-md"
        />
      ) : (
        <img
          src={file}
          alt={`Uploaded ${index}`}
          className="w-64 h-auto object-cover border rounded shadow-md"
        />
      )}
    </div>
  );
};

export default DraggableFile;
