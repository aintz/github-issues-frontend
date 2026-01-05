# GitHub Issues Frontend

A web application for browsing and searching GitHub issues from the React repository, with filtering, sorting, and search capabilities.

You can take a look at the deployed project [here](https://github-issues-frontend.vercel.app/)

## Prerequisites

- Node.js (v18 or higher recommended)
- A GitHub Personal Access Token with `repo` scope

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_GH_TOKEN=your_github_personal_access_token
```

To generate a GitHub token:

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic)
3. Select the `repo` scope
4. Copy the token and add it to your `.env` file

### 3. Generate GraphQL types

```bash
npm run codegen
```

This will fetch the GitHub GraphQL schema and generate TypeScript types.

### 4. Start the development server

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run codegen` - Generate GraphQL types from schema
- `npm test` - Run tests (when configured)

## Key Features Explained

### Adapter Pattern for Data Normalization

The app uses an adapter pattern to normalize data from different sources (list queries vs search queries), eliminating repetitive ternary operations:

```typescript
// src/features/issues/adapters/issueDataAdapter.ts
export function normalizeSearchData(searchResult: any): NormalizedIssueData
export function normalizeListData(listData: any, ...): NormalizedIssueData
```

### Custom Hooks Architecture

- `useIssueFilters` - Manages URL-based filters and search params
- `useProcessedIssueData` - Normalizes and processes issue data
- `useListPagination` - Handles cursor-based pagination for lists
- `useSearchPagination` - Handles cursor-based pagination for search
- `useSearchHandlers` - Manages search interactions

### GraphQL Integration

The app uses GraphQL Code Generator to create type-safe hooks from GraphQL operations:

```typescript
const { data, loading, error } = useIssuesQuery({
  variables: { owner, name, states, first, after, orderBy },
});
```

## Testing

The project uses Vitest and React Testing Library for testing:

```bash
npm run test        # Run tests
```

Tests are located alongside their components in `__tests__` directories.

## CI / CD

This project uses **GitHub Actions** for continuous integration:

- Type checking
- Tests
- Production build and deployment to Vercel

## Future Enhancements

TBD

## License

This project is licensed under the MIT License.
