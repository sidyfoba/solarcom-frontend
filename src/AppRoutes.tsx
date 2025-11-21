import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Alarm } from "@mui/icons-material";
import { useState } from "react";
import Accounts from "./apps/admin/Accounts";
import AddUser from "./apps/admin/AddUser";
import AdminDashboard from "./apps/admin/AdminDashboard";
import Configs from "./apps/admin/Configs";
import ProjectEdit from "./apps/admin/ProjectEdit";
import ProjectForm from "./apps/admin/ProjectForm";
import ProjectList from "./apps/admin/ProjectList";
import SiteCreate from "./apps/admin/sites/SiteCreate";
import SiteTemplate from "./apps/admin/SiteCreateTemplateFromScratch";
import SiteEditTemplate from "./apps/admin/sites/SiteEditTemplate";
import SitesDataGrid from "./apps/admin/sites/SitesList";
import SiteTemplatesList from "./apps/admin/sites/SiteTemplatesList";
import TemplateCreation from "./apps/admin/TemplateCreation";
import UserDetails from "./apps/admin/UserDetails";
import AnadexApp from "./apps/anadex/AnadexApp";
import ClearedAlarms from "./apps/incidex/pages/ClearedAlarms";
import EditAlarm from "./apps/incidex/pages/EditAlarm";
import NewAlarms from "./apps/incidex/pages/NewAlarms";
import SiteView from "./apps/incidex/pages/SiteView";
import UpdateAlarms from "./apps/incidex/pages/UpdateAlarms";
import ViewAlarm from "./apps/incidex/pages/ViewAlarm";
import EmailEditor from "./apps/incidex/test/EmailEditor";
import ExcelDataGrid from "./apps/incidex/test/ExcelDataGrid";
import FileInput from "./apps/incidex/test/FileInput";
import RetrieveEmails from "./apps/incidex/test/RetrieveEmails";
import ItMobileApp from "./apps/it-mobile/ItMobileApp";
import PbrApp from "./apps/pbr/PbrApp";
import CentralOne from "./entrypoint/central-point";
import SiteCreateTemplate from "./apps/admin/sites/SiteCreateTemplate";
import SitesList from "./apps/admin/sites/SitesList";
import ElementCreateTemplate from "./apps/admin/site-elements/ElementCreateTemplate";
import ElementTemplatesList from "./apps/admin/site-elements/ElementTemplatesList";
import ElementEditTemplate from "./apps/admin/site-elements/ElementEditTemplate";
import ElementCreate from "./apps/admin/site-elements/ElementCreate";
import ElementsList from "./apps/admin/site-elements/ElementsList";
import SiteEdit from "./apps/admin/sites/SiteEdit";
import ElementEdit from "./apps/admin/site-elements/ElementEdit";
import Test from "./apps/admin/test/Test";
import TicketCreationForm from "./apps/admin/tickets/back-up/TicketCreationForm";
import TicketList from "./apps/admin/tickets/Tickets";
import TicketEditForm from "./apps/admin/tickets/back-up/TicketEditForm";
import TaskCreationForm from "./apps/admin/tasks/TaskCreationForm";
import TaskList from "./apps/admin/tasks/TaskList";
import TaskEditForm from "./apps/admin/tasks/TaskEditForm";
import TaskGraph from "./apps/admin/test/TaskGraph";
import TaskTree from "./apps/admin/test/TaskTree";
import TaskFlow from "./apps/admin/test/TaskTree";
import TaksCalendar from "./apps/admin/tasks/TaksCalendar";
import TaskTimeline from "./apps/admin/tasks/TaskTimeline";
import EmployeeForm from "./apps/admin/employees/EmployeeForm";
import EmployeesList from "./apps/admin/employees/EmployeesList";
import EmployeeFormNew from "./apps/admin/employees/EmployeeFormNew_not_used";
import EmployeeFormTest from "./apps/admin/test/EmployeeFormTest";
import EditEmployee from "./apps/admin/employees/EditEmployee";
import JobPositionList from "./apps/admin/employees/JobPositionList";
import NestedMenu, { NestedMenuItemPage } from "./apps/admin/test/NestedMenu";
import NestedList from "./apps/admin/test/NestedMenu";
import TeamList from "./apps/admin/team/TeamList";
import TicketCreateTemplate from "./apps/admin/tickets/TicketCreateTemplate";
import TroubleTicketTemplatesList from "./apps/admin/tickets/TicketTemplatesList";
import TroubleTicketEditTemplate from "./apps/admin/tickets/TicketEditTemplate";
import TicketTemplatesList from "./apps/admin/tickets/TicketTemplatesList";
import TicketEditTemplate from "./apps/admin/tickets/TicketEditTemplate";
import TicketCreateFromTemplate from "./apps/admin/tickets/CreateTicket";

