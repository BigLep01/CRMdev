import React from "react";
import { IResourceComponentsProps, BaseRecord, useMany } from "@refinedev/core";
import { useTable, List, EditButton, DeleteButton, TextField } from "@refinedev/antd";
import { Table, Space, Form, Input, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";

export const KanbanList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, searchFormProps } = useTable({
        meta: {
            fields: [
                "id",
                "title",
                "stage",
                "dueDate",
                "completed",
                { stage: ["id", "title"] },
                { assignedUsers: ["id", "name"] },
            ],
        },
        onSearch: (params: { title: string }) => [
            {
                field: "title",
                operator: "contains",
                value: params.title,
            },
        ],
    });

    // Pour récupérer les utilisateurs assignés
    const { data: assignedUsersData } = useMany({
        resource: "users",
        ids: (tableProps?.dataSource?.map((item) => item.assignedUsers)?.flat() ?? []) as string[],
        queryOptions: {
            enabled: !!tableProps?.dataSource,
        },
    });

    const navigate = useNavigate();

    return (
        <List
            headerButtons={({ defaultButtons }) => (
                <>
                    <Form
                        {...searchFormProps}
                        layout="inline"
                        onValuesChange={() => {
                            searchFormProps.form?.submit();
                        }}
                    >
                        <Form.Item name="title">
                            <Input.Search placeholder="Search by title" />
                        </Form.Item>
                    </Form>
                    {defaultButtons}
                    <Button type="primary" onClick={() => navigate("/kanban/create")}>
                        Add Task
                    </Button>
                </>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Title"
                    dataIndex="title"
                    render={(value) => <TextField value={value} />}
                />
                <Table.Column
                    title="Stage"
                    dataIndex={["stage", "title"]}
                    render={(value) => <TextField value={value} />}
                />
                <Table.Column
                    title="Due Date"
                    dataIndex="dueDate"
                    render={(value) => (value ? new Date(value).toLocaleDateString() : "-")}
                />
                <Table.Column
                    title="Completed"
                    dataIndex="completed"
                    render={(value) => (
                        <Tag color={value ? "green" : "red"}>
                            {value ? "Completed" : "Pending"}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Assigned Users"
                    dataIndex="assignedUsers"
                    render={(assignedUsers) =>
                        assignedUsers?.map((userId: string) => {
                            const user = assignedUsersData?.data?.find((u) => u.id === userId);
                            return user ? <Tag key={user.id}>{user.name}</Tag> : null;
                        }) ?? "-"
                    }
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
