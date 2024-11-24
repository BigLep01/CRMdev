import { FC } from "react";
import { useParams } from "react-router-dom";

import { DeleteButton, useForm } from "@refinedev/antd";
import { useGetIdentity, useInvalidate, useList } from "@refinedev/core";
import { HttpError } from "@refinedev/core";

import { LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components/text";
import { CustomAvatar } from "@/components/custom-avatar";
import { TextIcon } from "@/components/icon/TempTextIcon";

import { supabaseClient } from "@/utility/supabaseClient";

// Types définis pour les données
type Props = {
  style?: React.CSSProperties;
};

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type CompanyNote = {
  id: string;
  note: string;
  companyId: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
};

export const CompanyNotes: FC<Props> = ({ style }) => {
  return (
    <Card
      bodyStyle={{
        padding: "0",
      }}
      headStyle={{
        borderBottom: "1px solid #D9D9D9",
      }}
      title={
        <Space size={16}>
          <TextIcon
            style={{
              width: "24px",
              height: "24px",
            }}
          />
          <Text>Notes</Text>
        </Space>
      }
      style={style}
    >
      <CompanyNoteForm />
      <CompanyNoteList />
    </Card>
  );
};

export const CompanyNoteForm = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const { data: me } = useGetIdentity<User>();

  const [form] = Form.useForm<{ note: string }>();

  const handleOnFinish = async (values: { note: string }) => {
    const note = values.note.trim();
    if (!note || !companyId) {
      console.error("Missing note or companyId");
      return;
    }

    if (!me || !me.id) {
      console.error("User identity not found or invalid");
      return;
    }

    try {
      const { error } = await supabaseClient
        .from("companynotes")
        .insert([{ note, companyId, createdBy: me.id }]);

      if (error) {
        console.error("Error creating note:", error);
        return;
      }

      form.resetFields();
    } catch (err) {
      console.error("Unexpected error while creating note:", err);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.submit();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "1rem",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <CustomAvatar style={{ flexShrink: 0 }} name={me?.name} src={me?.avatarUrl} />
      <Form form={form} onFinish={handleOnFinish} style={{ width: "100%" }}>
        <Form.Item
          name="note"
          noStyle
          rules={[
            {
              required: true,
              message: "Please enter a note",
              transform(value) {
                return value?.trim();
              },
            },
          ]}
        >
          <Input
            placeholder="Add your note"
            style={{ backgroundColor: "#fff" }}
            addonAfter={<LoadingOutlined />}
            onKeyDown={onKeyDown}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export const CompanyNoteList = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const invalidate = useInvalidate();

  const { data: notes } = useList<CompanyNote>({
    resource: "companynotes",
    filters: [{ field: "companyId", operator: "eq", value: companyId }],
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const { form, setId, id, saveButtonProps } = useForm<CompanyNote, HttpError>({
    resource: "companynotes",
    action: "edit",
    mutationMode: "optimistic",
    onMutationSuccess: () => {
      setId(undefined);
      invalidate({ resource: "companynotes", invalidates: ["list"] });
    },
    successNotification: {
      key: "company-update-note",
      message: "Successfully updated note",
      description: "Your note has been updated successfully.",
      type: "success",
    },
  });

  const { data: me } = useGetIdentity<User>();

  return (
    <Space
      size={16}
      direction="vertical"
      style={{
        borderRadius: "8px",
        backgroundColor: "#FAFAFA",
        padding: "1rem",
        width: "100%",
      }}
    >
      {notes?.data?.map((note) => {
        const isMe = me?.id === note.createdBy.id;

        return (
          <div key={note.id} style={{ display: "flex", gap: "12px" }}>
            <CustomAvatar name={note.createdBy.name} src={note.createdBy.avatarUrl} />

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>{note.createdBy.name}</Text>
                <Text size="xs">{dayjs(note.createdAt).format("MMM D, YYYY - h:ma")}</Text>
              </div>

              {id === note.id ? (
                <Form form={form} initialValues={{ note: note.note }}>
                  <Form.Item
                    name="note"
                    rules={[
                      {
                        required: true,
                        transform(value) {
                          return value?.trim();
                        },
                        message: "Please enter a note",
                      },
                    ]}
                  >
                    <Input.TextArea autoFocus required />
                  </Form.Item>
                </Form>
              ) : (
                <Typography.Paragraph
                  style={{
                    padding: "8px",
                    background: "#fff",
                    borderRadius: "6px",
                  }}
                  ellipsis={{ rows: 3, expandable: true }}
                >
                  {note.note}
                </Typography.Paragraph>
              )}

              {isMe && !id && (
                <Space size={16}>
                  <Typography.Link onClick={() => setId(note.id)}>Edit</Typography.Link>
                  <DeleteButton
                    resource="companynotes"
                    recordItemId={note.id}
                    successNotification={{
                      key: "company-delete-note",
                      message: "Note deleted",
                      description: "The note was deleted successfully.",
                      type: "success",
                    }}
                  />
                </Space>
              )}

              {id === note.id && (
                <Space>
                  <Button size="small" onClick={() => setId(undefined)}>
                    Cancel
                  </Button>
                  <Button size="small" type="primary" {...saveButtonProps}>
                    Save
                  </Button>
                </Space>
              )}
            </div>
          </div>
        );
      })}
    </Space>
  );
};
