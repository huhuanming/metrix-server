import { ConfigProvider } from 'antd';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';

const Routers =  () => useRoutes(routes)

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
