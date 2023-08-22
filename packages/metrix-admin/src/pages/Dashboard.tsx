import { Space, Table } from "antd";
import { useEffect, useState } from "react";

export const Dashboard = () => {
    const [unitTests, setUnitTests] = useState([])
    useEffect(() => {
        fetch('api/dashboard/unit_tests').then(res => res.json()).then(res => {
            setUnitTests(res)
        })
    }, [])
    return (
        <div>
            <Table dataSource={unitTests} rowKey="id" >
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="UnitTest Name" dataIndex="name" />
                <Table.Column title="Device" dataIndex="device" />
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
                        (_, record: { Measure: { fpTime: number } }) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="UI FPS(Avg.)"
                    dataIndex="fpTime"
                    render={
                        (_, record: { Measure: { fpTime: number } }) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="JS FPS(Avg.)"
                    dataIndex="fpTime"
                    render={
                        (_, record: { Measure: { fpTime: number } }) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="Used Memory(Avg.)"
                    dataIndex="fpTime"
                    render={
                        (_, record: { Measure: { fpTime: number } }) =>
                            record.Measure.fpTime / 1000}
                />
                <Table.Column 
                    title="Used CPU(Avg.)"
                    dataIndex="fpTime"
                    render={
                        (_, record: { Measure: { fpTime: number } }) =>
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