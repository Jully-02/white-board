import React, { useState } from 'react';
import { Excalidraw, THEME } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import './App.css';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/dist/types/excalidraw/types';

export default function Whiteboard() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const excalidrawConfig = {
    theme: THEME.LIGHT,
    UIOptions: {
      canvasActions: {
        changeViewBackgroundColor: true,
        clearCanvas: true,
        loadScene: true,
        saveToActiveFile: true,
        toggleTheme: true,
      },
      tools: {
        image: true,
        shape: true,
      }
    }
  };

  const handleSave = async () => {
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();

      const response = await fetch('http://localhost:8080/notebook-api/whiteboard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements, appState }),
      });

      if (!response.ok) throw new Error('Lỗi lưu dữ liệu');
      alert('✅ Lưu thành công!');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Lưu thất bại!');
    }
  };

  const handleLoad = async () => {
    const filename = prompt("Nhập tên file để tải (ví dụ: whiteboard-1744436925807.json):");
    if (!filename || !excalidrawAPI) return;

    try {
      const response = await fetch(`http://localhost:8080/notebook-api/whiteboard/load/${filename}`);
      if (!response.ok) throw new Error('Không tìm thấy file hoặc lỗi server');

      const data = await response.json();
      
      excalidrawAPI.updateScene({
        elements: data.elements,
        appState: data.appState
      });
      
      excalidrawAPI.history.clear();

      alert("📂 Tải dữ liệu thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi tải:", error);
      alert("❌ Tải dữ liệu thất bại!");
    }
  };

  return (
    <div className="excalidraw-container">
      <div style={{ height: '100%' }}>
        <Excalidraw
          excalidrawAPI={api => setExcalidrawAPI(api)}
          theme={excalidrawConfig.theme}
          UIOptions={excalidrawConfig.UIOptions}
        />
      </div>

      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 100,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          💾 Save
        </button>

        <button
          onClick={handleLoad}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📂 Load data
        </button>
      </div>
    </div>
  );
}