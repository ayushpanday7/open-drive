// declare module 'react-server-dom-webpack/server' {
//   import type { ReactNode } from 'react';

//   export function renderToReadableStream(
//     children: ReactNode,
//     options?: {
//       moduleMap?: Record<string, any>;
//       onError?: (error: Error) => void;
//     }
//   ): Promise<ReadableStream<any>>;
// }

declare module 'react-server-dom-webpack/server.browser';

declare module 'react-server-dom-webpack/client' {
  export * from 'react-dom/client';
}

declare module 'react-server-dom-webpack/client.browser' {
  // Add any known types or leave as an empty module declaration
}
