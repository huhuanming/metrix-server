import { Button, Col, Form, Row, Select, Space, Table } from "antd";
import useSWR from 'swr'
import { MetricsType, UnitTest } from "../type";
import { normalizedCPU, normalizedMemory, avgMetricsStatistic } from "../utils";
import { useCallback, useState } from "react";


const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    padding: 24,
};

type QueryParamsType = {
    pageIndex?: number,
    pageSize?: number,
    model?: string,
    name?: string,
}

export const Dashboard = () => {
    const [queryParams, setQueryParams] = useState<QueryParamsType>({})
    const [form] = Form.useForm();
    const { data, isLoading } = useSWR<{
        totalSize: number,
        pageIndex: number,
        data: UnitTest[]
    }>(`/api/dashboard/unit_tests?${new URLSearchParams(queryParams as { [key: string]: string }).toString()}`, { revalidateOnFocus: true })
    const {
        data: unitTestNames,
    } = useSWR<{ name: string }[]>('/api/dashboard/unit_test_names', { revalidateOnFocus: true })
    const {
        data: models,
    } = useSWR<{ model: string }[]>('/api/dashboard/models', { revalidateOnFocus: true })
    const onFinish = useCallback((values: QueryParamsType) => {
        setQueryParams((prev) => Object.keys({ ...prev, ...values }).reduce((acc, key) => { 
            if (values[key as keyof QueryParamsType]) {
                acc[key] = values[key as keyof QueryParamsType]
            }
            return acc
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         }, {} as any))
    }, [])
    // const {
    //     data: deviceIds,
    // } = useSWR<{ deviceId: string }[]>('/api/dashboard/deviceId', { revalidateOnFocus: true })
    return (
        <div>
            <Form form={form} name="advanced_search" style={formStyle} onFinish={(onFinish)}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="name"
                            label="UnitTest Name"
                        >
                            <Select
                                allowClear
                                options={unitTestNames?.map(item => ({
                                    label: item.name,
                                    value: item.name,
                                }))}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="model"
                            label="Model"
                        >
                            <Select
                                allowClear
                                options={models?.map(item => ({
                                    label: item.model,
                                    value: item.model,
                                }))}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item
                            name="deviceId"
                            label="Device ID"
                        >
                            <Select
                                allowClear
                                options={deviceIds?.map(item => ({
                                    label: item.deviceId,
                                    value: item.deviceId,
                                }))}
                            >
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
                <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                onFinish({});
                            }}
                        >
                            Clear
                        </Button>
                    </Space>
                </div>
            </Form>
            <Table
                dataSource={data?.data?.filter(item => !!item.Measure)}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    pageSize: 20,
                    total: data?.totalSize,
                    pageSizeOptions: ['20'],
                    onChange(pageIndex, pageSize) {
                        setQueryParams((prev) => ({ ...prev, pageIndex, pageSize }))
                    },
                }}
            >
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
                <Table.Column
                    title="Actions"
                    dataIndex="id"
                    render={(id) => (
                        <Space size="middle">
                            <a href={`./details?id=${id}`}>Details</a>
                        </Space>
                    )}
                />
            </Table>
        </div>
    )
}