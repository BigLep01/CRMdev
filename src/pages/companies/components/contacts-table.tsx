import React, { useEffect, useState } from "react";
import { Table, Spin, Typography } from "antd";
import { supabaseClient } from "@/utility/supabaseClient";

// Interfaces
interface Contact {
  id: string;
  name: string;
  email: string;
}

interface ContactsTableProps {
  id: string; // La prop `companyId` est explicitement définie ici
}

// Fonction pour récupérer les contacts d'une entreprise
export const fetchCompanyContacts = async (companyId: string): Promise<Contact[]> => {
  const { data, error } = await supabaseClient
    .from("contacts")
    .select("id, name, email")
    .eq("id", companyId);

  if (error) {
    throw new Error("Erreur lors de la récupération des contacts: " + error.message);
  }

  return data || [];
};

// Composant React pour afficher les contacts
export const CompanyContactsTable: React.FC<ContactsTableProps> = ({ id }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const fetchedContacts = await fetchCompanyContacts(id);
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [id]);

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <Spin size="large" />
        <Typography.Text>Chargement des contacts...</Typography.Text>
      </div>
    );
  }

  return (
    <Table
      dataSource={contacts}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
    />
  );
};
