import BigNumber from 'bignumber.js'
import { flow } from 'lodash'
import { MetricsStatistic, MetricsType, StatisticsType } from '../type';

export interface MenuItem {
    label: string;
    key: string;
    path: string;
    filepath: string;
    icon?: unknown;
    children?: MenuItem[];
    // element?: { element: () => Promise<{ [key: string]: any }> };
}

export const avgMetricsStatistic = (arr: MetricsStatistic[], type: MetricsType, ...funcs: ((arg: string) => string)[]) => flow(
    findMetricsStatistics,
    normalizeValue,
    ...funcs,
)(arr, type, StatisticsType.avg);

export const normalizedMemory = (value: string) => BigNumber(value).dividedBy(1024).dividedBy(1024).toFixed(2);

export const normalizedCPU = (value: string) => BigNumber(value).dividedBy(100).toFixed(4) + '%';

export const normalizeValue = (value?: string, placeholder = '-') => {
    if (!value) {
        return placeholder
    }
    return BigNumber(value).shiftedBy(-3).toFixed()
}

export const findMetricsStatistics = (
    statistics: MetricsStatistic[],
    type: MetricsType,
    statisticsType: StatisticsType,
) => {
    return statistics.find((item) => item.type === type && item.statistics === statisticsType)?.value;
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