import Layout from "./Layout.jsx";

import Landing from "./Landing";

import Appeal from "./Appeal";

import Blog from "./Blog";

import AppealFeedback from "./AppealFeedback";

import UserDashboard from "./UserDashboard";

import UserProfile from "./UserProfile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Landing: Landing,
    
    Appeal: Appeal,
    
    Blog: Blog,
    
    AppealFeedback: AppealFeedback,
    
    UserDashboard: UserDashboard,
    
    UserProfile: UserProfile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Landing />} />
                
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Appeal" element={<Appeal />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/AppealFeedback" element={<AppealFeedback />} />
                
                <Route path="/UserDashboard" element={<UserDashboard />} />
                
                <Route path="/UserProfile" element={<UserProfile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}