import { Space, Table } from "antd";
import useSWR from 'swr'
import { UnitTest } from "../type";

export const Dashboard = () => {
    const { data, isLoading } = useSWR<UnitTest[]>('/api/dashboard/unit_tests', { revalidateOnFocus: true })

    return (
        <div>
            <Table dataSource={data} rowKey="id"  loading={isLoading}>
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="UnitTest Name" dataIndex="name" />
                <Table.Column
                    width={200}
                    title="Device"
                    dataIndex="device"
                    render={
                        (_, record: UnitTest) => `${record.Measure.model} (${record.Measure.systemName} ${record.Measure.systemVersion})`
                    }
                />
                <Table.Column 
                    title="jsBundleLoadedTime(s)"
                    dataIndex="jsBundleLoadedTime"
                    render={
                        (_, record: { Measure: { jsBundleLoadedTime: number } }) =>
                            record.Measure.jsBundleLoadedTime / 1000}
                />
                <Table.Column 
                    title="First Paint Time(s)"
                    dataIndex="fpTime"
                    render={
                        (_, record: UnitTest) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="UI FPS(Avg.)"
                    dataIndex="uiFPS"
                    render={
                        (_, record: UnitTest) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="JS FPS(Avg.)"
                    dataIndex="jsFPS"
                    render={
                        (_, record: UnitTest) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="Used Memory(Avg.)"
                    dataIndex="usedMem"
                    render={
                        (_, record: UnitTest) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="Used CPU(Avg.)"
                    dataIndex="usedCpu"
                    render={
                        (_, record: UnitTest) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column title="Create At" dataIndex="createdAt" />
                <Table.Column title="Update At" dataIndex="updatedAt" />
                <Table.Column
                    title="Actions"
                    dataIndex="id"
                    render={(id) => (
                        <Space size="middle">
                            <a href={`./detail/${id}`}>detail</a>
                            <a href={`./detail/${id}`}>compare</a>
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
}