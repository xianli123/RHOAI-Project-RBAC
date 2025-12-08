import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Alert,
  AlertVariant,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  ClipboardCopy,
  Popover,
  MenuToggle,
  Modal,
  ModalVariant,
  Flex,
  FlexItem,
  Divider,
  Grid,
  GridItem,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  Tab,
  TabContent,
  TabContentBody,
  Tabs,
  TabTitleText,
  TextInputGroup,
  TextInputGroupMain,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import {
  FolderIcon,
  HelpIcon,
  CogIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  UsersIcon,
  EllipsisVIcon,
  PlusIcon,
  CheckIcon,
  TimesIcon,
  AngleRightIcon,
  CloseIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';

type Project = {
  id: string;
  name: string;
  owner: string;
  description: string;
  createdAt: string;
  workbenchRunning: number;
  workbenchStopped: number;
};

const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'a project with object storage with an extremely long name so we can test truncation behaviour',
    owner: 'cluster-admin',
    description:
      'DC: UXDPOC6 connects to Object storage, and a model is saved in the path "/models/fraud/1/model.onnx"',
    createdAt: '10/30/2024, 7:26:48 PM',
    workbenchRunning: 2,
    workbenchStopped: 6,
  },
  {
    id: 'project-2',
    name: 'Daragh-test',
    owner: 'cluster-admin',
    description: 'Project to deploy a model',
    createdAt: '5/8/2025, 7:25:02 PM',
    workbenchRunning: 0,
    workbenchStopped: 0,
  },
  {
    id: 'project-3',
    name: 'dedicated-admin',
    owner: 'cluster-admin',
    description: '',
    createdAt: '10/31/2025, 2:59:17 AM',
    workbenchRunning: 0,
    workbenchStopped: 0,
  },
  {
    id: 'project-4',
    name: 'Feast',
    owner: 'cluster-admin',
    description: '',
    createdAt: '8/20/2025, 4:48:11 PM',
    workbenchRunning: 0,
    workbenchStopped: 0,
  },
  {
    id: 'project-5',
    name: 'haley-test',
    owner: 'cluster-admin',
    description: '',
    createdAt: '4/9/2025, 2:52:01 PM',
    workbenchRunning: 0,
    workbenchStopped: 0,
  },
  {
    id: 'project-6',
    name: 'istio-system',
    owner: 'cluster-admin',
    description: '',
    createdAt: '10/3/2024, 4:31:24 AM',
    workbenchRunning: 0,
    workbenchStopped: 0,
  },
  {
    id: 'project-7',
    name: 'Jenn',
    owner: 'cluster-admin',
    description: '',
    createdAt: '7/16/2025, 5:23:20 AM',
    workbenchRunning: 0,
    workbenchStopped: 0,
  },
];

