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
          const [url, options] = args
          const body = options?.body
          return fetch(url, {
            ...options,
            body: body ? typeof body === 'string' ?body : JSON.stringify(body) : undefined,
            headers: {
            'Content-Type': 'application/json;charset=UTF-8',
              ...options?.headers,
            },
          }).then(res => {
            if (res.status === 401) {
              window.location.href = '/login'
            }
            return res.json()
          })
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
