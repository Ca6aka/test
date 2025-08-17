// Security utilities for production environment

// Override console methods in production to prevent sensitive data exposure
export const secureConsole = () => {
  if (import.meta.env.MODE === 'production') {
    const noop = () => {};
    
    // Override console methods that could expose sensitive data
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
    console.debug = noop;
    console.trace = noop;
    console.table = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.time = noop;
    console.timeEnd = noop;
    console.timeLog = noop;
    console.count = noop;
    console.countReset = noop;
    console.clear = noop;
    console.dir = noop;
    console.dirxml = noop;
    console.assert = noop;
    
    // Hide React DevTools and other debugging tools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
    }
    
    // Prevent right-click context menu in production
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    });
    
    // Clear sensitive data from localStorage/sessionStorage
    const sensitiveKeys = ['auth_token', 'user_session', 'password'];
    sensitiveKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

// Initialize security measures when module is imported
if (typeof window !== 'undefined') {
  secureConsole();
}