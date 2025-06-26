# Entity Manager

A Next.js web application for managing interconnected data entities and their properties. Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### Authentication
- Simulated authentication system (accepts any valid email)
- Two distinct layouts: authenticated and unauthenticated
- User profile dropdown with logout functionality

### Entity Management
- View and search entities in a hierarchical structure
- Three-column layout for efficient data navigation:
  - **Entities List**: Main entities with search functionality
  - **Children List**: Related child entities
  - **Detail View**: Comprehensive entity information
- Add new entities and children (UI ready, backend implementation pending)

### User Interface
- Responsive design with Tailwind CSS
- Modern UI components from shadcn/ui
- Clean, professional layout with header, footer, and body content
- Search functionality for entities
- Interactive selection with visual feedback

### Data Management
- Repository layer for clean data access
- JSON-based data storage (simulating database tables)
- RESTful API endpoints for data operations
- Type-safe interfaces for entities and child entities

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── entities/      # Entity endpoints
│   │   └── children/      # Child entity endpoints
│   ├── globals.css        # Global styles
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── content/           # Main content components
│   ├── entities/          # Entity-related components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
└── data/                  # JSON data files
```

## Data Schema

### Entities (entities.json)
```json
{
  "entity_key": "string",
  "entity_name": "string",
  "entity_property1": "string"
}
```

### Children (children.json)
```json
{
  "child_entity_key": "string",
  "entity_key": "string",
  "child_entity_name": "string",
  "child_entity_property1": "string"
}
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd entity-manager
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. **Unauthenticated State**: 
   - View the welcome page with application overview
   - Click "Login" to access the application

2. **Authentication**:
   - Enter any valid email address (e.g., `user@example.com`)
   - The system will simulate successful authentication

3. **Entity Management**:
   - Browse entities in the left column
   - Use the search box to filter entities
   - Select an entity to view its children in the middle column
   - View detailed information in the right column
   - Select a child entity to view its details

4. **Additional Features**:
   - Use "Login Help" (unauthenticated) or "Feedback" (authenticated) buttons in the footer
   - Access user menu via the username in the header
   - Add new entities and children (UI ready for future implementation)

## API Endpoints

- `GET /api/entities` - Get all entities (with optional search parameter)
- `GET /api/entities/[key]` - Get specific entity by key
- `GET /api/children` - Get children (with optional entityKey parameter)
- `GET /api/children/[key]` - Get specific child by key

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Storage**: JSON files (simulating database)

## Future Enhancements

- Real GitHub OAuth integration
- PostgreSQL database integration
- CRUD operations for entities and children
- Advanced search and filtering
- Data export/import functionality
- User roles and permissions
- Audit logging
- Real-time collaboration features

## Development

### Adding New Components
1. Create component in appropriate directory under `src/components/`
2. Use shadcn/ui components for consistency
3. Follow TypeScript best practices
4. Add proper error handling

### Adding New API Endpoints
1. Create route file in `src/app/api/`
2. Use the repository pattern for data access
3. Implement proper error handling
4. Add TypeScript interfaces for request/response

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Use shadcn/ui components when possible
- Maintain responsive design principles

## License

This project is licensed under the MIT License.
