import { useState, useEffect } from "react";
import { supabaseClient } from "@/utility/supabaseClient";
import type { CrudFilters } from "@refinedev/core";

interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
}

export const useContactsSelect = (params?: { filters?: CrudFilters }) => {
  const { filters } = params || {};
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      let query = supabaseClient.from("contacts").select("id, name, avatarUrl");

      // Appliquer les filtres si nécessaire
      if (filters) {
        filters.forEach((filter) => {
          if (filter.operator === "eq") {
            query = query.eq(filter.field, filter.value);
          }
          // Ajouter d'autres opérateurs si nécessaire
        });
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setContacts(data || []);
      }

      setLoading(false);
    };

    fetchContacts();
  }, [filters]);

  return {
    contacts,
    loading,
    error,
    selectProps: {
      options: contacts.map((contact) => ({
        label: contact.name,
        value: contact.id,
        avatarUrl: contact.avatarUrl,
      })),
      loading,
    },
  };
};
