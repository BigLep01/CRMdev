import { FC, useEffect, useState } from "react";
import { Table, Spin, Button, Row, Col } from "antd";
import { DeleteButton, EditButton } from "@refinedev/antd";
import { EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { CustomAvatar } from "@/components/custom-avatar";
import { AvatarGroup } from "./components";
import { supabaseClient } from "@/utility/supabaseClient";

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
  contacts?: {
    nodes: Contact[];
  };
}

const CompanyList: FC = () => {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const navigate = useNavigate(); // Utilisation de navigate pour rediriger vers la page de création

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data: companies, error, count } = await supabaseClient
        .from("companies")
        .select(
          `
          id,
          name,
          companySize,
          country,
          website,
          created_at,
          updated_at,
          sales_owner_id:users!companies_sales_owner_id_fkey (id, name, avatarUrl),
          avatarUrl,
          contacts:contacts (
            id,
            name,
            avatarUrl
          )
        `,
          { count: "exact" }
        );

      if (error) {
        console.error("Erreur lors de la récupération des entreprises :", error);
        return;
      }

      setData(
        companies?.map((company: any) => ({
          id: company.id,
          name: company.name,
          avatarUrl: company.avatarUrl,
          salesOwner: company.sales_owner_id,
          totalRevenue: company.totalRevenue,
          contacts: {
            nodes: company.contacts || [],
          },
        })) || []
      );
      setTotal(count || 0);
    } catch (error) {
      console.error("Erreur inattendue :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <Spin spinning={loading}>
      {/* Ajout d'une rangée avec le bouton "Add new company" */}
      <Row style={{ marginBottom: "16px" }} align="middle" justify="space-between">
        <Col>
          <h2>Companies</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => navigate("/companies/create")} // Redirection vers la page de création
          >
            Add new company
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={data}
        rowKey="id"
        pagination={{
          total,
          pageSizeOptions: ["10", "20", "50"],
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} companies`,
        }}
      >
        <Table.Column<Company>
          title="Company Name"
          dataIndex="name"
          key="name"
          render={(name, record) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <CustomAvatar shape="square" name={record.name} src={record.avatarUrl} />
              <span style={{ marginLeft: "8px" }}>{name}</span>
            </div>
          )}
        />

        <Table.Column<Company>
          title="Sales Owner"
          dataIndex="salesOwner"
          key="salesOwner"
          render={(salesOwner) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <CustomAvatar name={salesOwner?.name} src={salesOwner?.avatarUrl} />
              <span style={{ marginLeft: "8px" }}>{salesOwner?.name || "N/A"}</span>
            </div>
          )}
        />

        <Table.Column<Company>
          title="Open Deals Amount"
          dataIndex="totalRevenue"
          key="totalRevenue"
          render={(value) => `$${value ? value.toLocaleString() : "0"}`}
        />

        <Table.Column<Company>
          title="Related Contacts"
          dataIndex="contacts"
          key="contacts"
          render={(contacts) => (
            <AvatarGroup
              avatars={
                contacts?.nodes?.map((contact: Contact) => ({
                  name: contact.name,
                  src: contact.avatarUrl,
                })) || []
              }
              size="small"
            />
          )}
        />

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
    </Spin>
  );
};

export default CompanyList;
export { CompanyList };
