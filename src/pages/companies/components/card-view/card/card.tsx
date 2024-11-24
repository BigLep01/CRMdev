import { FC } from "react";
import { useDelete, useNavigation } from "@refinedev/core";
import { DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Space, Tooltip } from "antd";

import { Text } from "@/components/text";
import { CustomAvatar } from "@/components/custom-avatar";
import { currencyNumber } from "@/utility";
import { AvatarGroup } from "../../avatar-group";
import { CompanyCardSkeleton } from "./skeleton";

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type Contact = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type Company = {
  id: string;
  name: string;
  avatarUrl?: string;
  salesOwner?: User;
  contacts?: { nodes: Contact[] };
  dealsAggregate?: Array<{ sum: { value: number } }>;
};

type Props = {
  company: Company | null;
};

export const CompanyCard: FC<Props> = ({ company }) => {
  const { edit } = useNavigation();
  const { mutate } = useDelete();

  if (!company) return <CompanyCardSkeleton />;

  const relatedContactAvatars = company.contacts?.nodes?.map((contact) => ({
    name: contact.name,
    src: contact.avatarUrl || undefined,
  })) || [];

  const handleEdit = () => {
    if (company?.id) {
      edit("companies", company.id);
    }
  };

  const handleDelete = () => {
    if (company?.id) {
      mutate({
        resource: "companies",
        id: company.id,
        successNotification: {
          key: "company-delete",
          message: "Successfully deleted company",
          description: "The company has been removed.",
          type: "success",
        },
      });
    }
  };

  return (
    <Card
      size="small"
      actions={[
        <div
          key="1"
          style={{
            width: "100%",
            height: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "0 16px",
          }}
        >
          {/* Related contacts */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "6px",
            }}
          >
            <Text size="xs">Related contacts</Text>
            <AvatarGroup
              size="small"
              overlap
              gap="4px"
              avatars={relatedContactAvatars}
            />
          </div>
          {/* Sales owner */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
            }}
          >
            <Text size="xs">Sales owner</Text>
            <Tooltip title={company.salesOwner?.name} key={company.salesOwner?.id}>
              <CustomAvatar
                name={company.salesOwner?.name}
                src={company.salesOwner?.avatarUrl}
              />
            </Tooltip>
          </div>
        </div>,
      ]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Dropdown menu */}
        <Dropdown
          menu={{
            items: [
              {
                label: "View company",
                key: "1",
                icon: <EyeOutlined />,
                onClick: handleEdit,
              },
              {
                danger: true,
                label: "Delete company",
                key: "2",
                icon: <DeleteOutlined />,
                onClick: handleDelete,
              },
            ],
          }}
          placement="bottom"
          arrow
        >
          <Button
            type="text"
            shape="circle"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            icon={
              <MoreOutlined
                style={{
                  transform: "rotate(90deg)",
                }}
              />
            }
          />
        </Dropdown>

        {/* Company avatar */}
        <CustomAvatar
          name={company.name}
          src={company.avatarUrl}
          shape="square"
          style={{
            width: "48px",
            height: "48px",
          }}
        />

        {/* Company name */}
        <Text
          strong
          size="md"
          ellipsis={{ tooltip: company.name }}
          style={{
            marginTop: "12px",
          }}
        >
          {company.name}
        </Text>

        {/* Deals aggregate */}
        <Space
          direction="vertical"
          size={0}
          style={{
            marginTop: "8px",
            alignItems: "center",
          }}
        >
          <Text type="secondary">Open deals amount</Text>
          <Text
            strong
            size="md"
            style={{
              marginTop: "12px",
            }}
          >
            {currencyNumber(company.dealsAggregate?.[0]?.sum?.value || 0)}
          </Text>
        </Space>
      </div>
    </Card>
  );
};
