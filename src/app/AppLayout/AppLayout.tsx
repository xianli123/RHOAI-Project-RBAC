import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Button,
  Icon,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
} from '@patternfly/react-core';
import { IAppRoute, IAppRouteGroup, routes } from '@app/routes';
import { BarsIcon, CodeIcon, CogIcon, FlaskIcon, FolderIcon, HomeIcon, LightbulbIcon, ListIcon } from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg height="32px" width="32px" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
                <title>Red Hat Fedora</title>
                <path
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 26C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z"
                  fill="#CC0000"
                />
                <ellipse cx="16" cy="12" rx="10" ry="6" fill="#CC0000" />
                <path
                  d="M6 12c0-3.314 4.477-6 10-6s10 2.686 10 6"
                  stroke="#CC0000"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>
                  Red Hat
                </span>
                <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>
                  OpenShift AI
                </span>
              </div>
            </div>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const location = useLocation();

  const getIconForRoute = (label: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Home': <HomeIcon />,
      'Projects': <FolderIcon />,
      'AI hub': <LightbulbIcon />,
      'Gen AI studio': <LightbulbIcon />,
      'Develop & train': <FlaskIcon />,
      'Observe & monitor': <FlaskIcon />,
      'Learning resources': <ListIcon />,
      'Applications': <CodeIcon />,
      'Settings': <CogIcon />,
    };
    return iconMap[label] || null;
  };

  const renderNavItem = (route: IAppRoute, index: number) => {
    const icon = getIconForRoute(route.label || '');
    return (
      <NavItem
        key={`${route.label}-${index}`}
        id={`nav-item-${route.label}-${index}`}
        isActive={route.path === location.pathname}
        icon={icon ? <Icon>{icon}</Icon> : undefined}
      >
        <NavLink to={route.path}>{route.label}</NavLink>
      </NavItem>
    );
  };

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => {
    return (
      <NavExpandable
        key={`${group.label}-${groupIndex}`}
        id={`nav-group-${group.label}-${groupIndex}`}
        title={group.label}
        isActive={group.routes.some((route) => route.path === location.pathname)}
      >
        {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
      </NavExpandable>
    );
  };

  const Navigation = (
    <Nav id="nav-primary-simple" aria-label="Global navigation">
      <NavList id="nav-list-simple">
        {routes.map(
          (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx)),
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer?.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );
  return (
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
    >
      {children}
    </Page>
  );
};

export { AppLayout };
