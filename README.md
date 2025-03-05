## Technical Documentation

### Project Structure

- **src/**: Contains all the source code for the application.
  - **components/**: Reusable UI components.
  - **config/**: Configuration files.
  - **hooks/**: Custom hooks.
  - **interface/**: TypeScript interfaces.
  - **lib/**: Utility functions.
  - **pages/**: Page components.
  - **redux/**: Redux store and slices.
  - **service/**: API service functions.

### Key Components

- **DoctorProfile**: Manages the doctor's profile information.
- **PatientDetails**: Displays detailed information about a patient.
- **Diagnose**: Allows patients to input symptoms and get AI-generated diagnoses.

### State Management

- **Redux**: Used for global state management.
  - **store.ts**: Configures the Redux store.
  - **authSlice.ts**: Manages authentication state.

### API Integration

- **axios**: Used for making HTTP requests.
  - **doctorService.ts**: Contains functions for fetching and updating doctor-related data.

### Environment Variables

- **VITE_BASE_URL**: Base URL for the API.

### UI Components

- **ShadCN**: Used for building UI components.

### Packages and Libraries

- **axios**: For making HTTP requests.
- **framer-motion**: For animations.
- **lucide-react**: For icons.
- **react-redux**: For state management.
- **sonner**: For toast notifications.
- **react-router**: For routing.

### Running the Project

1. Install dependencies:
   ```
   npm i --legacy-peer-deps
   ```
2. Start the development server:
   ```
   npm run dev
   ```

### Deployment

1. Build the project:
   ```
   npm run build
   ```
2. Serve the build files:
   ```
   npm run serve
   ```

### Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

### License

This project is licensed under the MIT License.
