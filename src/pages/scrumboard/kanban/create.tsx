import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useSearchParams } from "react-router-dom";

export const KanbanCreateTask: React.FC<IResourceComponentsProps> = () => {
    const [searchParams] = useSearchParams(); // Récupère les paramètres de l'URL, comme `stageId`
    const { formProps, saveButtonProps } = useForm(); // Utilisation du hook useForm

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                layout="vertical"
                onFinish={(values) => {
                    // Ajout du stageId aux valeurs du formulaire si disponible
                    formProps?.onFinish?.({
                        ...values,
                        stageId: searchParams.get("stageId")
                            ? Number(searchParams.get("stageId"))
                            : null,
                        userIds: [], // Ajouter les userIds si nécessaire
                    });
                }}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Le titre est requis" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};
