import { FC, useMemo } from "react";
import { List } from "antd";
import { CompanyCard, CompanyCardSkeleton } from "./card";

interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Company {
  id: string;
  name: string;
  avatarUrl?: string;
  salesOwner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  contacts?: {
    nodes: Contact[];
  };
}

type Props = {
  data: Company[];
  total: number;
  loading: boolean;
  setCurrent: (current: number) => void;
  setPageSize: (pageSize: number) => void;
};

export const CompaniesCardView: FC<Props> = ({
  data,
  total,
  loading,
  setCurrent,
  setPageSize,
}) => {
  // Transforme les données pour garantir une structure uniforme
  const companies = useMemo(() => {
    return data.map((company) => ({
      ...company,
      contacts: {
        nodes: company.contacts?.nodes || [], // Assure une structure uniforme pour les contacts
      },
    }));
  }, [data]);

  const gridConfig = {
    gutter: 32,
    column: 4,
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 4,
  };

  return (
    <div>
      {/* Loader avec des Skeletons */}
      {loading ? (
        <List
          grid={gridConfig}
          dataSource={Array.from({ length: 12 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => (
            <List.Item>
              <CompanyCardSkeleton />
            </List.Item>
          )}
        />
      ) : (
        <List
          grid={gridConfig}
          dataSource={companies}
          renderItem={(company) => (
            <List.Item>
              <CompanyCard company={company} />
            </List.Item>
          )}
          pagination={{
            total,
            pageSizeOptions: ["12", "24", "48"],
            showSizeChanger: true,
            defaultPageSize: 12,
            onChange: (page, pageSize) => {
              setCurrent(page);
              setPageSize(pageSize);
            },
            showTotal: (total) => `Total ${total} companies`,
          }}
        />
      )}
    </div>
  );
};