const ProjectDetails: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = React.useState<string | number>('overview');
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [usersSortBy, setUsersSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' } | undefined>();
  const [groupsSortBy, setGroupsSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' } | undefined>();
  const [openDropdowns, setOpenDropdowns] = React.useState<{ [key: string]: boolean }>({});
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | undefined>();
  const [activeRoleModalTab, setActiveRoleModalTab] = React.useState<'details' | 'assignees'>('details');
  // Add user/group state
  const [isAddingUser, setIsAddingUser] = React.useState(false);
  const [isAddingGroup, setIsAddingGroup] = React.useState(false);
  const [newUserInput, setNewUserInput] = React.useState('');
  const [newGroupInput, setNewGroupInput] = React.useState('');
  const [selectedNewUser, setSelectedNewUser] = React.useState<string | null>(null);
  const [selectedNewGroup, setSelectedNewGroup] = React.useState<string | null>(null);
  const [selectedNewUserRoles, setSelectedNewUserRoles] = React.useState<Set<string>>(new Set());
  const [selectedNewGroupRoles, setSelectedNewGroupRoles] = React.useState<Set<string>>(new Set());
  const [isUserSelectOpen, setIsUserSelectOpen] = React.useState(false);
  const [isGroupSelectOpen, setIsGroupSelectOpen] = React.useState(false);
  const [isUserRoleSelectOpen, setIsUserRoleSelectOpen] = React.useState(false);
  const [isGroupRoleSelectOpen, setIsGroupRoleSelectOpen] = React.useState(false);
  const [expandedRoles, setExpandedRoles] = React.useState<Set<string>>(new Set());

  // Mock data as state for mutability
  const [mockUsers, setMockUsers] = React.useState<PermissionEntry[]>([
    {
      id: 'user-1',
      name: 'Maude',
      roles: [{ roleId: 'role-project-admin', dateAdded: '30 Oct 2024' }],
      dateAdded: '30 Oct 2024',
    },
    {
      id: 'user-2',
      name: 'John',
      roles: [{ roleId: 'role-project-contributor', dateAdded: '30 Oct 2024' }],
      dateAdded: '30 Oct 2024',
    },
    {
      id: 'user-3',
      name: 'Deena',
      roles: [
        { roleId: 'role-project-access', dateAdded: '30 Oct 2024' },
        { roleId: 'role-workbench-maintainer', dateAdded: '25 Nov 2025' },
        { roleId: 'role-deployments-access', dateAdded: '30 Feb 2024' },
        { roleId: 'role-pipeline-reader', dateAdded: '15 Jan 2023' },
        { roleId: 'role-workbench-reader', dateAdded: '01 Mar 2024' },
      ],
      dateAdded: '30 Oct 2024',
    },
    {
      id: 'user-4',
      name: 'Diana',
      roles: [
        { roleId: 'role-project-access', dateAdded: '30 Oct 2024' },
        { roleId: 'role-workbench-maintainer', dateAdded: '30 Oct 2024' },
      ],
      dateAdded: '30 Oct 2024',
    },
    {
      id: 'user-5',
      name: 'Jeff',
      roles: [
        { roleId: 'role-project-access', dateAdded: '30 Oct 2024' },
        { roleId: 'role-workbench-maintainer', dateAdded: '30 Oct 2024' },
      ],
      dateAdded: '30 Oct 2024',
    },
    {
      id: 'user-6',
      name: 'Gary',
      roles: [{ roleId: 'role-custom', dateAdded: '30 Oct 2024' }],
      dateAdded: '30 Oct 2024',
    },
  ]);

  const [mockGroups, setMockGroups] = React.useState<PermissionEntry[]>([
    {
      id: 'group-1',
      name: 'dedicated-admins',
      roles: [{ roleId: 'role-custom', dateAdded: '30 Oct 2024' }],
      dateAdded: '30 Oct 2024',
    },
    {
      id: 'group-2',
      name: 'system:serviceaccounts:dedicated-admin',
      roles: [
        { roleId: 'role-project-admin', dateAdded: '30 Oct 2024' },
        { roleId: 'role-project-contributor', dateAdded: '15 Nov 2023' },
      ],
      dateAdded: '30 Oct 2024',
    },
  ]);

  const project = React.useMemo(() => {
    return mockProjects.find((p) => p.id === projectId);
  }, [projectId]);

  if (!project) {
    return (
      <PageSection>
        <Title headingLevel="h1">Project not found</Title>
      </PageSection>
    );
  }

  const onTabSelect = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTab(tabIndex);
  };

  const onActionsToggle = (isOpen: boolean) => {
    setIsActionsOpen(isOpen);
  };

  const onActionsSelect = () => {
    setIsActionsOpen(false);
  };

  const onUsersSort = (_event: React.MouseEvent, index: number, direction: 'asc' | 'desc') => {
    setUsersSortBy({ index, direction });
  };

  const onGroupsSort = (_event: React.MouseEvent, index: number, direction: 'asc' | 'desc') => {
    setGroupsSortBy({ index, direction });
  };

  const onDropdownToggle = (id: string, isOpen: boolean) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: isOpen }));
  };

  const onDropdownSelect = (id: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: false }));
  };

  type RoleWithDate = {
    roleId: string;
    dateAdded: string;
  };

  type PermissionEntry = {
    id: string;
    name: string;
    roles: RoleWithDate[];
    dateAdded: string; // Keep for backward compatibility
  };

  type RoleInfo = {
    id: string;
    name: string;
    label: string;
    description: string;
    realName?: string;
    actions: string;
    resources: string;
    resourceNames: string;
    assignees: string[];
  };

  const mockRoles: RoleInfo[] = [
    {
      id: 'role-project-admin',
      name: 'Project admin',
      label: 'AI',
      description: 'Full project administration access.',
      realName: 'project-admin',
      actions: 'create, delete, deletecollection, get, list, patch, update, watch',
      resources: 'project resources',
      resourceNames: '—',
      assignees: ['Maude'],
    },
    {
      id: 'role-project-contributor',
      name: 'Project contributor',
      label: 'AI',
      description: 'Contribute to project workloads.',
      realName: 'project-contributor',
      actions: 'get, list, patch, update, watch',
      resources: 'project resources',
      resourceNames: '—',
      assignees: ['John'],
    },
    {
      id: 'role-project-access',
      name: 'Project access',
      label: 'AI',
      description: 'View access to project.',
      realName: 'project-access',
      actions: 'get, list, watch',
      resources: 'project resources',
      resourceNames: '—',
      assignees: ['Deena', 'Diana', 'Jeff'],
    },
    {
      id: 'role-workbench-maintainer',
      name: 'Workbench maintainer',
      label: 'AI',
      description: 'Manage and maintain workbenches.',
      realName: 'workbench-maintainer',
      actions: 'create, delete, get, list, patch, update, watch',
      resources: 'workbenches',
      resourceNames: '—',
      assignees: ['Deena', 'Diana', 'Jeff'],
    },
    {
      id: 'role-deployments-access',
      name: 'Deployments access',
      label: 'AI',
      description: 'Access to deployments.',
      realName: 'deployments-access',
      actions: 'get, list, watch',
      resources: 'deployments',
      resourceNames: '—',
      assignees: ['Deena'],
    },
    {
      id: 'role-pipeline-reader',
      name: 'Pipeline reader',
      label: 'AI',
      description: 'Read access to pipelines.',
      realName: 'pipeline-reader',
      actions: 'get, list, watch',
      resources: 'pipelines',
      resourceNames: '—',
      assignees: ['Deena'],
    },
    {
      id: 'role-workbench-reader',
      name: 'Workbench reader',
      label: 'AI',
      description: 'Read access to workbenches.',
      realName: 'workbench-reader',
      actions: 'get, list, watch',
      resources: 'workbenches',
      resourceNames: '—',
      assignees: ['Deena'],
    },
    {
      id: 'role-custom',
      name: 'this-is-the-k8s-role-name',
      label: 'AI',
      description: 'Custom cluster role',
      realName: 'custom-role',
      actions: 'create, delete, deletecollection, get, list, patch, update, watch',
      resources: 'workbenches',
      resourceNames: '—',
      assignees: ['Gary'],
    },
  ];


  const roleMap: Record<string, RoleInfo> = React.useMemo(() => {
    return mockRoles.reduce((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {} as Record<string, RoleInfo>);
  }, [mockRoles]);

  const getPrimaryRoleName = (roles: RoleWithDate[]) => {
    if (!roles?.length) return '';
    const role = roleMap[roles[0].roleId];
    return role ? role.name : '';
  };

  const tableHeaderStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: 'var(--pf-v6-global--spacer--md) var(--pf-v6-global--spacer--md)',
  };

  const tableCellStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: 'var(--pf-v6-global--spacer--md) var(--pf-v6-global--spacer--md)',
  };

  const onOpenRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setActiveRoleModalTab('details');
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRoleId(undefined);
  };

  // Add user/group handlers
  const handleAddUser = () => {
    setIsAddingUser(true);
    setNewUserInput('');
    setSelectedNewUser(null);
    setSelectedNewUserRoles(new Set());
  };

  const handleAddGroup = () => {
    setIsAddingGroup(true);
    setNewGroupInput('');
    setSelectedNewGroup(null);
    setSelectedNewGroupRoles(new Set());
  };

  const handleCancelAddUser = () => {
    setIsAddingUser(false);
    setNewUserInput('');
    setSelectedNewUser(null);
    setSelectedNewUserRoles(new Set());
    setIsUserSelectOpen(false);
    setIsUserRoleSelectOpen(false);
  };

  const handleCancelAddGroup = () => {
    setIsAddingGroup(false);
    setNewGroupInput('');
    setSelectedNewGroup(null);
    setSelectedNewGroupRoles(new Set());
    setIsGroupSelectOpen(false);
    setIsGroupRoleSelectOpen(false);
  };

  const handleSaveUser = () => {
    if (!selectedNewUser && !newUserInput.trim()) return;
    if (selectedNewUserRoles.size === 0) return;

    const userName = selectedNewUser || newUserInput.trim();
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setMockUsers((prevUsers) => {
      const existingUserIndex = prevUsers.findIndex((u) => u.name === userName);
      const newRoles = Array.from(selectedNewUserRoles).map((roleId) => ({
        roleId,
        dateAdded: currentDate,
      }));

      if (existingUserIndex >= 0) {
        // Merge with existing user
        const updatedUsers = [...prevUsers];
        updatedUsers[existingUserIndex] = {
          ...updatedUsers[existingUserIndex],
          roles: [...updatedUsers[existingUserIndex].roles, ...newRoles],
        };
        return updatedUsers;
      } else {
        // Add new user
        return [
          ...prevUsers,
          {
            id: `user-${Date.now()}`,
            name: userName,
            roles: newRoles,
            dateAdded: currentDate,
          },
        ];
      }
    });

    handleCancelAddUser();
  };

  const handleSaveGroup = () => {
    if (!selectedNewGroup && !newGroupInput.trim()) return;
    if (selectedNewGroupRoles.size === 0) return;

    const groupName = selectedNewGroup || newGroupInput.trim();
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setMockGroups((prevGroups) => {
      const existingGroupIndex = prevGroups.findIndex((g) => g.name === groupName);
      const newRoles = Array.from(selectedNewGroupRoles).map((roleId) => ({
        roleId,
        dateAdded: currentDate,
      }));

      if (existingGroupIndex >= 0) {
        // Merge with existing group
        const updatedGroups = [...prevGroups];
        updatedGroups[existingGroupIndex] = {
          ...updatedGroups[existingGroupIndex],
          roles: [...updatedGroups[existingGroupIndex].roles, ...newRoles],
        };
        return updatedGroups;
      } else {
        // Add new group
        return [
          ...prevGroups,
          {
            id: `group-${Date.now()}`,
            name: groupName,
            roles: newRoles,
            dateAdded: currentDate,
          },
        ];
      }
    });

    handleCancelAddGroup();
  };

  const handleUserSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    if (value === 'create') {
      // Use the typed input as the new user name
      setSelectedNewUser(newUserInput.trim());
      setNewUserInput(newUserInput.trim());
    } else {
      setSelectedNewUser(value as string);
      setNewUserInput(value as string);
      // Clear selected roles that the user already has
      const existingRoles = getExistingUserRoles(value as string);
      setSelectedNewUserRoles((prev) => {
        const newSet = new Set(prev);
        existingRoles.forEach((roleId) => newSet.delete(roleId));
        return newSet;
      });
    }
    setIsUserSelectOpen(false);
  };

  const handleGroupSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    if (value === 'create') {
      // Use the typed input as the new group name
      setSelectedNewGroup(newGroupInput.trim());
      setNewGroupInput(newGroupInput.trim());
    } else {
      setSelectedNewGroup(value as string);
      setNewGroupInput(value as string);
      // Clear selected roles that the group already has
      const existingRoles = getExistingGroupRoles(value as string);
      setSelectedNewGroupRoles((prev) => {
        const newSet = new Set(prev);
        existingRoles.forEach((roleId) => newSet.delete(roleId));
        return newSet;
      });
    }
    setIsGroupSelectOpen(false);
  };

  const handleRoleToggle = (roleId: string) => {
    if (isAddingUser) {
      setSelectedNewUserRoles((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(roleId)) {
          newSet.delete(roleId);
        } else {
          newSet.add(roleId);
        }
        return newSet;
      });
    } else {
      setSelectedNewGroupRoles((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(roleId)) {
          newSet.delete(roleId);
        } else {
          newSet.add(roleId);
        }
        return newSet;
      });
    }
  };

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  // Get existing user roles for disabling
  const getExistingUserRoles = (userName: string): Set<string> => {
    const user = mockUsers.find((u) => u.name === userName);
    if (!user) return new Set();
    return new Set(user.roles.map((r) => r.roleId));
  };

  // Get existing group roles for disabling
  const getExistingGroupRoles = (groupName: string): Set<string> => {
    const group = mockGroups.find((g) => g.name === groupName);
    if (!group) return new Set();
    return new Set(group.roles.map((r) => r.roleId));
  };

  // Check if user/group already exists
  const isExistingUser = (userName: string | null): boolean => {
    if (!userName) return false;
    return mockUsers.some((u) => u.name === userName);
  };

  const isExistingGroup = (groupName: string | null): boolean => {
    if (!groupName) return false;
    return mockGroups.some((g) => g.name === groupName);
  };

  // Get available users for select
  const availableUsers = React.useMemo(() => {
    return mockUsers.map((u) => u.name);
  }, [mockUsers]);

  // Get available groups for select
  const availableGroups = React.useMemo(() => {
    return mockGroups.map((g) => g.name);
  }, [mockGroups]);

  const sortedUsers = React.useMemo(() => {
    if (!usersSortBy) return mockUsers;
    const sorted = [...mockUsers];
    sorted.sort((a, b) => {
      let aValue: string;
      let bValue: string;
      if (usersSortBy.index === 0) {
        aValue = a.name;
        bValue = b.name;
      } else if (usersSortBy.index === 1) {
        aValue = getPrimaryRoleName(a.roles);
        bValue = getPrimaryRoleName(b.roles);
      } else {
        aValue = a.dateAdded;
        bValue = b.dateAdded;
      }
      if (aValue < bValue) return usersSortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return usersSortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [usersSortBy, roleMap]);

  const sortedGroups = React.useMemo(() => {
    if (!groupsSortBy) return mockGroups;
    const sorted = [...mockGroups];
    sorted.sort((a, b) => {
      let aValue: string;
      let bValue: string;
      if (groupsSortBy.index === 0) {
        aValue = a.name;
        bValue = b.name;
      } else if (groupsSortBy.index === 1) {
        aValue = getPrimaryRoleName(a.roles);
        bValue = getPrimaryRoleName(b.roles);
      } else {
        aValue = a.dateAdded;
        bValue = b.dateAdded;
      }
      if (aValue < bValue) return groupsSortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return groupsSortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [groupsSortBy, roleMap]);

  const actionsDropdownItems = [
    <DropdownItem key="edit" id="project-actions-edit">
      Edit project
    </DropdownItem>,
    <DropdownItem key="delete" id="project-actions-delete">
      Delete project
    </DropdownItem>,
  ];

  const workbenches = [
    { id: 'wb-1', name: 'Test workbench', status: 'running' },
    { id: 'wb-2', name: 'ffd', status: 'stopped' },
    { id: 'wb-3', name: 'code server test', status: 'stopped' },
    { id: 'wb-4', name: 'de', status: 'stopped' },
    { id: 'wb-5', name: 'example', status: 'stopped' },
  ];

  const workbenchStatus = {
    stopped: project.workbenchStopped,
    starting: 1,
    running: project.workbenchRunning,
  };

  return (
    <>
      <PageSection
        variant="default"
        hasBodyWrapper={false}
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
      >
        <Breadcrumb id="project-details-breadcrumb">
          <BreadcrumbItem>
            <Link to="/projects">Projects</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {project.name.length > 50 ? `${project.name.substring(0, 50)}...` : project.name}
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex
          alignItems={{ default: 'alignItemsFlexStart' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          style={{ marginTop: 'var(--pf-v6-global--spacer--md)' }}
        >
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <FolderIcon style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }} />
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">
                  {project.name}
                </Title>
              </FlexItem>
              <FlexItem>
                <Button
                  id="project-title-help"
                  variant="plain"
                  aria-label="More info about project"
                  style={{ marginLeft: 'var(--pf-v6-global--spacer--xs)' }}
                >
                  <HelpIcon />
                </Button>
              </FlexItem>
            </Flex>
            {project.description && (
              <div style={{ marginTop: 'var(--pf-v6-global--spacer--sm)', color: 'var(--pf-v6-global--text--color--secondary)' }}>
                {project.description}
              </div>
            )}
          </FlexItem>
          <FlexItem>
            <Dropdown
              id="project-actions-dropdown"
              isOpen={isActionsOpen}
              onSelect={onActionsSelect}
              onOpenChange={onActionsToggle}
              toggle={(toggleRef) => (
                <Button
                  ref={toggleRef}
                  id="project-actions-button"
                  variant="secondary"
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                >
                  Actions
                </Button>
              )}
            >
              <DropdownList>{actionsDropdownItems}</DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>

        <Tabs
          id="project-details-tabs"
          activeKey={activeTab}
          onSelect={onTabSelect}
          aria-label="Project details tabs"
          style={{ marginTop: 'var(--pf-v6-global--spacer--lg)' }}
        >
          <Tab eventKey="overview" title="Overview" id="project-tab-overview">
            <TabContent id="project-tab-content-overview">
              <TabContentBody>
                <PageSection variant="default" hasBodyWrapper={false}>
                  <Title headingLevel="h2" size="lg" style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                    Train models
                  </Title>
                  <Grid hasGutter>
                    <GridItem span={6}>
                      <Card id="project-workbenches-card">
                        <CardTitle>
                          <Flex alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>
                              <CogIcon style={{ marginRight: 'var(--pf-v6-global--spacer--xs)' }} />
                            </FlexItem>
                            <FlexItem>Workbenches</FlexItem>
                            <FlexItem>
                              <Button
                                id="workbenches-help"
                                variant="plain"
                                aria-label="More info about workbenches"
                                style={{ marginLeft: 'var(--pf-v6-global--spacer--xs)' }}
                              >
                                <HelpIcon />
                              </Button>
                            </FlexItem>
                          </Flex>
                        </CardTitle>
                        <CardBody>
                          <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                            {workbenchStatus.stopped} Stopped, {workbenchStatus.starting} Starting,{' '}
                            {workbenchStatus.running} Running
                          </div>
                          <div style={{ marginBottom: 'var(--pf-v6-global--spacer--sm)' }}>
                            {workbenches.map((wb) => (
                              <div key={wb.id} style={{ marginBottom: 'var(--pf-v6-global--spacer--xs)' }}>
                                <Button
                                  id={`workbench-link-${wb.id}`}
                                  variant="link"
                                  isInline
                                >
                                  {wb.name}
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                            {workbenches.length} of 8 workbenches{' '}
                            <Button id="workbenches-view-all" variant="link" isInline>
                              View all
                            </Button>
                          </div>
                          <Button id="create-workbench-button" variant="link" isInline>
                            Create workbench
                          </Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem span={6}>
                      <Card id="project-pipelines-card">
                        <CardTitle>
                          <Flex alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>Pipelines</FlexItem>
                            <FlexItem>
                              <Button
                                id="pipelines-help"
                                variant="plain"
                                aria-label="More info about pipelines"
                                style={{ marginLeft: 'var(--pf-v6-global--spacer--xs)' }}
                              >
                                <HelpIcon />
                              </Button>
                            </FlexItem>
                          </Flex>
                        </CardTitle>
                        <CardBody>
                          <div style={{ textAlign: 'center', marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                            <ExclamationCircleIcon
                              style={{
                                fontSize: '3rem',
                                color: 'var(--pf-v6-global--danger-color--100)',
                                marginBottom: 'var(--pf-v6-global--spacer--sm)',
                              }}
                            />
                            <div style={{ fontWeight: 'bold', color: 'var(--pf-v6-global--danger-color--100)' }}>
                              Pipeline server failed
                            </div>
                          </div>
                          <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                            The {project.name} pipeline server either could not start or be contacted. You must delete this
                            server to fix the issue, but this will also permanently delete all associated resources. You
                            will need to configure a new server afterward.
                          </div>
                          <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)', fontSize: 'var(--pf-v6-global--FontSize--sm)' }}>
                            Could not connect to (123), Error: Get "https://123/345/?location=": dial tcp: lookup 123: no
                            such host
                          </div>
                          <Button id="delete-pipeline-server-button" variant="danger">
                            Delete pipeline server
                          </Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
          <Tab eventKey="workbenches" title="Workbenches" id="project-tab-workbenches">
            <TabContent id="project-tab-content-workbenches">
              <TabContentBody>
                <PageSection variant="default">
                  <Title headingLevel="h2" size="lg">
                    Workbenches
                  </Title>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
          <Tab eventKey="pipelines" title="Pipelines" id="project-tab-pipelines">
            <TabContent id="project-tab-content-pipelines">
              <TabContentBody>
                <PageSection variant="default">
                  <Title headingLevel="h2" size="lg">
                    Pipelines
                  </Title>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
          <Tab eventKey="deployments" title="Deployments" id="project-tab-deployments">
            <TabContent id="project-tab-content-deployments">
              <TabContentBody>
                <PageSection variant="default">
                  <Title headingLevel="h2" size="lg">
                    Deployments
                  </Title>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
          <Tab eventKey="cluster-storage" title="Cluster storage" id="project-tab-cluster-storage">
            <TabContent id="project-tab-content-cluster-storage">
              <TabContentBody>
                <PageSection variant="default">
                  <Title headingLevel="h2" size="lg">
                    Cluster storage
                  </Title>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
          <Tab eventKey="connections" title="Connections" id="project-tab-connections">
            <TabContent id="project-tab-content-connections">
              <TabContentBody>
                <PageSection variant="default">
                  <Title headingLevel="h2" size="lg">
                    Connections
                  </Title>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
          <Tab eventKey="permissions" title="Permissions" id="project-tab-permissions">
            <TabContent id="project-tab-content-permissions">
              <TabContentBody>
                <PageSection variant="default" hasBodyWrapper={false}>
                  <Alert
                    id="permissions-warning-alert"
                    variant={AlertVariant.warning}
                    title="Warning: Changing user or group permissions may remove their access to this resource."
                    style={{ marginBottom: 'var(--pf-v6-global--spacer--lg)' }}
                  />
                  <div style={{ marginBottom: 'var(--pf-v6-global--spacer--lg)' }}>
                    Add users and groups that can access the project.
                  </div>

                  <div style={{ marginBottom: 'var(--pf-v6-global--spacer--xl)' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                      <FlexItem>
                        <UserIcon style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }} />
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">
                          Users
                        </Title>
                      </FlexItem>
                    </Flex>
                    <Table aria-label="Users table" id="permissions-users-table" isStickyHeader>
                      <Thead>
                        <Tr>
                          <Th
                            style={tableHeaderStyle}
                            sort={{
                              sortBy: usersSortBy || {},
                              onSort: onUsersSort,
                              columnIndex: 0,
                            }}
                          >
                            Name
                          </Th>
                          <Th
                            style={tableHeaderStyle}
                            sort={{
                              sortBy: usersSortBy || {},
                              onSort: onUsersSort,
                              columnIndex: 1,
                            }}
                          >
                            Role
                          </Th>
                          <Th
                            style={tableHeaderStyle}
                            sort={{
                              sortBy: usersSortBy || {},
                              onSort: onUsersSort,
                              columnIndex: 2,
                            }}
                          >
                            Date added
                          </Th>
                          <Th style={tableHeaderStyle}></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sortedUsers.map((user) => (
                          <Tr key={user.id}>
                            <Td dataLabel="Name" style={tableCellStyle}>
                              {user.name}
                            </Td>
                            <Td dataLabel="Role" style={tableCellStyle}>
                              {user.roles.map((roleWithDate) => {
                                const role = roleMap[roleWithDate.roleId];
                                if (!role) return null;
                                return (
                                  <div key={roleWithDate.roleId} style={{ marginBottom: 'var(--pf-v6-global--spacer--xs)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Button
                                        variant="link"
                                        isInline
                                        onClick={() => onOpenRole(roleWithDate.roleId)}
                                        id={`user-role-${user.id}-${roleWithDate.roleId}`}
                                      >
                                        {role.name}
                                      </Button>
                                      {role.id !== 'role-custom' && (
                                        <Label id={`user-role-label-${user.id}-${roleWithDate.roleId}`} color="blue" variant="outline" isCompact>
                                          {role.label}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </Td>
                            <Td dataLabel="Date added" style={tableCellStyle}>
                              {user.roles.map((roleWithDate) => (
                                <div key={`date-${roleWithDate.roleId}`} style={{ marginBottom: 'var(--pf-v6-global--spacer--xs)' }}>
                                  <span style={{ textDecoration: 'underline' }}>
                                    {roleWithDate.dateAdded}
                                  </span>
                                </div>
                              ))}
                            </Td>
                            <Td style={tableCellStyle}>
                              <Dropdown
                                id={`user-actions-dropdown-${user.id}`}
                                isOpen={openDropdowns[`user-${user.id}`] || false}
                                onSelect={() => onDropdownSelect(`user-${user.id}`)}
                                onOpenChange={(isOpen) => onDropdownToggle(`user-${user.id}`, isOpen)}
                                toggle={(toggleRef) => (
                                  <Button
                                    ref={toggleRef}
                                    id={`user-actions-${user.id}`}
                                    variant="plain"
                                    aria-label={`Actions for ${user.name}`}
                                    onClick={() => onDropdownToggle(`user-${user.id}`, !openDropdowns[`user-${user.id}`])}
                                  >
                                    <EllipsisVIcon />
                                  </Button>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                              >
                                <DropdownList>
                                  <DropdownItem
                                    key="edit"
                                    id={`user-edit-${user.id}`}
                                    onClick={() => {
                                      console.log('Edit user:', user.name);
                                      onDropdownSelect(`user-${user.id}`);
                                    }}
                                  >
                                    Edit
                                  </DropdownItem>
                                  <DropdownItem
                                    key="delete"
                                    id={`user-delete-${user.id}`}
                                    onClick={() => {
                                      console.log('Delete user:', user.name);
                                      onDropdownSelect(`user-${user.id}`);
                                    }}
                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                        {isAddingUser && (
                          <Tr id="add-user-row">
                        <Td style={tableCellStyle}>
                          <Select
                            id="new-user-select"
                            isOpen={isUserSelectOpen}
                            onOpenChange={(isOpen) => setIsUserSelectOpen(isOpen)}
                            onSelect={handleUserSelect}
                            selected={selectedNewUser || undefined}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                variant="typeahead"
                                onClick={() => setIsUserSelectOpen(!isUserSelectOpen)}
                                isExpanded={isUserSelectOpen}
                                isFullWidth
                              >
                                <TextInputGroup isPlain>
                                  {selectedNewUser && (
                                    <TextInputGroupMain
                                      value={selectedNewUser}
                                      readOnly
                                      id="new-user-input-selected"
                                    />
                                  )}
                                  {!selectedNewUser && (
                                    <TextInputGroupMain
                                      value={newUserInput}
                                      onChange={(_event, value) => {
                                        setNewUserInput(value);
                                      }}
                                      onFocus={() => setIsUserSelectOpen(true)}
                                      placeholder="Type to search or create"
                                      id="new-user-input"
                                    />
                                  )}
                                  {(selectedNewUser || newUserInput.trim()) && (
                                    <Button
                                      variant="plain"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedNewUser(null);
                                        setNewUserInput('');
                                        setIsUserSelectOpen(false);
                                      }}
                                      aria-label="Clear selection"
                                      id="clear-user-selection"
                                    >
                                      <CloseIcon />
                                    </Button>
                                  )}
                                </TextInputGroup>
                              </MenuToggle>
                            )}
                            popperProps={{ appendTo: () => document.body }}
                          >
                            <SelectList>
                              {availableUsers
                                .filter((name) => !newUserInput || name.toLowerCase().includes(newUserInput.toLowerCase()))
                                .map((name) => (
                                  <SelectOption key={name} value={name} id={`user-option-${name}`}>
                                    {name}
                                  </SelectOption>
                                ))}
                              {newUserInput &&
                                !availableUsers.some((name) => name.toLowerCase() === newUserInput.toLowerCase()) && (
                                  <>
                                    <Divider />
                                    <SelectOption key="create" value="create" id="create-user-option">
                                      Select "{newUserInput}"
                                    </SelectOption>
                                  </>
                                )}
                            </SelectList>
                          </Select>
                          {selectedNewUser && isExistingUser(selectedNewUser) && (
                            <Alert
                              variant={AlertVariant.info}
                              isInline
                              title="This user already has roles. New roles will be merged."
                              style={{ marginTop: 'var(--pf-v6-global--spacer--sm)' }}
                            />
                          )}
                        </Td>
                        <Td style={tableCellStyle}>
                          <Select
                            id="new-user-role-select"
                            isOpen={isUserRoleSelectOpen}
                            onOpenChange={(isOpen) => setIsUserRoleSelectOpen(isOpen)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => !(!selectedNewUser && !newUserInput.trim()) && setIsUserRoleSelectOpen(!isUserRoleSelectOpen)}
                                isExpanded={isUserRoleSelectOpen}
                                isFullWidth
                                isDisabled={!selectedNewUser && !newUserInput.trim()}
                              >
                                {selectedNewUserRoles.size > 0 ? (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                                    {Array.from(selectedNewUserRoles).map((roleId) => {
                                      const role = mockRoles.find((r) => r.id === roleId);
                                      if (!role) return null;
                                      return (
                                        <Label
                                          key={roleId}
                                          color="blue"
                                          variant="outline"
                                          onClose={() => {
                                            setSelectedNewUserRoles((prev) => {
                                              const newSet = new Set(prev);
                                              newSet.delete(roleId);
                                              return newSet;
                                            });
                                          }}
                                          id={`selected-role-label-${roleId}`}
                                        >
                                          {role.name}
                                        </Label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  'Select roles'
                                )}
                              </MenuToggle>
                            )}
                            popperProps={{ appendTo: () => document.body }}
                          >
                            <SelectList>
                              {mockRoles
                                .filter((role) => role.id !== 'role-custom')
                                .map((role) => {
                                      const isDisabled = selectedNewUser
                                    ? getExistingUserRoles(selectedNewUser).has(role.id)
                                    : false;
                                  const isSelected = selectedNewUserRoles.has(role.id);
                                  const isExpanded = expandedRoles.has(role.id);
                                      const optionContent = (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <Button
                                            variant="plain"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleRoleExpansion(role.id);
                                            }}
                                            id={`expand-role-${role.id}`}
                                            style={{ padding: 0 }}
                                          >
                                            <AngleRightIcon
                                              style={{
                                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s',
                                              }}
                                            />
                                          </Button>
                                          <span>{role.name}</span>
                                          {role.id !== 'role-custom' && (
                                            <Label color="blue" variant="outline" isCompact>
                                              {role.label}
                                            </Label>
                                          )}
                                          {isDisabled && (
                                            <Tooltip content="This role has been granted to the selected user">
                                              <ExclamationCircleIcon style={{ color: 'var(--pf-v6-global--warning-color--100)' }} />
                                            </Tooltip>
                                          )}
                                        </div>
                                      );
                                      return (
                                        <React.Fragment key={role.id}>
                                          <SelectOption
                                            value={role.id}
                                            id={`role-option-${role.id}`}
                                            hasCheckbox
                                            isSelected={isSelected}
                                            isDisabled={isDisabled}
                                            onClick={() => !isDisabled && handleRoleToggle(role.id)}
                                          >
                                            {isDisabled ? (
                                              <Tooltip content="This role has been granted to the selected user">{optionContent}</Tooltip>
                                            ) : (
                                              optionContent
                                            )}
                                          </SelectOption>
                                          {isExpanded && (
                                            <div style={{ paddingLeft: 'var(--pf-v6-global--spacer--xl)', paddingBottom: 'var(--pf-v6-global--spacer--sm)' }}>
                                              <Table variant="compact" isNested>
                                                <Thead>
                                                  <Tr>
                                                    <Th>Actions</Th>
                                                    <Th>Resources</Th>
                                                    <Th>Resource names</Th>
                                                  </Tr>
                                                </Thead>
                                                <Tbody>
                                                  <Tr>
                                                    <Td>{role.actions}</Td>
                                                    <Td>{role.resources}</Td>
                                                    <Td>{role.resourceNames}</Td>
                                                  </Tr>
                                                </Tbody>
                                              </Table>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                              })}
                            </SelectList>
                          </Select>
                        </Td>
                        <Td style={tableCellStyle}></Td>
                        <Td style={tableCellStyle}>
                          <Flex gap={{ default: 'gapSm' }}>
                            <Button
                              id="save-user-button"
                              variant="plain"
                              isDisabled={(!selectedNewUser && !newUserInput.trim()) || selectedNewUserRoles.size === 0}
                              onClick={handleSaveUser}
                              aria-label="Save user"
                            >
                              <CheckIcon />
                            </Button>
                            <Button
                              id="cancel-user-button"
                              variant="plain"
                              onClick={handleCancelAddUser}
                              aria-label="Cancel adding user"
                            >
                              <TimesIcon />
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    )}
                    </Tbody>
                    </Table>
                    <div style={{ marginTop: 'var(--pf-v6-global--spacer--md)' }}>
                      <Button
                        id="add-user-button"
                        variant="link"
                        icon={<PlusIcon />}
                        iconPosition="start"
                        onClick={handleAddUser}
                        isDisabled={isAddingUser}
                      >
                        Add user
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                      <FlexItem>
                        <UsersIcon style={{ marginRight: 'var(--pf-v6-global--spacer--sm)' }} />
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">
                          Groups
                        </Title>
                      </FlexItem>
                    </Flex>
                    <Table aria-label="Groups table" id="permissions-groups-table" isStickyHeader>
                      <Thead>
                        <Tr>
                          <Th
                            style={tableHeaderStyle}
                            sort={{
                              sortBy: groupsSortBy || {},
                              onSort: onGroupsSort,
                              columnIndex: 0,
                            }}
                          >
                            Name
                          </Th>
                          <Th
                            style={tableHeaderStyle}
                            sort={{
                              sortBy: groupsSortBy || {},
                              onSort: onGroupsSort,
                              columnIndex: 1,
                            }}
                          >
                            Role
                          </Th>
                          <Th
                            style={tableHeaderStyle}
                            sort={{
                              sortBy: groupsSortBy || {},
                              onSort: onGroupsSort,
                              columnIndex: 2,
                            }}
                          >
                            Date added
                          </Th>
                          <Th style={tableHeaderStyle}></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sortedGroups.map((group) => (
                          <Tr key={group.id}>
                            <Td dataLabel="Name" style={tableCellStyle}>
                              {group.name}
                            </Td>
                            <Td dataLabel="Role" style={tableCellStyle}>
                              {group.roles.map((roleWithDate) => {
                                const role = roleMap[roleWithDate.roleId];
                                if (!role) return null;
                                return (
                                  <div key={roleWithDate.roleId} style={{ marginBottom: 'var(--pf-v6-global--spacer--xs)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Button
                                        variant="link"
                                        isInline
                                        onClick={() => onOpenRole(roleWithDate.roleId)}
                                        id={`group-role-${group.id}-${roleWithDate.roleId}`}
                                      >
                                        {role.name}
                                      </Button>
                                      {role.id !== 'role-custom' && (
                                        <Label id={`group-role-label-${group.id}-${roleWithDate.roleId}`} color="blue" variant="outline" isCompact>
                                          {role.label}
                                        </Label>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </Td>
                            <Td dataLabel="Date added" style={tableCellStyle}>
                              {group.roles.map((roleWithDate) => (
                                <div key={`date-${roleWithDate.roleId}`} style={{ marginBottom: 'var(--pf-v6-global--spacer--xs)' }}>
                                  <span style={{ textDecoration: 'underline' }}>
                                    {roleWithDate.dateAdded}
                                  </span>
                                </div>
                              ))}
                            </Td>
                            <Td style={tableCellStyle}>
                              <Dropdown
                                id={`group-actions-dropdown-${group.id}`}
                                isOpen={openDropdowns[`group-${group.id}`] || false}
                                onSelect={() => onDropdownSelect(`group-${group.id}`)}
                                onOpenChange={(isOpen) => onDropdownToggle(`group-${group.id}`, isOpen)}
                                toggle={(toggleRef) => (
                                  <Button
                                    ref={toggleRef}
                                    id={`group-actions-${group.id}`}
                                    variant="plain"
                                    aria-label={`Actions for ${group.name}`}
                                    onClick={() => onDropdownToggle(`group-${group.id}`, !openDropdowns[`group-${group.id}`])}
                                  >
                                    <EllipsisVIcon />
                                  </Button>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                              >
                                <DropdownList>
                                  <DropdownItem
                                    key="edit"
                                    id={`group-edit-${group.id}`}
                                    onClick={() => {
                                      console.log('Edit group:', group.name);
                                      onDropdownSelect(`group-${group.id}`);
                                    }}
                                  >
                                    Edit
                                  </DropdownItem>
                                  <DropdownItem
                                    key="delete"
                                    id={`group-delete-${group.id}`}
                                    onClick={() => {
                                      console.log('Delete group:', group.name);
                                      onDropdownSelect(`group-${group.id}`);
                                    }}
                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                        {isAddingGroup && (
                          <Tr id="add-group-row">
                            <Td style={tableCellStyle}>
                              <Select
                                id="new-group-select"
                                isOpen={isGroupSelectOpen}
                                onOpenChange={(isOpen) => setIsGroupSelectOpen(isOpen)}
                                onSelect={handleGroupSelect}
                                selected={selectedNewGroup || undefined}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    variant="typeahead"
                                    onClick={() => setIsGroupSelectOpen(!isGroupSelectOpen)}
                                    isExpanded={isGroupSelectOpen}
                                    isFullWidth
                                  >
                                    <TextInputGroup isPlain>
                                      {selectedNewGroup && (
                                        <TextInputGroupMain
                                          value={selectedNewGroup}
                                          readOnly
                                          id="new-group-input-selected"
                                        />
                                      )}
                                      {!selectedNewGroup && (
                                        <TextInputGroupMain
                                          value={newGroupInput}
                                          onChange={(_event, value) => {
                                            setNewGroupInput(value);
                                          }}
                                          onFocus={() => setIsGroupSelectOpen(true)}
                                          placeholder="Type to search or create"
                                          id="new-group-input"
                                        />
                                      )}
                                      {(selectedNewGroup || newGroupInput.trim()) && (
                                        <Button
                                          variant="plain"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedNewGroup(null);
                                            setNewGroupInput('');
                                            setIsGroupSelectOpen(false);
                                          }}
                                          aria-label="Clear selection"
                                          id="clear-group-selection"
                                        >
                                          <CloseIcon />
                                        </Button>
                                      )}
                                    </TextInputGroup>
                                  </MenuToggle>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                              >
                                <SelectList>
                                  {availableGroups
                                    .filter((name) => !newGroupInput || name.toLowerCase().includes(newGroupInput.toLowerCase()))
                                    .map((name) => (
                                      <SelectOption key={name} value={name} id={`group-option-${name}`}>
                                        {name}
                                      </SelectOption>
                                    ))}
                                  {newGroupInput &&
                                    !availableGroups.some((name) => name.toLowerCase() === newGroupInput.toLowerCase()) && (
                                      <>
                                        <Divider />
                                        <SelectOption key="create" value="create" id="create-group-option">
                                          Select "{newGroupInput}"
                                        </SelectOption>
                                      </>
                                    )}
                                </SelectList>
                              </Select>
                              {selectedNewGroup && isExistingGroup(selectedNewGroup) && (
                                <Alert
                                  variant={AlertVariant.info}
                                  isInline
                                  title="This group already has roles. New roles will be merged."
                                  style={{ marginTop: 'var(--pf-v6-global--spacer--sm)' }}
                                />
                              )}
                            </Td>
                            <Td style={tableCellStyle}>
                              <Select
                                id="new-group-role-select"
                                isOpen={isGroupRoleSelectOpen}
                                onOpenChange={(isOpen) => setIsGroupRoleSelectOpen(isOpen)}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => !(!selectedNewGroup && !newGroupInput.trim()) && setIsGroupRoleSelectOpen(!isGroupRoleSelectOpen)}
                                    isExpanded={isGroupRoleSelectOpen}
                                    isFullWidth
                                    isDisabled={!selectedNewGroup && !newGroupInput.trim()}
                                  >
                                    {selectedNewGroupRoles.size > 0 ? (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                                        {Array.from(selectedNewGroupRoles).map((roleId) => {
                                          const role = mockRoles.find((r) => r.id === roleId);
                                          if (!role) return null;
                                          return (
                                            <Label
                                              key={roleId}
                                              color="blue"
                                              variant="outline"
                                              onClose={() => {
                                                setSelectedNewGroupRoles((prev) => {
                                                  const newSet = new Set(prev);
                                                  newSet.delete(roleId);
                                                  return newSet;
                                                });
                                              }}
                                              id={`selected-group-role-label-${roleId}`}
                                            >
                                              {role.name}
                                            </Label>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      'Select roles'
                                    )}
                                  </MenuToggle>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                              >
                                <SelectList>
                                  {mockRoles.map((role) => {
                                  const isDisabled = selectedNewGroup
                                    ? getExistingGroupRoles(selectedNewGroup).has(role.id)
                                    : false;
                                  const isSelected = selectedNewGroupRoles.has(role.id);
                                  const isExpanded = expandedRoles.has(role.id);
                                  const optionContent = (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Button
                                        variant="plain"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleRoleExpansion(role.id);
                                        }}
                                        id={`expand-group-role-${role.id}`}
                                        style={{ padding: 0 }}
                                      >
                                        <AngleRightIcon
                                          style={{
                                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s',
                                          }}
                                        />
                                      </Button>
                                      <span>{role.name}</span>
                                      {role.id !== 'role-custom' && (
                                        <Label color="blue" variant="outline" isCompact>
                                          {role.label}
                                        </Label>
                                      )}
                                      {isDisabled && (
                                        <Tooltip content="This role has been granted to the selected user">
                                          <ExclamationCircleIcon style={{ color: 'var(--pf-v6-global--warning-color--100)' }} />
                                        </Tooltip>
                                      )}
                                    </div>
                                  );
                                  return (
                                    <React.Fragment key={role.id}>
                                      <SelectOption
                                        value={role.id}
                                        id={`group-role-option-${role.id}`}
                                        hasCheckbox
                                        isSelected={isSelected}
                                        isDisabled={isDisabled}
                                        onClick={() => !isDisabled && handleRoleToggle(role.id)}
                                      >
                                        {isDisabled ? (
                                          <Tooltip content="This role has been granted to the selected user">{optionContent}</Tooltip>
                                        ) : (
                                          optionContent
                                        )}
                                      </SelectOption>
                                      {isExpanded && (
                                        <div style={{ paddingLeft: 'var(--pf-v6-global--spacer--xl)', paddingBottom: 'var(--pf-v6-global--spacer--sm)' }}>
                                          <Table variant="compact" isNested>
                                            <Thead>
                                              <Tr>
                                                <Th>Actions</Th>
                                                <Th>Resources</Th>
                                                <Th>Resource names</Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              <Tr>
                                                <Td>{role.actions}</Td>
                                                <Td>{role.resources}</Td>
                                                <Td>{role.resourceNames}</Td>
                                              </Tr>
                                            </Tbody>
                                          </Table>
                                        </div>
                                      )}
                                    </React.Fragment>
                                  );
                                  })}
                                </SelectList>
                              </Select>
                            </Td>
                            <Td style={tableCellStyle}></Td>
                            <Td style={tableCellStyle}>
                              <Flex gap={{ default: 'gapSm' }}>
                                <Button
                                  id="save-group-button"
                                  variant="plain"
                                  isDisabled={(!selectedNewGroup && !newGroupInput.trim()) || selectedNewGroupRoles.size === 0}
                                  onClick={handleSaveGroup}
                                  aria-label="Save group"
                                >
                                  <CheckIcon />
                                </Button>
                                <Button
                                  id="cancel-group-button"
                                  variant="plain"
                                  onClick={handleCancelAddGroup}
                                  aria-label="Cancel adding group"
                                >
                                  <TimesIcon />
                                </Button>
                              </Flex>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    <div style={{ marginTop: 'var(--pf-v6-global--spacer--md)' }}>
                      <Button
                        id="add-group-button"
                        variant="link"
                        icon={<PlusIcon />}
                        iconPosition="start"
                        onClick={handleAddGroup}
                        isDisabled={isAddingGroup}
                      >
                        Add group
                      </Button>
                    </div>
                  </div>
                </PageSection>
              </TabContentBody>
            </TabContent>
          </Tab>
        </Tabs>
      </PageSection>
      <Modal
        variant={ModalVariant.large}
        isOpen={isRoleModalOpen}
        onClose={closeRoleModal}
        title={selectedRoleId && roleMap[selectedRoleId] ? roleMap[selectedRoleId].name : 'Role details'}
        id="role-details-modal"
      >
        {selectedRoleId && roleMap[selectedRoleId] && (
          <Tabs
            activeKey={activeRoleModalTab}
            onSelect={(_event, key) => setActiveRoleModalTab(key as 'details' | 'assignees')}
            mountOnEnter
            unmountOnExit
          >
            <Tab eventKey="details" title={<TabTitleText>Role details</TabTitleText>}>
              <div style={{ marginBottom: 'var(--pf-v6-global--spacer--sm)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Label color="blue" variant="outline" isCompact>
                  AI
                </Label>
              </div>
              <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                {roleMap[selectedRoleId].description || 'Description goes here'}
              </div>
              <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong>Real role name</strong>
                <Popover
                  aria-label="Real role name info"
                  bodyContent="This is the K8s name of this role. You can find the role in OpenShift with this real name."
                >
                  <Button variant="plain" aria-label="Real role name help">
                    <QuestionCircleIcon />
                  </Button>
                </Popover>
              </div>
              <div style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }}>
                <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                  {roleMap[selectedRoleId].realName || '—'}
                </ClipboardCopy>
              </div>
              <Divider style={{ marginBottom: 'var(--pf-v6-global--spacer--md)' }} />
              <Title headingLevel="h3" size="lg" style={{ marginBottom: 'var(--pf-v6-global--spacer--sm)' }}>
                Rules
              </Title>
              <Table aria-label="Role rules table" id="role-rules-table">
                <Thead>
                  <Tr>
                    <Th>Actions</Th>
                    <Th>Resources</Th>
                    <Th>Resource names</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{roleMap[selectedRoleId].actions}</Td>
                    <Td>{roleMap[selectedRoleId].resources}</Td>
                    <Td>{roleMap[selectedRoleId].resourceNames}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Tab>
            <Tab eventKey="assignees" title={<TabTitleText>Assignees</TabTitleText>}>
              <Table aria-label="Role assignees table" id="role-assignees-table">
                <Thead>
                  <Tr>
                    <Th>Subject</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {roleMap[selectedRoleId].assignees.map((assignee) => (
                    <Tr key={assignee}>
                      <Td>{assignee}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Tab>
          </Tabs>
        )}
      </Modal>
    </>
  );
};

export { ProjectDetails };

