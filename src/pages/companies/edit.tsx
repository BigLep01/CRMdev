import { Col, Row } from "antd";
import { useParams } from "react-router-dom";

import {
  CompanyContactsTable,
  CompanyDealsTable,
  CompanyInfoForm,
  CompanyNotes,
  CompanyQuotesTable,
  CompanyTitleForm,
} from "./components";

export const CompanyEdit = () => {
  // Supposons que companyId est passé en tant que paramètre d'URL
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Erreur : ID de l'entreprise non trouvé</div>;
  }

  return (
    <div className="page-container">
      <CompanyTitleForm />
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: 32,
        }}
      >
        <Col span={16}>
          <CompanyContactsTable id={id} />
          <CompanyDealsTable
            style={{
              marginTop: 32,
            }}
          />
          <CompanyQuotesTable
            style={{
              marginTop: 32,
            }}
          />
          <CompanyNotes
            style={{
              marginTop: 32,
            }}
          />
        </Col>
        <Col span={8}>
          <CompanyInfoForm />
        </Col>
      </Row>
    </div>
  );
};
