import { Background, CamFrame, Footer } from "./components/Overlays";
import { Dashboard } from "./components/Dashboard";
import { ChatBox } from "./components/Chat";
import { AlertBox } from "./components/Alerts";
import { Routes, Route } from 'react-router-dom';
import { MusicBox } from "./components/Music";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/music" element={<MusicBox/>}/>
      <Route path="/frame" element={<CamFrame/>}/>
      <Route path="/back" element={<Background/>}/>
      <Route path="/footer" element={<Footer/>} />
      <Route path="/chat" element={<ChatBox/>} />
      <Route path="/alerts" element={<AlertBox/>} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  )
}
