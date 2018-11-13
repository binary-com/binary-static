import React                      from 'react';
import Routes                     from './Containers/Routes/routes.jsx';
import PortfolioDrawer            from './Components/Elements/PortfolioDrawer';
import ToastMessage               from './Containers/toast_message.jsx';
import { POSITIONS }              from './Components/Elements/ToastMessage';
import AppContents                from './Containers/Layout/app_contents.jsx';
import Header                     from './Containers/Layout/header.jsx';
import ErrorBoundary              from './Components/Elements/Errors/error_boundary.jsx';
import DenialOfServiceModal       from './Components/Elements/DenialOfServiceModal';
import { isClientAllowedToVisit } from './Middlewares/is_client_allowed_to_visit';
import Footer                     from './Containers/Layout/footer.jsx';
import ThemeWrapper               from './Containers/Layout/theme_wrapper.jsx';

const App = () => (
    <ThemeWrapper>
        <div id='header'>
            <Header />
        </div>
        <ErrorBoundary>
            <AppContents>
                <Routes />
                <PortfolioDrawer />
                <ToastMessage position={POSITIONS.TOP_RIGHT} />
            </AppContents>
            <DenialOfServiceModal is_visible={!isClientAllowedToVisit()} />
        </ErrorBoundary>
        <footer id='footer'>
            <Footer />
        </footer>
    </ThemeWrapper>

);

export default App;
