import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, DatePicker } from "antd";

export const KanbanEditTask: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm({
        resource: "tasks", // Nom de la ressource dans Supabase
        action: "edit", // Action d'édition
        meta: {
            fields: [
                "id",
                "title",
                "description",
                "completed",
                "stage",
                "dueDate",
                "users", // Assurez-vous que la relation est correctement configurée
                "checklist",
            ],
        },
    });

    // Utilisation de la déstructuration sécurisée pour éviter les erreurs
    const data = queryResult?.data ?? null;
    const isLoading = queryResult?.isLoading ?? true;

    // Initialisation des valeurs du formulaire
    const initialValues = data?.data;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" initialValues={initialValues}>
                <Form.Item
                    label="Titre"
                    name={["title"]}
                    rules={[{ required: true, message: "Le titre est requis" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name={["description"]}>
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Statut" name={["completed"]} valuePropName="checked">
                    <Checkbox>Complété</Checkbox>
                </Form.Item>

                <Form.Item label="Phase" name={["stage"]}>
                    <Select
                        options={[
                            { label: "Backlog", value: "BACKLOG" },
                            { label: "En cours", value: "IN_PROGRESS" },
                            { label: "Terminé", value: "DONE" },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Date d'échéance" name={["dueDate"]}>
                    <DatePicker />
                </Form.Item>

                <Form.Item label="Utilisateurs" name={["users"]}>
                    <Select
                        mode="multiple"
                        labelInValue
                        options={(initialValues?.users || []).map((user: any) => ({
                            label: user.name,
                            value: user.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Checklist" name={["checklist"]}>
                    <Input.TextArea placeholder="Liste de vérification" />
                </Form.Item>
            </Form>
        </Edit>
    );
};
