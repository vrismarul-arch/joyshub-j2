import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { useState, useEffect } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  // --- Check login token ---
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setLoggedIn(!!token);
  }, []);

  // --- GTM + Meta Pixel injected only once globally ---
  useEffect(() => {
    // --- Google Tag Manager ---
    if (!document.getElementById("gtm-script")) {
      const gtmScript = document.createElement("script");
      gtmScript.id = "gtm-script";
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-53FG3M8M');`;
      document.head.appendChild(gtmScript);

      const gtmNoscript = document.createElement("noscript");
      gtmNoscript.id = "gtm-noscript";
      gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-53FG3M8M"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.prepend(gtmNoscript);
    }

    // --- Facebook Meta Pixel ---
    if (!document.getElementById("fb-script")) {
      const fbScript = document.createElement("script");
      fbScript.id = "fb-script";
      fbScript.innerHTML = `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '848234247728458');
        fbq('track', 'PageView');`;
      document.head.appendChild(fbScript);

      const fbNoscript = document.createElement("noscript");
      fbNoscript.id = "fb-noscript";
      fbNoscript.innerHTML = `<img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=848234247728458&ev=PageView&noscript=1"/>`;
      document.body.prepend(fbNoscript);
    }
  }, []);

  // --- Track page views on route changes ---
  function PageViewTracker() {
    const location = useLocation();
    useEffect(() => {
      if (window.fbq) window.fbq("track", "PageView");
      if (window.dataLayer) window.dataLayer.push({ event: "pageview", page: location.pathname });
    }, [location]);
    return null;
  }

  if (loggedIn === null) return null;

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => setLoggedIn(false);

  return (
    <BrowserRouter>
      <PageViewTracker />
      <AppRoutes loggedIn={loggedIn} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

export default App;
