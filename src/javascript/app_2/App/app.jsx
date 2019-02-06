import PropTypes                   from 'prop-types';
import React                       from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import getBaseName                 from 'Utils/URL/base_name';
import { MobxProvider }            from 'Stores/connect';
import ErrorBoundary               from './Components/Elements/Errors/error_boundary.jsx';
import PositionsDrawer             from './Components/Elements/PositionsDrawer';
import { POSITIONS }               from './Components/Elements/ToastMessage';
import ToastMessage                from './Containers/toast_message.jsx';
import AppContents                 from './Containers/Layout/app_contents.jsx';
import Footer                      from './Containers/Layout/footer.jsx';
import Header                      from './Containers/Layout/header.jsx';
import ThemeWrapper                from './Containers/Layout/theme_wrapper.jsx';
import Routes                      from './Containers/Routes/routes.jsx';
import DenialOfServiceModal        from './Containers/DenialOfServiceModal';

const App = ({ root_store }) => (
    <Router basename={getBaseName()}>
        <MobxProvider store={root_store}>
            <ThemeWrapper>
                <div id='header'>
                    <Header />
                </div>
                <ErrorBoundary>
                    <AppContents>
                        <Routes />
                        <PositionsDrawer />
                        <ToastMessage position={POSITIONS.TOP_RIGHT} />
                    </AppContents>
                    <DenialOfServiceModal />
                </ErrorBoundary>

                <footer id='footer'>
                    <Footer />
                </footer>
            </ThemeWrapper>
        </MobxProvider>
    </Router>
);

App.propTypes = {
    root_store: PropTypes.object,
};

export default App;
