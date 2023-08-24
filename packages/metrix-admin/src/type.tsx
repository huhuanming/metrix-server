
export enum MetricsType {
    uiFps = 'uiFps',
    jsFps = 'jsFps',
    usedCpu = 'usedCpu',
    usedRam = 'usedRam',
}

export enum StatisticsType {
    avg = 'avg',
    max = 'max',
    min = 'min',
}

export interface Measure {
    id: number
    unitTestId: number
    jsBundleLoadedTime: number
    jsBundleLoadedTimeAt?: string
    fpTime: number
    fpTimeAt?: string
    commitHash?: string
    brand?: string
    buildNumber?: string
    deviceId?: string
    model?: string
    systemName?: string
    systemVersion?: string
    isDeleted: number
    createdAt: string
    updatedAt: string
}

export interface MetricsStatistic {
    id: number
    unitTestId: number
    type: MetricsType
    statistics: StatisticsType
    value: string
    isDeleted: number
    createdAt: string
    updatedAt: string
}

export interface Metrics {
    id: number
    unitTestId: number
    type: string
    value: string
    runAt: string
    isDeleted: number
    createdAt: string
    updatedAt: string
}

export interface UnitTest {
    id: number
    name: string
    isDeleted: number
    createdAt: string
    updatedAt: string
    Measure: Measure
    MetricsStatistics: MetricsStatistic[]
}

