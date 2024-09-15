import { createBrowserRouter } from 'react-router-dom';
import { AppRoot } from '../AppRoot/AppRoot';
import { ActivityTab } from '../components/Activity';
import { ApplicationDetails } from '../components/ApplicationDetails';
import { applicationPageLoader, ApplicationListView } from '../components/Applications';
import { importPageLoader, ImportForm } from '../components/ImportForm';
import {
  integrationDetailsPageLoader,
  IntegrationTestDetailsView,
  IntegrationTestOverviewTab,
  IntegrationTestPipelineRunTab,
} from '../components/IntegrationTests/IntegrationTestDetails';
import {
  IntegrationTestCreateForm,
  integrationTestCreateFormLoader,
  IntegrationTestEditForm,
  integrationTestEditFormLoader,
} from '../components/IntegrationTests/IntegrationTestForm';
import {
  integrationListPageLoader,
  IntegrationTestsListView,
} from '../components/IntegrationTests/IntegrationTestsListView';
import { Overview } from '../components/Overview/Overview';
import { queryWorkspaces } from '../components/Workspace/utils';
import { WorkspaceProvider } from '../components/Workspace/workspace-context';
import { RouteErrorBoundry } from './RouteErrorBoundary';
import { RouterParams } from './utils';

export const router = createBrowserRouter([
  {
    path: '/',
    loader: async () => {
      const workspaces = await queryWorkspaces();
      return { data: workspaces };
    },
    element: (
      <WorkspaceProvider>
        <AppRoot />
      </WorkspaceProvider>
    ),
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: `/workspaces/:${RouterParams.workspaceName}/import`,
        loader: importPageLoader,
        errorElement: <RouteErrorBoundry />,
        element: <ImportForm />,
      },
      {
        path: `/workspaces/:${RouterParams.workspaceName}/applications`,
        loader: applicationPageLoader,
        element: <ApplicationListView />,
        errorElement: <RouteErrorBoundry />,
      },
      /* Application details */
      {
        path: `/workspaces/:${RouterParams.workspaceName}/applications/:${RouterParams.applicationName}`,
        element: <ApplicationDetails />,
        errorElement: <RouteErrorBoundry />,
        children: [
          {
            index: true,
            element: <div>Overview tab</div>,
          },
          {
            path: `activity/:${RouterParams.activityTab}`,
            element: <ActivityTab />,
          },
          {
            path: `activity`,
            element: <ActivityTab />,
          },
          {
            path: 'components',
            element: <div>Component tab</div>,
          },
          {
            path: 'integrationtests',
            loader: integrationListPageLoader,
            errorElement: <RouteErrorBoundry />,
            element: <IntegrationTestsListView />,
          },
          {
            path: 'releases',
            element: <div>Release tab</div>,
          },
        ],
      },
      /* IntegrationTestScenario routes */
      {
        path: `/workspaces/:${RouterParams.workspaceName}/applications/:${RouterParams.applicationName}/integrationtests/add`,
        loader: integrationTestCreateFormLoader,
        errorElement: <RouteErrorBoundry />,
        element: <IntegrationTestCreateForm />,
      },
      {
        path: `/workspaces/:${RouterParams.workspaceName}/applications/:${RouterParams.applicationName}/integrationtests/:${RouterParams.integrationTestName}/edit`,
        loader: integrationTestEditFormLoader,
        errorElement: <RouteErrorBoundry />,
        element: <IntegrationTestEditForm />,
      },
      {
        path: `/workspaces/:${RouterParams.workspaceName}/applications/:${RouterParams.applicationName}/integrationtests/:${RouterParams.integrationTestName}`,
        loader: integrationDetailsPageLoader,
        errorElement: <RouteErrorBoundry />,
        element: <IntegrationTestDetailsView />,
        children: [
          {
            index: true,
            element: <IntegrationTestOverviewTab />,
          },
          {
            path: 'pipelineruns',
            element: <IntegrationTestPipelineRunTab />,
          },
        ],
      },
    ],
  },
]);
