import { FC, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { FilterDropdown, ShowButton, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import {
  ContainerOutlined,
  ExportOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";

import { Participants } from "@/components/participants";
import { Text } from "@/components/text";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utility";

import { Tag } from "antd";

type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED";

interface QuoteStatusTagProps {
  status: QuoteStatus;
}

export const QuoteStatusTag: React.FC<QuoteStatusTagProps> = ({ status }) => {
  const color = status === "DRAFT" ? "blue" : status === "SENT" ? "orange" : "green";
  const label = status.charAt(0) + status.slice(1).toLowerCase(); // Affiche "Draft", "Sent", etc.

  return <Tag color={color}>{label}</Tag>;
};

type Props = {
  style?: React.CSSProperties;
};

type Quote = {
  id: string;
  title: string;
  total: number;
  status: QuoteStatus;
  sales_owner_id: string;
  salesOwner: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  contact: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  updatedAt: string;
};

export const CompanyQuotesTable: FC<Props> = ({ style }) => {
  const { listUrl } = useNavigation();
  const params = useParams<{ id: string }>();

  const { tableProps, filters, setFilters } = useTable<Quote>({
    resource: "quotes",
    syncWithLocation: false,
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "title",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "company_id",
          operator: "eq",
          value: params.id,
        },
      ],
    },
  });

  const { selectProps: selectPropsUsers } = useUsersSelect();

  const showResetFilters = useMemo(() => {
    return filters?.filter((filter) => {
      if ("field" in filter && filter.field === "company_id") {
        return false;
      }
      if (!filter.value) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const hasData = (tableProps?.dataSource?.length || 0) > 0;

  return (
    <Card
      style={style}
      headStyle={{
        borderBottom: "1px solid #D9D9D9",
        marginBottom: "1px",
      }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          <ContainerOutlined />
          <Text>Quotes</Text>
          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        </Space>
      }
    >
      {!hasData && (
        <Space
          direction="vertical"
          size={16}
          style={{
            padding: 16,
          }}
        >
          <Text>No quotes yet</Text>
          <Link to={listUrl("quotes")}>
            <PlusCircleOutlined
              style={{
                marginRight: 4,
              }}
            />{" "}
            Add quotes
          </Link>
        </Space>
      )}
      {hasData && (
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false,
          }}
        >
          <Table.Column
            title="Quote Title"
            dataIndex="title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<Quote>
            title="Total amount"
            dataIndex="total"
            sorter
            render={(_, record) => {
              return <Text>{currencyNumber(record.total || 0)}</Text>;
            }}
          />
          <Table.Column<Quote>
            title="Stage"
            dataIndex="status"
            render={(_, record) => {
              if (!record.status) return null;
              return <QuoteStatusTag status={record.status} />;
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                  options={statusOptions}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Quote>
            dataIndex="sales_owner_id"
            title="Participants"
            render={(_, record) => {
              return (
                <Participants
                  userOne={record.salesOwner}
                  userTwo={record.contact}
                />
              );
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  placeholder="Select Sales Owner"
                  {...selectPropsUsers}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Quote>
            dataIndex="id"
            width={48}
            render={(value) => {
              return (
                <ShowButton
                  recordItemId={value}
                  hideText
                  size="small"
                  resource="quotes"
                  icon={<ExportOutlined />}
                />
              );
            }}
          />
        </Table>
      )}
    </Card>
  );
};

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Accepted", value: "ACCEPTED" },
];
