import { FC, useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { EditButton, FilterDropdown, useTable } from "@refinedev/antd";
import { useNavigation, useOne } from "@refinedev/core";

import {
  AuditOutlined,
  ExportOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Skeleton, Space, Table, Tag } from "antd";

import { Participants } from "@/components/participants";
import { Text } from "@/components/text";
import { useDealStagesSelect } from "@/hooks/useDealStagesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utility";
import { supabaseClient } from "@/utility/supabaseClient";

type Props = {
  style?: React.CSSProperties;
};

type Deal = {
  id: string;
  title: string;
  value: number;
  stage: {
    id: string;
    title: string;
  };
  dealOwnerId: string;
  dealOwner: {
    id: string;
    name: string;
  };
  dealContact: {
    id: string;
    name: string;
  };
  updatedAt: string;
};

export const CompanyDealsTable: FC<Props> = ({ style }) => {
  const { listUrl } = useNavigation();
  const params = useParams<{ id: string }>();

  const { tableProps, filters, setFilters } = useTable<Deal>({
    resource: "deals",
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
          field: "stage.id",
          value: "",
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "companyId",
          operator: "eq",
          value: params.id,
        },
      ],
    },
  });

  const fetchTotalDealAmount = async (companyId: string) => {
    const { data, error } = await supabaseClient
      .from("deals")
      .select("value")
      .eq("companyId", companyId);

    if (error) {
      console.error("Error fetching total deal amount:", error);
      return 0;
    }

    return data.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const [totalDealAmount, setTotalDealAmount] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchTotalDealAmount(params.id).then((amount) => setTotalDealAmount(amount));
    }
  }, [params.id]);

  const { selectProps: usersSelectProps } = useUsersSelect();
  const { selectProps: dealStagesSelectProps } = useDealStagesSelect();

  const hasData = tableProps.loading
    ? true
    : (tableProps?.dataSource?.length || 0) > 0;

  const showResetFilters = useMemo(() => {
    return filters?.filter((filter) => {
      if ("field" in filter && filter.field === "companyId") {
        return false;
      }

      if (!filter.value) {
        return false;
      }

      return true;
    });
  }, [filters]);

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
          <AuditOutlined />
          <Text>Deals</Text>

          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">Total deal amount: </Text>
          {totalDealAmount === null ? (
            <Skeleton.Input active size="small" />
          ) : (
            <Text strong>{currencyNumber(totalDealAmount)}</Text>
          )}
        </>
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
          <Text>No deals yet</Text>
          <Link to={listUrl("deals")}>
            <PlusCircleOutlined
              style={{
                marginRight: 4,
              }}
            />{" "}
            Add deals through sales pipeline
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
            title="Deal Title"
            dataIndex="title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<Deal>
            title="Deal amount"
            dataIndex="value"
            sorter
            render={(_, record) => {
              return <Text>{currencyNumber(record.value || 0)}</Text>;
            }}
          />
          <Table.Column<Deal>
            title="Stage"
            dataIndex={["stage", "id"]}
            render={(_, record) => {
              if (!record.stage) return null;

              return <Tag>{record.stage.title}</Tag>;
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  {...dealStagesSelectProps}
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Deal>
            dataIndex={["dealOwnerId"]}
            title="Participants"
            render={(_, record) => {
              return (
                <Participants
                  userOne={record.dealOwner}
                  userTwo={record.dealContact}
                />
              );
            }}
            filterDropdown={(props) => {
              return (
                <FilterDropdown {...props}>
                  <Select
                    style={{ width: "200px" }}
                    placeholder="Select Sales Owner"
                    {...usersSelectProps}
                  />
                </FilterDropdown>
              );
            }}
          />
          <Table.Column<Deal>
            dataIndex="id"
            width={48}
            render={(value) => {
              return (
                <EditButton
                  recordItemId={value}
                  hideText
                  size="small"
                  resource="deals"
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
