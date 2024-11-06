import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Navbar from "./components/Navbar";
import Canvas from "./components/Canvas";
import Assets from "./components/Assets";

const App = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [sectionItems, setSectionItems] = useState({
    'nav-left': [],
    'nav-center': [],
    'nav-right': [],
    'hero-left': [],
    'hero-right': [],
    'feature-1': [],
    'feature-2': [],
    'feature-3': [],
    'content-main': [],
    'content-sidebar': [],
    'cta-content': [],
    'footer-1': [],
    'footer-2': [],
    'footer-3': [],
    'footer-4': []
  });
  const [selectedAssets, setSelectedAssets] = useState([]);

  const handleFileUpload = (fileUrl) => {
    const newFile = {
      id: `file-${Date.now()}`,
      url: fileUrl,
      type: "image",
      name: `Image ${uploadedFiles.length + 1}`,
    };
    setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const handleElementSelect = (element) => {
    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
    };
    setUploadedFiles((prevFiles) => [...prevFiles, newElement]);
  };

  const handleDelete = () => {
    const updatedSectionItems = { ...sectionItems };

    Object.keys(updatedSectionItems).forEach((sectionId) => {
      updatedSectionItems[sectionId] = updatedSectionItems[sectionId].filter(
        (_, index) => !selectedFiles.includes(`${sectionId}-${index}`)
      );
    });

    setSectionItems(updatedSectionItems);
    setSelectedFiles([]);

    if (selectedAssets.length > 0) {
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((_, index) => !selectedAssets.includes(index))
      );
      setSelectedAssets([]);
    }
  };

  const handleSelectFiles = (selected) => {
    setSelectedFiles(selected);
  };

  const handleUpdateAsset = (index, updatedAsset) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? updatedAsset : file))
    );
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) {
      console.log('No destination');
      return;
    }

    try {
      if (source.droppableId === "assets") {
        console.log('Dragging from assets to', destination.droppableId);
        const assetToMove = uploadedFiles[source.index];
        
        if (!assetToMove) {
          console.log('Asset not found');
          return;
        }

        const newItem = {
          ...assetToMove,
          id: `${assetToMove.id}-${Date.now()}`,
        };

        setSectionItems(prev => ({
          ...prev,
          [destination.droppableId]: [
            ...(prev[destination.droppableId] || []),
            newItem
          ]
        }));
        
        return;
      }

      const sourceItems = Array.from(sectionItems[source.droppableId] || []);
      const destItems = source.droppableId === destination.droppableId 
        ? sourceItems 
        : Array.from(sectionItems[destination.droppableId] || []);

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setSectionItems(prev => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      }));
    } catch (error) {
      console.error('Error in handleDragEnd:', error);
    }
  };

  const handleSave = () => {
    const state = {
      uploadedFiles,
      sectionItems,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem("websiteBuilderState", JSON.stringify(state));
  };

  const handleLoad = () => {
    const savedState = localStorage.getItem("websiteBuilderState");
    if (savedState) {
      const { uploadedFiles: savedFiles, sectionItems: savedSections } =
        JSON.parse(savedState);
      setUploadedFiles(savedFiles);
      setSectionItems(savedSections);
    }
  };

  const handleElementUpdate = (sectionId, index, updatedItem) => {
    setSectionItems((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((item, i) =>
        i === index ? updatedItem : item
      ),
    }));
  };

  const handleSelectAssets = (selected) => {
    setSelectedAssets(selected);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-screen min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
        <Navbar
          onFileUpload={handleFileUpload}
          onDelete={handleDelete}
          onElementSelect={handleElementSelect}
          onSave={handleSave}
          onLoad={handleLoad}
        />
        <div className="flex flex-row flex-grow w-full p-3">
          <div className="w-1/3 mx-auto px-3 md:px-4">
            <Assets
              assets={uploadedFiles}
              onUpdateAsset={handleUpdateAsset}
              onSelectAssets={handleSelectAssets}
            />
          </div>

          <div className="max-w-[1920px] w-full mx-auto px-3 md:px-4">
            <Canvas
              sectionItems={sectionItems}
              onSelectFiles={handleSelectFiles}
              selectedElement={selectedElement}
              onUpdateElement={handleElementUpdate}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
