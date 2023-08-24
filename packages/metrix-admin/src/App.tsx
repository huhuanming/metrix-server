import { ConfigProvider } from 'antd';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { SWRConfig } from 'swr'

const Routers =  () => useRoutes(routes)

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (params: RequestInfo | URL | [resource: RequestInfo | URL, init?: RequestInit]) => {
          const args: [resource: RequestInfo | URL, init?: RequestInit] = Array.isArray(params) ? params : [params];
          const [url, options ] = args
          return fetch(url, {
            ...options,
            headers: {
            'Content-Type': 'application/json;charset=UTF-8',
              ...options?.headers,
            }
          }).then(res => res.json())
        }
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
