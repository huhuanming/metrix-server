import { Line } from "@ant-design/plots";
import { Card, Divider, Select, Spin, Table } from "antd";
import { flow, groupBy } from 'lodash'
import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { Metrics, MetricsType, UnitTest } from "../type";
import { avgMetricsStatistic, normalizedCPU, normalizedMemory } from "../utils";
import { useState } from "react";
interface RawMetricsStatisticChartItem {
    category: string,
    value: string
    runAt: number
}

interface MetricsStatisticChartItem {
    category: string,
    value: number
    runAt: number
}

const normalizeRunAt = (data: Metrics[]): RawMetricsStatisticChartItem[] => {
    const groups = groupBy(data.map(item => ({
        category: String(item.unitTestId),
        value: item.value,
        runAt: new Date(item.runAt).getTime()
    })).sort((a, b) => a.runAt - b.runAt), 'category')
    const result: RawMetricsStatisticChartItem[] = []
    Object.keys(groups).forEach(key => {
        const group = groups[key]
        const firstRunAtTime = group[0].runAt
        group.forEach(item => {
            result.push({
                ...item,
                runAt: (new Date(item.runAt).getTime() - firstRunAtTime) / 1000
            })
        })
    })
    return result
}

const formatFPS = (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    return data.map(item => ({
        ...item,
        value: Number(item.value) / 1000,
    }))
}

const formatRAM = (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    return data.map(item => ({
        ...item,
        value: Number(BigNumber(item.value).dividedBy(1000).dividedBy(1024).dividedBy(1024).toFixed(2).toString()),
    }))
}

const formatCPU = (data: RawMetricsStatisticChartItem[]): MetricsStatisticChartItem[] => {
    return data.map(item => ({
        ...item,
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

const BasicInfo = ({ ids }: { ids: number[] }) => {
    const { data, isLoading } = useSWR<UnitTest[]>(
        [`/api/dashboard/unit_test`, { method: 'post', body: { unitTestIds: ids } }]);
    return (
        <Card
            title="Basic Info"
        >
            <Table dataSource={data ? data : []} rowKey="id" loading={isLoading}>
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
                        (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.uiFps)}
                />
                <Table.Column
                    title="JS FPS(Avg.)"
                    dataIndex="jsFPS"
                    render={
                        (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.jsFps)}
                />
                <Table.Column
                    title="Used Memory(Avg. MB)"
                    dataIndex="usedMem"
                    render={
                        (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.usedRam, normalizedMemory)}
                />
                <Table.Column
                    title="Used CPU(Avg.)"
                    dataIndex="usedCpu"
                    render={
                        (_, record: UnitTest) => avgMetricsStatistic(record.MetricsStatistics, MetricsType.usedCpu, normalizedCPU)}
                />
                <Table.Column title="Create At" dataIndex="createdAt" render={(text) => new Date(text).toLocaleString()} />
            </Table>
        </Card>
    )
}

const COLOR_PLATE_10 = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
];

const ChartCard = ({ ids, type, title }: { ids: number[], type: MetricsType, title: string }) => {
    const { data, isLoading } = useSWR<Metrics[]>([`/api/dashboard/metrics`, { method: 'post', body: { unitTestIds: ids, type } }]);
    const result = data ? flow(normalizeRunAt, getForFormatFunc(type))(data) : []
    return (
        <Card title={title} bordered>
            <Spin spinning={isLoading}>
                {
                    result.length && (
                        <Line
                            color={COLOR_PLATE_10}
                            padding="auto"
                            xField="runAt"
                            yField="value"
                            seriesField="category"
                            data={result}
                        />
                    )
                }
            </Spin>
        </Card>
    )
}


export function Details() {
    const [selectedIds, seSelectedIds] = useState<number[]>([]);
    const id = new URLSearchParams(location.search).get('id');
    const { data, isLoading: isUnitTestLoading } = useSWR<UnitTest[]>(
        [`/api/dashboard/unit_test`, { method: 'post', body: { unitTestIds: [id] } }]);
    const { data: unitTestData, isLoading: isUnitTestDataLoading } = useSWR<UnitTest[]>(
        [`/api/dashboard/unit_test_by_name`, { method: 'post', body: { name: data?.[0].name } }]);
    if (isUnitTestLoading || isUnitTestDataLoading || !unitTestData) {
        return null
    }
    const ids = [Number(id), ...selectedIds]
    return (
        <div>
            <Select
                allowClear
                mode="multiple"
                style={{ width: '40vw' }}
                placeholder="Compare To"
                onChange={seSelectedIds}
                options={unitTestData.filter(item => item.id !== Number(id)).map(item => ({
                    label: `${item.id}-${new Date(item.createdAt).toLocaleString()}`,
                    value: item.id,
                }))}
            />
            <Divider />
            <BasicInfo
                ids={ids}
            />
            <Divider />
            <ChartCard
                ids={ids}
                title="UI FPS"
                type={MetricsType.uiFps}
            />
            <Divider />
            <ChartCard
                ids={ids}
                title="JS FPS"
                type={MetricsType.jsFps}
            />
            <Divider />
            <ChartCard
                ids={ids}
                title="Used RAM(MB)"
                type={MetricsType.usedRam}
            />
            <Divider />
            <ChartCard
                ids={ids}
                title="Used CPU(%)"
                type={MetricsType.usedCpu}
            />
        </div>
    )
}