import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Projects } from '@app/Projects/Projects';
import { ProjectDetails } from '@app/Projects/ProjectDetails';
import { AIHub } from '@app/AIHub/AIHub';
import { GenAIStudio } from '@app/GenAIStudio/GenAIStudio';
import { DevelopTrain } from '@app/DevelopTrain/DevelopTrain';
import { ObserveMonitor } from '@app/ObserveMonitor/ObserveMonitor';
import { LearningResources } from '@app/LearningResources/LearningResources';
import { Applications } from '@app/Applications/Applications';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Dashboard />,
    exact: true,
    label: 'Home',
    path: '/',
    title: 'Red Hat OpenShift AI | Home',
  },
  {
    element: <Projects />,
    exact: true,
    label: 'Projects',
    path: '/projects',
    title: 'Red Hat OpenShift AI | Projects',
  },
  {
    element: <ProjectDetails />,
    exact: true,
    path: '/projects/:projectId',
    title: 'Red Hat OpenShift AI | Project Details',
  },
  {
    label: 'AI hub',
    routes: [
      {
        element: <AIHub />,
        exact: true,
        label: 'AI Hub',
        path: '/ai-hub',
        title: 'Red Hat OpenShift AI | AI Hub',
      },
    ],
  },
  {
    label: 'Gen AI studio',
    routes: [
      {
        element: <GenAIStudio />,
        exact: true,
        label: 'Gen AI Studio',
        path: '/gen-ai-studio',
        title: 'Red Hat OpenShift AI | Gen AI Studio',
      },
    ],
  },
  {
    label: 'Develop & train',
    routes: [
      {
        element: <DevelopTrain />,
        exact: true,
        label: 'Develop & Train',
        path: '/develop-train',
        title: 'Red Hat OpenShift AI | Develop & Train',
      },
    ],
  },
  {
    label: 'Observe & monitor',
    routes: [
      {
        element: <ObserveMonitor />,
        exact: true,
        label: 'Observe & Monitor',
        path: '/observe-monitor',
        title: 'Red Hat OpenShift AI | Observe & Monitor',
      },
    ],
  },
  {
    element: <LearningResources />,
    exact: true,
    label: 'Learning resources',
    path: '/learning-resources',
    title: 'Red Hat OpenShift AI | Learning Resources',
  },
  {
    label: 'Applications',
    routes: [
      {
        element: <Applications />,
        exact: true,
        label: 'Applications',
        path: '/applications',
        title: 'Red Hat OpenShift AI | Applications',
      },
    ],
  },
  {
    label: 'Settings',
    routes: [
      {
        element: <GeneralSettings />,
        exact: true,
        label: 'General',
        path: '/settings/general',
        title: 'Red Hat OpenShift AI | General Settings',
      },
      {
        element: <ProfileSettings />,
        exact: true,
        label: 'Profile',
        path: '/settings/profile',
        title: 'Red Hat OpenShift AI | Profile Settings',
      },
    ],
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
