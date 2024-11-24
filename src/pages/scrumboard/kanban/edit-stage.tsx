import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const KanbanEditStage: React.FC<IResourceComponentsProps> = () => {
    // Utilisation du hook useForm pour gérer le formulaire
    const { formProps, saveButtonProps } = useForm({
        meta: {
            fields: ["id", "title"], // Champs à récupérer depuis la base de données
        },
        resource: "taskStages", // Nom de la ressource dans Supabase
        action: "edit", // Action d'édition
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Titre"
                    name={["title"]}
                    rules={[{ required: true, message: "Le titre est requis" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    );
};
