import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const KanbanCreateStage: React.FC<IResourceComponentsProps> = () => {
    // Utilisation du hook useForm pour gérer le formulaire
    const { formProps, saveButtonProps } = useForm({
        resource: "taskStages", // Le nom de la ressource dans Supabase
        action: "create", // Action de création
        redirect: false, // Ne redirige pas automatiquement après la création
        onMutationSuccess: () => {
            // Actions à effectuer après une création réussie
            console.log("Stage créé avec succès !");
        },
        successNotification: () => ({
            key: "create-stage",
            type: "success",
            message: "Étape créée avec succès",
            description: "La nouvelle étape a été ajoutée au Kanban.",
        }),
        errorNotification: (error) => ({
            key: "create-stage-error",
            type: "error",
            message: "Erreur lors de la création de l'étape",
            // Vérification si error est défini
            description: error?.message || "Une erreur inconnue est survenue",
        }),
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Titre"
                    name={["title"]}
                    rules={[{ required: true, message: "Le titre est requis" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};
