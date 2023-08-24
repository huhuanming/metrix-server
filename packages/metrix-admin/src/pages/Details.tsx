import { Line } from "@ant-design/plots";
import { Card, Divider, Spin } from "antd";
import { flow } from 'lodash'
import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { Metrics, MetricsType } from "../type";

// const baseConfig = {
//     padding: 'auto',
//     xField: 'runAt',
//     yField: 'value',
//     xAxis: {
//         // type: 'timeCat',
//         tickCount: 5,
//     },
// };

interface RawMetricsStatisticChartItem {
    value: string
    runAt: number
}

interface MetricsStatisticChartItem {
    value: number
    runAt: number
}

const normalizeRunAt = (data: Metrics[]): RawMetricsStatisticChartItem[] => {
    const firstRunAtTime = new Date(data[0].runAt).getTime()
    return data.map(item => ({
        value: item.value,
        runAt: (new Date(item.runAt).getTime() - firstRunAtTime) / 1000
    }))
}

const formatFPS = (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    console.log('formatFPS')
    return data.map(item => ({
        runAt: item.runAt,
        value: Number(item.value) / 1000,
    }))
}

const formatRAM= (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    console.log('formatFPS')
    return data.map(item => ({
        runAt: item.runAt,
        value: Number(BigNumber(item.value).dividedBy(1000).dividedBy(1024).dividedBy(1024).toFixed(2).toString()),
    }))
}

const formatCPU= (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    console.log('formatFPS')
    return data.map(item => ({
        runAt: item.runAt,
        value: Number(item.value) / 1000,
    }))
}

const FormatMap = {
   [MetricsType.jsFps as MetricsType]: formatFPS,
   [MetricsType.uiFps as MetricsType]: formatFPS,
   [MetricsType.usedCpu as MetricsType]: formatCPU,
   [MetricsType.usedRam as MetricsType]: formatRAM,
}

const getForFormatFunc = (type: MetricsType) => {
    return FormatMap[type] || ((arr: []) => arr)
}

const ChartCard = ({ id, type, title }: { id: string, type: MetricsType, title: string}) => {
    const { data, isLoading } = useSWR<Metrics[]>(`/api/dashboard/metrics?unitTestId=${id}&type=${type}`);
    const result = data ? flow(normalizeRunAt, getForFormatFunc(type))(data) : []
    return (
        <Card title={title} bordered>
            <Spin spinning={isLoading}>
                {
                    result.length && (
                        <Line
                            padding="auto"
                            xField="runAt"
                            yField="value"
                            data={result}
                        />
                    )
                }
            </Spin>
        </Card>
    )
}


export function Details() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) {
        return null
    }
    return (
        <div>
            <ChartCard
                id={id}
                title="UI FPS"
                type={MetricsType.uiFps}
            />
            <Divider />
            <ChartCard
                id={id}
                title="JS FPS"
                type={MetricsType.jsFps}
            />
            <Divider />
            <ChartCard
                id={id}
                title="Used RAM(MB)"
                type={MetricsType.usedRam}
            />
            <ChartCard
                id={id}
                title="Used CPU(%)"
                type={MetricsType.usedCpu}
            />
        </div>
    )
}