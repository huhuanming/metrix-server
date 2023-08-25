import useSWRMutation from 'swr/mutation'
import { Button, Form, Input, Layout, Spin } from "antd"

type FieldType = {
    username?: string;
    password?: string;
};

const loginFetcher = async (url: string, { arg }: { arg: FieldType} ) => {
    return fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

export const Login = () => {
    const { trigger, isMutating } = useSWRMutation('/api/login', loginFetcher);

    return (
        <Layout style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
                 style={{ width: 400 }}
            >
                <Spin
                    spinning={isMutating}
                >
                    <Form
                        name="basic"
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{}}
                        onFinish={async (body: FieldType) => {
                            const result = await trigger(body)
                            if (result.success) {
                                window.location.href = '/dashboard'
                            }
                        }}
                        onFinishFailed={() => {

                        }}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input placeholder="UserName" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </Layout>
    )
}