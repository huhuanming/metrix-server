import { ConfigProvider } from 'antd';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { SWRConfig } from 'swr'

const Routers =  () => useRoutes(routes)

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <ConfigProvider>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </ConfigProvider>
    </SWRConfig>
  )
}

export default App
