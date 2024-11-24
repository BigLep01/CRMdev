import { FC } from "react";
import { Table } from "antd";
import { DeleteButton, EditButton } from "@refinedev/antd";
import { EyeOutlined } from "@ant-design/icons";

import { CustomAvatar } from "@/components/custom-avatar";
import { AvatarGroup } from "./avatar-group";

interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Company {
  id: string;
  name: string;
  avatarUrl?: string;
  salesOwner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  totalRevenue?: number;
  contacts?: Contact[]; // Contacts typés pour uniformité
}

type Props = {
  data: Company[];
  total: number;
  loading: boolean;
};

export const CompaniesTableView: FC<Props> = ({ data, total, loading }) => {
  return (
    <Table
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        total,
        pageSizeOptions: ["10", "20", "50"],
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} companies`,
      }}
    >
      {/* Column: Company Name */}
      <Table.Column<Company>
        title="Company Name"
        dataIndex="name"
        key="name"
        render={(name, record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CustomAvatar
              shape="square"
              name={record.name}
              src={record.avatarUrl}
            />
            <span style={{ marginLeft: "8px" }}>{name}</span>
          </div>
        )}
      />

      {/* Column: Sales Owner */}
      <Table.Column<Company>
        title="Sales Owner"
        dataIndex="salesOwner"
        key="salesOwner"
        render={(salesOwner) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CustomAvatar
              name={salesOwner?.name}
              src={salesOwner?.avatarUrl}
            />
            <span style={{ marginLeft: "8px" }}>{salesOwner?.name || "N/A"}</span>
          </div>
        )}
      />

      {/* Column: Total Revenue */}
      <Table.Column<Company>
        title="Open Deals Amount"
        dataIndex="totalRevenue"
        key="totalRevenue"
        render={(value) => `$${value ? value.toLocaleString() : "0"}`}
      />

      {/* Column: Related Contacts */}
      <Table.Column<Company>
        title="Related Contacts"
        dataIndex="contacts"
        key="contacts"
        render={(contacts) => (
          <AvatarGroup
            avatars={
              contacts?.map((contact: Contact) => ({
                name: contact.name,
                src: contact.avatarUrl,
              })) || []
            }
            size="small"
          />
        )}
      />

      {/* Column: Actions */}
      <Table.Column<Company>
        title="Actions"
        dataIndex="id"
        key="actions"
        render={(id) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <EditButton
              recordItemId={id}
              icon={<EyeOutlined />}
              size="small"
              hideText
            />
            <DeleteButton recordItemId={id} size="small" hideText />
          </div>
        )}
      />
    </Table>
  );
};
