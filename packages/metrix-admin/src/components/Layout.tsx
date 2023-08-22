import {
  DashboardOutlined,
  GithubFilled,
  InfoCircleFilled,
  LoginOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { ProBreadcrumb, ProConfigProvider, ProSettings } from '@ant-design/pro-components';
import ProLayout from '@ant-design/pro-layout';
import { Input, Switch, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getOperatingSystem, treeRouter } from '../utils';

const Settings = {
    title: 'admin',
    logo: '',
}

const baseRouterList = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    path: 'dashboard',
    icon: <DashboardOutlined />,
    filepath: '../pages/Dashboard.tsx',
  },
];
export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  const [dark, setDark] = useState(
    getOperatingSystem() === 'mac' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const settings: ProSettings | undefined = {
    title: Settings.title,
    // fixSiderbar: true,
    layout: 'mix',
    // splitMenus: true,
  };

  useEffect(() => {
    // 监听 Macos系统 颜色切换
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        setDark(true);
      } else {
        setDark(false);
      }
    });
  }, []);
  return (
    <ProConfigProvider dark={dark}>
      <div
        id="admin-pro-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          fixSiderbar
          siderWidth={245}
          logo={Settings.logo}
          ErrorBoundary={false}
          route={{
            path: '/',
            routes: treeRouter([...baseRouterList]),
          }}
          {...settings}
          location={{
            pathname,
          }}
          waterMarkProps={{
            content: Settings.title,
          }}
          appList={[
          ]}
          avatarProps={{
            src: Settings.logo,
            size: 'small',
            // title: <div>{(user.token as unknown as { username: string })?.username}</div>,
          }}
          headerContentRender={() => <ProBreadcrumb />}
          actionsRender={(props) => {
            if (props.isMobile) return [];
            return [
              props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                <div
                  key="SearchOutlined"
                  aria-hidden
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginInlineEnd: 24,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <Input
                    style={{
                      borderRadius: 4,
                      marginInlineEnd: 12,
                      backgroundColor: 'rgba(0,0,0,0.03)',
                    }}
                    prefix={
                      <SearchOutlined
                        style={{
                          color: 'rgba(0, 0, 0, 0.15)',
                        }}
                      />
                    }
                    placeholder=""
                    bordered={false}
                  />
                  <PlusCircleFilled
                    style={{
                      color: 'var(--ant-primary-color)',
                      fontSize: 24,
                    }}
                  />
                </div>
              ) : undefined,
              <Tooltip placement="bottom" title={'Sign Out'}>
                <a>
                  <LoginOutlined
                    onClick={async () => {
                    //   await signOut(dispatch);
                    //   navigate('/login');
                    }}
                  />
                </a>
              </Tooltip>,
            ];
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed || props?.isMobile) return undefined;
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <QuestionCircleFilled key="QuestionCircleFilled" />
                <InfoCircleFilled key="InfoCircleFilled" />
                <Tooltip placement="bottom" title={'Switch topic'}>
                  <Switch
                    checkedChildren="🌜"
                    unCheckedChildren="🌞"
                    checked={dark}
                    onChange={(v) => setDark(v)}
                  />
                </Tooltip>
              </div>
            );
          }}
          menuItemRender={(item, dom) => (
            <Link
              to={item?.path || '/'}
              onClick={() => {
                setPathname(item.path || '/');
              }}
            >
              {dom}
            </Link>
          )}
          onMenuHeaderClick={() => navigate('/')}
        >
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
};