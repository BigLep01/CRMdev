import { Row, Col } from "antd";
import { MetricCard as DashboardMetricCard } from "../../components/metricCard/dashboard";

export const Dashboard = () => {
    return (
        <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} xl={8}>
                <DashboardMetricCard variant="companies" /> 
            </Col>
            <Col xs={24} sm={24} xl={8}>
                <DashboardMetricCard variant="contacts" /> 
            </Col>
        </Row>
    );
};
