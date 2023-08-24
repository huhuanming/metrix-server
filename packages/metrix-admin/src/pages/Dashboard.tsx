import { Space, Table } from "antd";
import { flow } from "lodash";
import useSWR from 'swr'
import { MetricsStatistic, MetricsType, StatisticsType, UnitTest } from "../type";
import { findMetricsStatistics, normalizeValue, normalizedCPU, normalizedMemory } from "../utils";

const avgMetricsStatistic = (arr: MetricsStatistic[], type: MetricsType, ...funcs: ((arg: string) => string)[]) => flow(
    findMetricsStatistics,
    normalizeValue,
    ...funcs,
)(arr, type, StatisticsType.avg);

export const Dashboard = () => {
    const { data, isLoading } = useSWR<UnitTest[]>('/api/dashboard/unit_tests', { revalidateOnFocus: true })

    return (
        <div>
            <Table dataSource={data} rowKey="id"  loading={isLoading}>
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
                <Table.Column
                    title="Actions"
                    dataIndex="id"
                    render={(id) => (
                        <Space size="middle">
                            <a href={`./details?id=${id}`}>Details</a>
                            <a href={`./details?id=${id}`}>Compare</a>
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
}