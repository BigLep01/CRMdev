import { useState, useEffect } from "react";
import { supabaseClient } from "@/utility/supabaseClient";

import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";

import { CustomAvatar } from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { getNameInitials } from "@/utility";

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Company {
  id: string;  // Assurez-vous que 'id' est dans l'interface 'Company'
  name: string;
  avatarUrl?: string;
  salesOwner?: User;
}

export const CompanyTitleForm = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les données de l'entreprise
  const fetchCompanyData = async () => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("companies")
      .select("id, name, avatarUrl, sales_owner_id:users (id, name, avatarUrl)")
      .single(); // Assurez-vous de récupérer l'entreprise avec son 'id'

    if (!error && data) {
      const formattedData: Company = {
        id: data.id, // Assurez-vous d'avoir 'id'
        name: data.name,
        avatarUrl: data.avatarUrl,
        salesOwner: Array.isArray(data.sales_owner_id) && data.sales_owner_id.length > 0 
          ? data.sales_owner_id[0]  // Prenez le premier utilisateur s'il y en a
          : undefined,
      };
      setCompany(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const onFinish = async (values: Partial<Company>) => {
    // Mettez à jour l'entreprise avec les valeurs envoyées par le formulaire
    if (company) {
      await supabaseClient.from("companies").update(values).eq("id", company.id);
      fetchCompanyData(); // Rafraîchit les données après la mise à jour
    }
  };

  return (
    <Form
      initialValues={company || {}}  // Assurez-vous qu'il y a une valeur par défaut si 'company' est null
      onFinish={(values) => onFinish(values)}
    >
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={company?.avatarUrl}
          name={getNameInitials(company?.name || "")}
          style={{
            width: 96,
            height: 96,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
        />
        <Space direction="vertical" size={0}>
          <Form.Item name="name" required noStyle>
            <TitleInput loading={loading} onChange={(value) => onFinish({ name: value })} />
          </Form.Item>
          <SalesOwnerInput
            salesOwner={company?.salesOwner}
            loading={loading}
            onChange={(value) => onFinish({ salesOwner: value })}  // Utilisez 'salesOwner' et non 'sales_owner_id'
          />
        </Space>
      </Space>
    </Form>
  );
};

// Définition de TitleInput
const TitleInput = ({
  value,
  onChange,
  loading,
}: {
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
}) => (
  <Text
    size="xl"
    strong
    editable={{
      onChange,
      triggerType: ["text", "icon"],
      icon: <EditOutlined />,
    }}
  >
    {loading ? <Skeleton.Input size="small" style={{ width: 200 }} active /> : value}
  </Text>
);

// Définition de SalesOwnerInput
const SalesOwnerInput = ({
  salesOwner,
  onChange,
  loading,
}: {
  onChange?: (value: User) => void;  // Changez ici pour accepter un objet User
  salesOwner?: User;
  loading?: boolean;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectLoading, setSelectLoading] = useState(false);

  const fetchUsers = async () => {
    setSelectLoading(true);
    const { data, error } = await supabaseClient.from("users").select("id, name, avatarUrl");
    if (!error) setUsers(data);
    setSelectLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (value: string) => {
    // Trouver l'utilisateur correspondant à l'ID
    const selectedUser = users.find((user) => user.id === value);
    if (selectedUser) {
      onChange?.(selectedUser);  // Passez l'objet User complet
    }
  };

  return (
    <div
      role="button"
      onClick={() => setIsEdit(true)}
    >
      <Text type="secondary" style={{ marginRight: 12 }}>
        Sales Owner:
      </Text>
      {loading && <Skeleton.Input size="small" style={{ width: 120 }} active />}
      {!isEdit && !loading && salesOwner && (
        <>
          <CustomAvatar size="small" src={salesOwner.avatarUrl} style={{ marginRight: 4 }} />
          <Text>{salesOwner.name}</Text>
          <Button type="link" icon={<EditOutlined />} />
        </>
      )}
      {isEdit && !loading && (
        <Form.Item name="salesOwnerId" noStyle>
          <Select
            loading={selectLoading}
            defaultOpen
            autoFocus
            onDropdownVisibleChange={(open) => {
              if (!open) setIsEdit(false);
            }}
            onClick={(e) => e.stopPropagation()}
            onChange={handleChange}  // Passez l'ID de l'utilisateur sélectionné
            options={users.map((user) => ({
              value: user.id,
              label: <Text>{user.name}</Text>,
            }))}
          />
        </Form.Item>
      )}
    </div>
  );
};
