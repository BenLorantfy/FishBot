// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '*',
      name: 'index',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IndexPage'),
          import('containers/IndexPage/sagas'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component, sagas]) => {
          renderRoute(component);
          injectSagas(sagas.default);
        });

        importModules.catch(errorLoading);
      },
    }
  ];
}