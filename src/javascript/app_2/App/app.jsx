import PropTypes                    from 'prop-types';
import React                        from 'react';
import { BrowserRouter as Router }  from 'react-router-dom';
import getBaseName                  from 'Utils/URL/base_name';
import { MobxProvider }             from 'Stores/connect';
import LandingCompanyTradingAllowed from 'App/Middlewares/prevent_blacklisted_landing_companies';
import ErrorBoundary                from './Components/Elements/Errors/error_boundary.jsx';
import PortfolioDrawer              from './Components/Elements/PortfolioDrawer';
import AppContents                  from './Containers/Layout/app_contents.jsx';
import Footer                       from './Containers/Layout/footer.jsx';
import Header                       from './Containers/Layout/header.jsx';
import ThemeWrapper                 from './Containers/Layout/theme_wrapper.jsx';
import Routes                       from './Containers/Routes/routes.jsx';
import DenialOfServiceModal         from './Components/Elements/DenialOfServiceModal';

// Conditionally loading mobx only on development builds.
// see https://github.com/mobxjs/mobx-react-devtools/issues/66
const { Fragment } = React;
const DevTools = process.env.NODE_ENV !== 'production' ? require('mobx-react-devtools').default : Fragment;


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
                        <DevTools />
                        <PortfolioDrawer />
                    </AppContents>
                    <DenialOfServiceModal show={!LandingCompanyTradingAllowed()} />
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
