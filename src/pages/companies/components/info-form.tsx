import { useState, useEffect } from "react";
import { supabaseClient } from "@/utility/supabaseClient";

import {
  ApiOutlined,
  BankOutlined,
  ColumnWidthOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Card, Input, InputNumber, Select, Space } from "antd";

import { SingleElementForm } from "@/components/single-element-form";
import { Text } from "@/components/text";
import { currencyNumber } from "@/utility";

type CompanySize = "ENTERPRISE" | "LARGE" | "MEDIUM" | "SMALL";
type Industry =
  | "AEROSPACE"
  | "AGRICULTURE"
  | "AUTOMOTIVE"
  | "CHEMICALS"
  | "CONSTRUCTION"
  | "DEFENSE"
  | "EDUCATION"
  | "ENERGY"
  | "FINANCIAL_SERVICES"
  | "FOOD_AND_BEVERAGE"
  | "GOVERNMENT"
  | "HEALTHCARE"
  | "HOSPITALITY"
  | "INDUSTRIAL_MANUFACTURING"
  | "INSURANCE"
  | "LIFE_SCIENCES"
  | "LOGISTICS"
  | "MEDIA"
  | "MINING"
  | "NONPROFIT"
  | "OTHER"
  | "PHARMACEUTICALS"
  | "PROFESSIONAL_SERVICES"
  | "REAL_ESTATE"
  | "RETAIL"
  | "TECHNOLOGY"
  | "TELECOMMUNICATIONS"
  | "TRANSPORTATION"
  | "UTILITIES";
type BusinessType = "B2B" | "B2C" | "B2G";

interface Company {
  totalRevenue?: number;
  industry?: Industry;
  companySize?: CompanySize;
  businessType?: BusinessType;
  country?: string;
  website?: string;
}

export const CompanyInfoForm = () => {
  const [activeForm, setActiveForm] = useState<
    | "totalRevenue"
    | "industry"
    | "companySize"
    | "businessType"
    | "country"
    | "website"
  >();
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les informations de la société à partir de Supabase
    const fetchCompanyInfo = async () => {
      const { data, error } = await supabaseClient
        .from("companies")
        .select("totalRevenue, industry, companySize, businessType, country, website")
        .single();
      if (error) {
        console.error("Error fetching company info:", error);
      } else {
        setCompanyData(data);
      }
      setLoading(false);
    };

    fetchCompanyInfo();
  }, []);

  const getActiveForm = (formName: keyof Company) => {
    if (activeForm === formName) {
      return "form";
    }
    if (!companyData?.[formName]) {
      return "empty";
    }
    return "view";
  };

  const {
    totalRevenue,
    industry,
    companySize,
    businessType,
    country,
    website,
  } = companyData || {};

  return (
    <Card
      title={
        <Space size={15}>
          <ShopOutlined className="sm" />
          <Text>Company info</Text>
        </Space>
      }
      headStyle={{
        padding: "1rem",
      }}
      bodyStyle={{
        padding: "0",
      }}
      style={{
        maxWidth: "500px",
      }}
    >
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<ColumnWidthOutlined className="tertiary" />}
        state={getActiveForm("companySize")}
        itemProps={{
          name: "companySize",
          label: "Company size",
        }}
        view={<Text>{companySize}</Text>}
        onClick={() => setActiveForm("companySize")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Select
          autoFocus
          defaultValue={companySize}
          options={companySizeOptions}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<DollarOutlined className="tertiary" />}
        state={getActiveForm("totalRevenue")}
        itemProps={{
          name: "totalRevenue",
          label: "Total revenue",
        }}
        view={<Text>{currencyNumber(totalRevenue || 0)}</Text>}
        onClick={() => setActiveForm("totalRevenue")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <InputNumber
          autoFocus
          addonBefore={"$"}
          min={0}
          placeholder="0,00"
          defaultValue={totalRevenue || 0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<BankOutlined className="tertiary" />}
        state={getActiveForm("industry")}
        itemProps={{
          name: "industry",
          label: "Industry",
        }}
        view={<Text>{industry}</Text>}
        onClick={() => setActiveForm("industry")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Select
          autoFocus
          defaultValue={industry}
          options={industryOptions}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<ApiOutlined className="tertiary" />}
        state={getActiveForm("businessType")}
        itemProps={{
          name: "businessType",
          label: "Business type",
        }}
        view={<Text>{businessType}</Text>}
        onClick={() => setActiveForm("businessType")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Select
          autoFocus
          defaultValue={businessType}
          options={businessTypeOptions}
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<EnvironmentOutlined className="tertiary" />}
        state={getActiveForm("country")}
        itemProps={{
          name: "country",
          label: "Country",
        }}
        view={<Text>{country}</Text>}
        onClick={() => setActiveForm("country")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={country || ""}
          placeholder="Country"
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
      <SingleElementForm
        loading={loading}
        style={{
          padding: "0.5rem 1rem",
        }}
        icon={<EnvironmentOutlined className="tertiary" />}
        state={getActiveForm("website")}
        itemProps={{
          name: "website",
          label: "Website",
        }}
        view={<Text>{website}</Text>}
        onClick={() => setActiveForm("website")}
        onUpdate={() => setActiveForm(undefined)}
        onCancel={() => setActiveForm(undefined)}
      >
        <Input
          autoFocus
          defaultValue={website || ""}
          placeholder="Website"
          style={{
            width: "100%",
          }}
        />
      </SingleElementForm>
    </Card>
  );
};

// Options for company size, industry, and business type
const companySizeOptions = [
  { label: "Enterprise", value: "ENTERPRISE" },
  { label: "Large", value: "LARGE" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Small", value: "SMALL" },
];

const industryOptions = [
  { label: "Aerospace", value: "AEROSPACE" },
  { label: "Agriculture", value: "AGRICULTURE" },
  // Ajoutez toutes les autres industries ici
];

const businessTypeOptions = [
  { label: "B2B", value: "B2B" },
  { label: "B2C", value: "B2C" },
  { label: "B2G", value: "B2G" },
];
