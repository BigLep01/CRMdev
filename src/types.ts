export interface Contact {
    id: string;
    name: string;
    avatarUrl?: string;
  }
  
  export interface Company {
    id: string;
    name: string;
    avatarUrl?: string;
    salesOwner?: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
    contacts: Contact[]; // Toujours un tableau, pas de structure "nodes"
  }
  