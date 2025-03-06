// frontend/app/layout.js

'use client';

import './globals.css';
import { Provider } from 'react-redux';
import store, { persistor } from '../store/index'; // Adjust the path if necessary
import { PersistGate } from 'redux-persist/integration/react';

/**
 * RootLayout Component
 * Wraps the application with Redux Provider and PersistGate.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
