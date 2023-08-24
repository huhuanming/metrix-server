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

export interface UnitTest {
    id: number
    name: string
    isDeleted: number
    createdAt: string
    updatedAt: string
    Measure: Measure
}