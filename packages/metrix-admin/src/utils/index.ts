export interface MenuItem {
    label: string;
    key: string;
    path: string;
    filepath: string;
    icon?: unknown;
    children?: MenuItem[];
    // element?: { element: () => Promise<{ [key: string]: any }> };
}



export const treeRouter = (list: MenuItem[]) => {
    return list.map((item) => {
        return {
            path: item.path,
            name: item.label,
            icon: item.icon,
            routes:
                'children' in item
                    ? item.children!.map(({ children, icon, label, path }) => {
                        return {
                            path: path,
                            name: label,
                            icon: icon,
                            routes: children,
                        };
                    })
                    : undefined,
        };
    });
};

export const getOperatingSystem = () => {
    const agent = navigator.userAgent.toLowerCase();
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
        return 'win32';
    }
    if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
        return 'win32';
    }
    if (isMac) {
        return 'mac';
    }
};