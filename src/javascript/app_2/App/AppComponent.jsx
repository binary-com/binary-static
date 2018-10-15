import PropTypes                   from 'prop-types';
import React                       from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import DevTools                    from 'mobx-react-devtools';
import ErrorBoundary               from 'App/Components/Elements/Errors/ErrorBoundary';
import AppContents                 from 'App/Containers/Layout/app_contents';
import Footer                      from 'App/Containers/Layout/footer';
import Header                      from 'App/Containers/Layout/header';
import ThemeWrapper                from 'App/Containers/Layout/theme_wrapper';
import Routes                      from 'App/Containers/Routes/routes';
import PortfolioDrawer             from 'App/Components/Elements/PortfolioDrawer';
import { MobxProvider }            from 'Stores/connect';
import getBaseName                 from 'Utils/URL/base_name';

const AppComponent = ({ root_store }) => (
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
                </ErrorBoundary>

                <footer id='footer'>
                    <Footer />
                </footer>
            </ThemeWrapper>
        </MobxProvider>
    </Router>
);

AppComponent.propTypes = {
    root_store: PropTypes.object,
};

export default AppComponent;
