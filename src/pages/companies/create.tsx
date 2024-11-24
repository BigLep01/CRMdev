import { FC, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography } from "antd";
import { DeleteOutlined, LeftOutlined, MailOutlined, PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { supabaseClient } from "@/utility/supabaseClient"; 
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { useGetToPath, useGo } from "@refinedev/core";

type Company = {
  id: string;
  name: string;
  sales_owner_id: string;
  avatarUrl?: string;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  salesOwnerId: string;
};

type Props = {
  isOverModal?: boolean;
};

type FormValues = {
  name: string;
  salesOwnerId: string;
  contacts?: { name: string; email: string }[];
};

export const CompanyCreate: FC<Props> = ({ isOverModal }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const go = useGo();

  const [form] = Form.useForm<FormValues>();
  const { selectProps, queryResult } = useUsersSelect();

  const handleCreateCompany = async (values: FormValues) => {
    try {
      const { data: companyData, error: companyError } = await supabaseClient
        .from("companies")
        .insert([{ name: values.name, sales_owner_id: values.salesOwnerId }])
        .select("id, avatarUrl")
        .single();

      if (companyError || !companyData) throw new Error("Échec de la création de l'entreprise.");

      const companyId = companyData.id;

      if (values.contacts && values.contacts.length > 0) {
        const contactPromises = values.contacts.map((contact) =>
          supabaseClient.from("contacts").insert({
            name: contact.name,
            email: contact.email,
            id: companyId,
            sales_owner_id: values.salesOwnerId,
          })
        );
        await Promise.all(contactPromises);
      }

      setIsModalVisible(false); // Ferme le modal après la création

      go({
        to: searchParams.get("to") ?? pathname,
        query: { id: companyId },
        options: { keepQuery: true },
        type: "replace",
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'entreprise ou des contacts:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }),
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  return (
    <Modal
      visible={isModalVisible}
      mask={!isOverModal}
      onCancel={handleCancel}
      title="Ajouter une nouvelle entreprise"
      width={512}
      closeIcon={<LeftOutlined />}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleCreateCompany}>
        <Form.Item label="Nom de l'entreprise" name="name" rules={[{ required: true }]}>
          <Input placeholder="Entrez le nom de l'entreprise" />
        </Form.Item>
        <Form.Item label="Responsable des ventes" name="salesOwnerId" rules={[{ required: true }]}>
          <Select placeholder="Sélectionnez un responsable" allowClear {...selectProps}>
            {queryResult.data?.data?.map((user) => (
              <Select.Option value={user.id} key={user.id}>
                <SelectOptionWithAvatar name={user.name} avatarUrl={user.avatarUrl ?? undefined} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="contacts">
          {(fields, { add, remove }) => (
            <Space direction="vertical">
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={12} align="middle">
                  <Col span={11}>
                    <Form.Item {...restField} name={[name, "name"]} rules={[{ required: true }]}>
                      <Input addonBefore={<UserOutlined />} placeholder="Nom du contact" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item {...restField} name={[name, "email"]} rules={[{ required: true, type: "email" }]}>
                      <Input addonBefore={<MailOutlined />} placeholder="Email du contact" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Typography.Link onClick={() => add()}>
                <PlusCircleOutlined /> Ajouter un contact
              </Typography.Link>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
