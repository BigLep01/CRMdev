import { GitHubBanner, Refine, Authenticated } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { AuthPage, RefineThemes, ThemedLayoutV2 } from "@refinedev/antd";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
    DocumentTitleHandler,
    UnsavedChangesNotifier,
    NavigateToResource,
    CatchAllNavigate,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import authProvider from "./authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { supabaseClient } from "./utility";

// Importation des composants et icônes
import { Dashboard } from "./pages/dashboard";
import { DashboardOutlined, LinkOutlined, ShopOutlined, TeamOutlined, ProjectOutlined } from "@ant-design/icons";

// Importation des composants de la ressource companies
import {
    CompanyList,
    CompanyCreate,
    CompanyEdit,
} from "./pages/companies"; // Assurez-vous que ces chemins sont corrects

// Importation des composants de la ressource contacts
import {
    ContactList,
    ContactCreate,
    ContactEdit,
    ContactShow,
} from "./pages/contacts"; // Assurez-vous que ces chemins sont corrects

// Importation des composants de la ressource kanban
import {
    KanbanList, // liste des tâches
    KanbanCreateTask, // création d'une tâche
    KanbanEditTask, // édition d'une tâche
    KanbanCreateStage, // création d'une étape (stage)
    KanbanEditStage, // édition d'une étape (stage)
} from "./pages/scrumboard/kanban"; // Assurez-vous que le chemin est correct

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <ConfigProvider theme={RefineThemes.Blue}>
                        <AntdApp>
                            <DevtoolsProvider>
                                <Refine
                                    notificationProvider={useNotificationProvider()}
                                    dataProvider={dataProvider(supabaseClient)}
                                    liveProvider={liveProvider(supabaseClient)}
                                    authProvider={authProvider}
                                    routerProvider={routerProvider}
                                    resources={[
                                        {
                                            name: "dashboard",
                                            list: "/dashboard",
                                            meta: {
                                                icon: <DashboardOutlined />,
                                            },
                                        },
                                        {
                                            name: "companies", // Ajout de la ressource companies
                                            list: "/companies",
                                            create: "/companies/create",
                                            edit: "/companies/edit/:id",
                                            show: "/companies/show/:id",
                                            meta: {
                                                icon: <ShopOutlined />, // Vous pouvez choisir un autre icône
                                            },
                                        },
                                        {
                                            name: "contacts", // Ajout de la ressource contacts
                                            list: "/contacts",
                                            create: "/contacts/create",
                                            edit: "/contacts/edit/:id",
                                            show: "/contacts/show/:id",
                                            meta: {
                                                icon: <TeamOutlined />, // Vous pouvez choisir un autre icône
                                            },
                                        },
                                        {
                                            name: "kanban", // Ajout de la ressource kanban
                                            list: "/kanban",
                                            create: "/kanban/create",
                                            edit: "/kanban/edit/:id",
                                            meta: {
                                                icon: <ProjectOutlined />, // Icône pour la ressource kanban
                                            },
                                        },
                                    ]}
                                    options={{
                                        syncWithLocation: true,
                                        warnWhenUnsavedChanges: true,
                                        useNewQueryKeys: true,
                                        projectId: "SGXzvo-BJFYa0-OYKciR",
                                    }}
                                >
                                    <Routes>
                                        {/* Authenticated Routes */}
                                        <Route
                                            element={
                                                <Authenticated key="authenticated-layout" fallback={<CatchAllNavigate to="/login" />}>
                                                    <ThemedLayoutV2>
                                                        <Outlet />
                                                    </ThemedLayoutV2>
                                                </Authenticated>
                                            }
                                        >
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route index element={<NavigateToResource resource="dashboard" />} />

                                            {/* Routes pour la ressource companies */}
                                            <Route path="/companies">
                                                <Route index element={<CompanyList />} />
                                                <Route path="create" element={<CompanyCreate />} />
                                                <Route path="edit/:id" element={<CompanyEdit />} />
                                            </Route>

                                            {/* Routes pour la ressource contacts */}
                                            <Route path="/contacts">
                                                <Route index element={<ContactList />} />
                                                <Route path="create" element={<ContactCreate />} />
                                                <Route path="edit/:id" element={<ContactEdit />} />
                                                <Route path="show/:id" element={<ContactShow />} />
                                            </Route>

                                            {/* Routes pour la ressource kanban */}
                                            <Route path="/kanban">
                                                <Route index element={<KanbanList />} /> {/* Liste des tâches du kanban */}
                                                <Route path="create" element={<KanbanCreateTask />} /> {/* Création d'une tâche */}
                                                <Route path="edit/:id" element={<KanbanEditTask />} /> {/* Édition d'une tâche */}
                                                <Route path="create-stage" element={<KanbanCreateStage />} /> {/* Création d'une étape */}
                                                <Route path="edit-stage/:id" element={<KanbanEditStage />} /> {/* Édition d'une étape */}
                                            </Route>
                                        </Route>

                                        {/* Authentication Pages */}
                                        <Route
                                            element={
                                                <Authenticated key="unauthenticated-layout" fallback={<Outlet />}>
                                                    <NavigateToResource />
                                                </Authenticated>
                                            }
                                        >
                                            <Route path="/login" element={<AuthPage />} />
                                            <Route path="/register" element={<AuthPage type="register" />} />
                                            <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                                            <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
                                        </Route>
                                    </Routes>
                                    <RefineKbar />
                                    <UnsavedChangesNotifier />
                                    <DocumentTitleHandler />
                                </Refine>
                                <DevtoolsPanel />
                            </DevtoolsProvider>
                        </AntdApp>
                    </ConfigProvider>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
