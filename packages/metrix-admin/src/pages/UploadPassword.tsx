import { Input, Result, Spin } from 'antd'
import useSWR from 'swr'

export function UploadPassword() {
    const { data, isLoading } = useSWR<{ password: string }>('/api/dashboard/upload-password', { refreshInterval: 1000 })
    return (
        <Spin spinning={isLoading}>
            <Result>
                <Input disabled value={data?.password} />
            </Result>
        </Spin>
    )
}