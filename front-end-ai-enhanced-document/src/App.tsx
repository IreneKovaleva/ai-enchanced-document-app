import React from 'react';
import './App.css';
import Chat from "./components/chat/Chat";
import Uploader from "./components/uploader/Uploader";

function App() {



  return (
      <div className="app-styles app-body">
          <Uploader/>
          <Chat/>
      </div>
  );
}

export default App;
