import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Flex,
  FlexItem,
  InputGroup,
  PageSection,
  Pagination,
  PaginationVariant,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { HelpIcon } from '@patternfly/react-icons';

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

const PER_PAGE_DEFAULT = 10;

const Projects: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(PER_PAGE_DEFAULT);

  const onSearchChange = (_value: string, event: React.FormEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
    setPage(1);
  };

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
  ) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const filteredProjects = React.useMemo(() => {
    if (!searchValue.trim()) {
      return mockProjects;
    }

    const needle = searchValue.toLowerCase();
    return mockProjects.filter((project) => {
      return project.name.toLowerCase().includes(needle);
    });
  }, [searchValue]);

  const itemCount = filteredProjects.length;
  const pagedProjects = React.useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredProjects.slice(start, end);
  }, [filteredProjects, page, perPage]);

  const pagination = (
    <Pagination
      widgetId="projects-pagination"
      itemCount={itemCount}
      perPage={perPage}
      page={page}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      variant={PaginationVariant.top}
      isCompact
    />
  );

  return (
    <PageSection hasBodyWrapper={false} id="projects-page">
      <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <FlexItem>
          <Title headingLevel="h1" size="2xl">
            Projects
          </Title>
        </FlexItem>
        <FlexItem>
          <Button id="projects-start-basic-workbench-button" variant="secondary">
            Start basic workbench
          </Button>
        </FlexItem>
      </Flex>
      <Toolbar id="projects-toolbar" inset={{ default: 'insetNone' }}>
        <ToolbarContent>
          <ToolbarItem>
            <InputGroup>
              <TextInput
                id="projects-name-filter-input"
                name="projects-name-filter-input"
                type="search"
                aria-label="Filter by project name"
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Filter by name"
              />
              <Button id="projects-search-button" variant="control" aria-label="Search projects" />
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Button id="projects-create-project-button" variant="primary">
              Create project
            </Button>
          </ToolbarItem>
          <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
            {pagination}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Projects table" id="projects-table" isStickyHeader>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Created</Th>
            <Th>
              Workbenches{' '}
              <Button
                id="projects-workbenches-help"
                variant="plain"
                aria-label="More info about workbenches"
              >
                <HelpIcon />
              </Button>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {pagedProjects.map((project) => (
            <Tr key={project.id}>
              <Td dataLabel="Name">
                <Button
                  id={`project-link-${project.id}`}
                  variant="link"
                  isInline
                  component={(props) => <Link to={`/projects/${project.id}`} {...props} />}
                >
                  {project.name}
                </Button>
                <div>{project.owner}</div>
                {project.description && <div>{project.description}</div>}
              </Td>
              <Td dataLabel="Created">{project.createdAt}</Td>
              <Td dataLabel="Workbenches">
                <Button
                  id={`project-workbench-launch-${project.id}`}
                  variant="plain"
                  aria-label={`Open workbenches for ${project.name}`}
                />
                {' '}
                {project.workbenchRunning} <span aria-hidden="true">●</span>{' '}
                {project.workbenchStopped}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
  </PageSection>
);
};

export { Projects };


