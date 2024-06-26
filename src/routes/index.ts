import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Home = lazy(() => import('../pages/Dashboard/ECommerce'));
const Map = lazy(() => import('../pages/Map'));
const Verify = lazy(() => import('../pages/Verify'));
const AcceptReject = lazy(() => import('../pages/AcceptReject'));
const coreRoutes = [
  {
    path: '/home',
    title: 'Home',
    component: Home,
  },
  {
    path: '/map',
    title: 'Map',
    component: Map,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: 'forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: 'accept-reject',
    title: 'Accept/Reject',
    component: AcceptReject,
  },
  {
    path: 'auth/dashboard/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: 'tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: 'settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: 'chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: 'ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: 'ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },

  {
    path: '/verify',
    title: 'Verify',
    component: Verify,
  }
];

const routes = [...coreRoutes];
export default routes;