import TicketEdit from "./apps/admin/tickets/EditTicket";
import TicketsByTemp from "./apps/admin/tickets/TicketsByTemp";
import Tickets from "./apps/admin/tickets/Tickets";
import EditTicket from "./apps/admin/tickets/EditTicket";
import CreateTicket from "./apps/admin/tickets/CreateTicket";
import { CustomersPage } from "./apps/admin/pages/CustomersPage";
import { UsersPage } from "./apps/admin/pages/UsersPage";
import { RolesPage } from "./apps/admin/pages/RolesPage";
import { PermissionsPage } from "./apps/admin/pages/PermissionsPage";
import { AssignUserRolePage } from "./apps/admin/pages/AssignUserRolePage";
import { LoginPage } from "./apps/admin/pages/LoginPage";

const AppRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/inscription" element={<SignUp />} /> */}
          {/* <Route
            path="/login"
            element={
              <SignIn setIsLoggedIn={setIsLoggedIn} setRoles={setRoles} />
            }
          /> */}
          {/* <Route
            path="/admin"
            element={
              isLoggedIn ? (
                <AdminDashboard roles={roles} />
              ) : (
                <Navigate to="/" />
              )
            }
          /> */}
          <Route path="/" element={<AdminDashboard roles={roles} />} />
          <Route path="/admin" element={<AdminDashboard roles={roles} />} />
          <Route path="/admin/user" element={<AddUser />} />
          <Route path="/admin/configurations" element={<Configs />} />
          {/* <project> */}
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/edit/:id" element={<ProjectEdit />} />
          {/* <template> */}
          {/* <Route
            path="/admin/projects/site/template/new"
            element={<SiteTemplate />}
          /> */}
          <Route
            path="/admin/projects/site/template/create"
            element={<SiteCreateTemplate />}
          />
          <Route
            path="/admin/projects/site/template/all"
            element={<SiteTemplatesList />}
          />
          <Route
            path="/admin/projects/site/template/edit/:id"
            element={<SiteEditTemplate />}
          />
          <Route path="/admin/projects/site/create" element={<SiteCreate />} />
          <Route
            path="/admin/projects/site/template/sites/all"
            element={<SitesList />}
          />
          <Route
            path="/admin/projects/site/edit-site/:id"
            element={<SiteEdit />}
          />
          {/* <element template /> */}
          <Route
            path="/admin/projects/element/template/creation"
            element={<ElementCreateTemplate />}
          />
          <Route
            path="/admin/projects/element/template/all"
            element={<ElementTemplatesList />}
          />
          <Route
            path="/admin/projects/element/template/edit/:id"
            element={<ElementEditTemplate />}
          />
          <Route
            path="/admin/projects/element/create"
            element={<ElementCreate />}
          />
          <Route
            path="/admin/projects/element/template/elements/all"
            element={<ElementsList />}
          />
          <Route
            path="/admin/projects/element/edit-element/:id"
            element={<ElementEdit />}
          />
          {/* trouble ticket tempplate */}
          <Route
            path="/admin/projects/ticket/template/creation"
            element={<TicketCreateTemplate />}
          />
          <Route
            path="/admin/projects/ticket/template/all"
            element={<TicketTemplatesList />}
          />
          <Route
            path="/admin/projects/ticket/template/edit/:id"
            element={<TicketEditTemplate />}
          />
          {/* ticket */}
          <Route
            path="/admin/projects/ticket/template/create-ticket"
            element={<CreateTicket />}
          />
          <Route
            path="/admin/projects/ticket/create"
            element={<TicketCreationForm />}
          />
          <Route path="/admin/projects/ticket/all" element={<Tickets />} />
          <Route
            path="/admin/projects/ticket/by/template/all"
            element={<TicketsByTemp />}
          />
          {/* <Route
            path="/admin/projects/ticket/edit/:id"
            element={<TicketEditForm />}
          /> */}
          <Route
            path="/admin/projects/ticket/by/template/edit/:id"
            element={<EditTicket />}
          />
          {/* <tasks management> */}
          <Route
            path="/admin/projects/task/create"
            element={<TaskCreationForm />}
          />
          <Route path="/admin/projects/task/all" element={<TaskList />} />
          <Route
            path="/admin/projects/task/edit/:id"
            element={<TaskEditForm />}
          />
          <Route
            path="/admin/projects/task/calendar"
            element={<TaksCalendar />}
          />
          <Route
            path="/admin/projects/task/time-line"
            element={<TaskTimeline />}
          />
          {/* </tasks management> */}
          {/* <RH> */}
          <Route
            path="/admin/hr/employee/job-position"
            element={<JobPositionList />}
          />
          <Route path="/admin/hr/employees/create" element={<EmployeeForm />} />
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/admin/hr/employees/all" element={<EmployeesList />} />
          <Route path="/admin/hr/teams" element={<TeamList />} />
          {/* </RH> */}
          <Route path="/admin/projects/task/test" element={<NestedList />} />
          {/* test */}
          {/* <Route path="/admin/test" element={<Test />} /> */}
          {/* <Route
            path="/admin/projects/site/template/site/create-site-template/excel"
            element={<CreateSiteTemplateFromExcel />}
          />
          <Route
            path="/admin/projects/site/template/site/site-template/excel"
            element={<SiteTemplateFromExcelView />}
          /> */}
          {/* </template> */}
          <Route path="/admin/projects/all" element={<ProjectList />} />
          <Route path="/admin/comptes" element={<Accounts roles={roles} />} />
          <Route path="/user/:id" element={<UserDetails roles={roles} />} />
          {/* solarcom other pages to view after */}
          {/* <Route path="/" element={<CentralOne />} /> */}
          <Route path="incidex-app-site-view" element={<SiteView />} />
          {/* alarms pages */}
          <Route path="incidex-app-update-alarms" element={<UpdateAlarms />} />
          <Route path="incidex-app-new-alarms" element={<NewAlarms />} />
          <Route path="incidex-app-alarms" element={<Alarm />} />
          <Route path="/edit/:id" element={<EditAlarm />} /> {/* Edit route */}
          <Route path="/view/:id" element={<ViewAlarm />} /> {/* View route */}
          <Route
            path="incidex-app-cleared-alarms"
            element={<ClearedAlarms />}
          />
          <Route path="anadex-app" element={<AnadexApp />} />
          <Route path="pbr-app" element={<PbrApp />} />
          <Route path="it-mobile-app" element={<ItMobileApp />} />
          {/* test */}
          <Route path="test-file-input" element={<FileInput />} />
          <Route path="test-file-ExcelDataGrid" element={<ExcelDataGrid />} />
          <Route path="email-editor" element={<EmailEditor />} />
          <Route path="email-retrieve-emails" element={<RetrieveEmails />} />
          {/* IAM */}
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/assign-role" element={<AssignUserRolePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default AppRoutes;
