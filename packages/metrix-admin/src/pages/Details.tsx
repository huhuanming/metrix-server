import { Line } from "@ant-design/plots";
import { Card, Divider, Spin, Table } from "antd";
import { flow } from 'lodash'
import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { Metrics, MetricsType, UnitTest } from "../type";
import { avgMetricsStatistic, normalizedCPU, normalizedMemory } from "../utils";

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
    return data.map(item => ({
        runAt: item.runAt,
        value: Number(item.value) / 1000,
    }))
}

const formatRAM= (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    return data.map(item => ({
        runAt: item.runAt,
        value: Number(BigNumber(item.value).dividedBy(1000).dividedBy(1024).dividedBy(1024).toFixed(2).toString()),
    }))
}

const formatCPU= (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
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

const BasicInfo = ({ ids }: { ids: string[] }) => {
    const { data, isLoading } = useSWR<UnitTest[]>(
        [`/api/dashboard/unit_test`, { method: 'post', body: JSON.stringify({ unitTestIds: ids })}]);
    return (
        <Card
            title="Basic Info"
        >
            <Table dataSource={data ? data : []} rowKey="id"  loading={isLoading}>
            <Table.Column title="ID" dataIndex="id" />
            <Table.Column
                width={200}
                title="UnitTest Name"
                dataIndex="name"
            />
            <Table.Column
                title="Device"
                dataIndex="device"
                width={200}
                render={
                    (_, record: UnitTest) => `${record.Measure.model} (${record.Measure.systemName} ${record.Measure.systemVersion})`
                }
            />
            <Table.Column 
                title="JS Loaded(s)"
                dataIndex="jsBundleLoadedTime"
                render={
                    (_, record: { Measure: { jsBundleLoadedTime: number } }) =>
                        record.Measure.jsBundleLoadedTime / 1000}
            />
            <Table.Column 
                title="First Paint(s)"
                dataIndex="fpTime"
                render={
                    (_, record: UnitTest) =>
                        record.Measure.fpTime / 1000}
            />
            <Table.Column 
                title="UI FPS(Avg.)"
                dataIndex="uiFPS"
                render={
                    (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.uiFps) }
            />
            <Table.Column 
                title="JS FPS(Avg.)"
                dataIndex="jsFPS"
                render={
                    (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.jsFps) }
            />
            <Table.Column 
                title="Used Memory(Avg. MB)"
                dataIndex="usedMem"
                render={
                    (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.usedRam, normalizedMemory) }
            />
            <Table.Column 
                title="Used CPU(Avg.)"
                dataIndex="usedCpu"
                render={
                    (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.usedCpu, normalizedCPU) }
            />
            <Table.Column title="Create At" dataIndex="createdAt" render={(text) => new Date(text).toLocaleString()} />
        </Table>
        </Card>
    )
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
            <BasicInfo
                ids={[id]}
            />
            <Divider />
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