
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap/gsap-core';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import '../styles/landing-page.css';
import '../utils/credentials'
import { CREDENTIALS } from '../utils/credentials';

function LandingPage() {
  const wrapperRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const menuWrapperRef = useRef(null);
  const mainMenuRef = useRef(null);
  const subMenuRef = useRef(null);
  const subMenuInsideRef = useRef(null);
  const markRef = useRef(null);

  const [mainMenuData, setMainMenuData] = useState([]);
  const [bottomMenuData, setBottomMenuData] = useState([]);
  const [outerActiveMenu, setOuterActiveMenu] = useState(null);
  const [innerActiveMenu, setInnerActiveMenu] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('main');

  useEffect(() => {
    const fetchMenuData = async (url, setData) => {
      const { username, password } = CREDENTIALS;
      const base64credentials = btoa(`${username}:${password}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${base64credentials}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error(`Failed to fetch data from ${url}`);
      }
    };

    fetchMenuData(
      'https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/menu-items?menus=5&_fields=id,title,url,parent',
      setMainMenuData
    );

    fetchMenuData(
      'https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/menu-items?menus=9&_fields=id,title,url,parent',
      setBottomMenuData
    );

    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    )
      .fromTo(
        textRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .to(logoRef.current, { opacity: 0, duration: 0.8 }, '+=1')
      .to(textRef.current, { opacity: 0, duration: 0.8 }, '-=0.6')
      .set(wrapperRef.current, { display: 'none' })
      .set(menuWrapperRef.current, { display: 'block' })
      .fromTo(
        markRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      )
      .fromTo(
        mainMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (subMenuRef.current) {
      gsap.fromTo(
        subMenuRef.current,
        { opacity: 0, },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [outerActiveMenu]);

  useEffect(() => {
    if (subMenuInsideRef.current) {
      gsap.fromTo(
        subMenuInsideRef.current,
        { opacity: 0},
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [innerActiveMenu]);

  const outerMenuItems = mainMenuData.filter((item) => item.parent === 0);
  const innerMenuItems = mainMenuData.filter((item) => item.parent !== 0);

  const handleBackButton = () => {
  if (currentMenu === 'inner-submenu') {
    gsap.to(subMenuInsideRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentMenu('submenu');
        setInnerActiveMenu(null);
        gsap.fromTo(
          subMenuRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    });
  } else if (currentMenu === 'submenu') {
    gsap.to(subMenuRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentMenu('main');
        setOuterActiveMenu(null);
        gsap.fromTo(
          mainMenuRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    });
  }
};



  const toggleOuterMenu = (menu) => {
    if (isMobileView) {
      setOuterActiveMenu(menu);
      setCurrentMenu('submenu');
    } else {
      if (outerActiveMenu === menu) {
        setOuterActiveMenu(null);
        setInnerActiveMenu(null);
      } else {
        setOuterActiveMenu(menu);
        setInnerActiveMenu(null);
      }
    }
  };
  
  const toggleInnerMenu = (submenu) => {
    if (isMobileView) {
      const hasInnerSubmenu = innerMenuItems.some((item) => item.parent === submenu);
  
      if (hasInnerSubmenu) {
        setInnerActiveMenu(submenu);
        setCurrentMenu('inner-submenu');
      } else {
        const selectedItem = innerMenuItems.find((item) => item.id === submenu);
        if (selectedItem?.url) {
          window.location.href = selectedItem.url; 
        }
      }
    } else {
      if (innerActiveMenu === submenu) {
        setInnerActiveMenu(null);
      } else {
        setInnerActiveMenu(submenu);
      }
    }
  };
  


  if (isMobileView) {
    const getActiveMenuName = () => {
      if (currentMenu === 'submenu') {
        const activeMenu = outerMenuItems.find((item) => item.id === outerActiveMenu);
        return activeMenu ? parse(activeMenu.title.rendered) : '';
      }
      if (currentMenu === 'inner-submenu') {
        const activeSubmenu = innerMenuItems.find((item) => item.id === innerActiveMenu);
        return activeSubmenu ? parse(activeSubmenu.title.rendered) : '';
      }
      return '';
    };
  
    return (
      <div className='LandingPage-Background'>
        <video
        src="https://doctest.a2hosted.com/clubsoda/wp-backend/wp-content/uploads/2025/01/bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      >
      </video>
        <div className="LandingPage-Wrapper" ref={wrapperRef}>
          <div className="LandingPage-Logo" ref={logoRef}></div>
          <div className="LandingPage-Textbox" ref={textRef}>
            <h2><span>An Experiential</span> Network Agency</h2>
          </div>
        </div>
  
        <div className="LandingPage-Menu-Wrapper" ref={menuWrapperRef}>
          <div className="LandingPage-Header">
            <div className="LandingPage-mark" ref={markRef}></div>
          </div>
          <div ref={mainMenuRef}>
          {currentMenu !== 'main' && (
            <span className="back-header">
              <button className="back-button" onClick={handleBackButton}>
              <i className="fa-solid fa-arrow-left" style={{color: "#ffffff",}}></i>
              <h3 className="menu-heading">{getActiveMenuName()}</h3>
              </button>
            </span>
          )}
          {currentMenu === 'main' && (
            <div className="LandingPage-mainmenu-wrapper" >
              <div className="LandingPage-mainmenu">
                <ul className="list-unstyled">
                  {outerMenuItems.map((item) => (
                    <li key={item.id} onClick={() => toggleOuterMenu(item.id)}>
                      <a>{parse(item.title.rendered)}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="LandingPage-bottom-menu">
                <ul>
                  {bottomMenuData.map((item) => (
                    <li key={item.id}>
                      <Link to={`/${item.title.rendered.toLowerCase()}`}>
                        {parse(item.title.rendered)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
  
          {currentMenu === 'submenu' && (
            <div className="submenu" ref={subMenuRef}>
              <ul>
                {innerMenuItems
                  .filter((item) => item.parent === outerActiveMenu)
                  .map((item) => (
                    <li key={item.id} onClick={() => toggleInnerMenu(item.id)}>
                      <a>{parse(item.title.rendered)}
                      <img
                          src={
                            innerMenuItems.some(
                              (inner) => inner.parent === item.id
                            )
                              ? '/clubsoda/assets/left.svg'
                              : '/clubsoda/assets/open.svg'
                          }
                          alt="Submenu Icon"
                          className="menu-arrow"
                        />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {currentMenu === 'inner-submenu' && (
            <div className="submenu-inside" ref={subMenuInsideRef}>
              <ul>
                {innerMenuItems
                  .filter((item) => item.parent === innerActiveMenu)
                  .map((item) => (
                    <li key={item.id}>
                      <Link to={item.url}>{parse(item.title.rendered)}
                      <img
                          src="/clubsoda/assets/open.svg"
                          alt="External Link Icon"
                          className="menu-arrow"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }
  

  return (
    <div className='LandingPage-Background'>
      <video
        src="https://doctest.a2hosted.com/clubsoda/wp-backend/wp-content/uploads/2025/01/bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      >
      </video>

      <div className="LandingPage-Wrapper" ref={wrapperRef}>
        <div className="LandingPage-Logo" ref={logoRef}></div>
        <div className="LandingPage-Textbox" ref={textRef}>
          <h2>An Experiential Network Agency</h2>
        </div>
      </div>

      <div
        className="LandingPage-Menu-Wrapper"
        ref={menuWrapperRef}
        style={{ display: 'none' }}
      >
        <div className="LandingPage-Header">
          <div className="LandingPage-mark" ref={markRef}></div>
        </div>
        <div className="LandingPage-menu-wrapper">
          <div className="LandingPage-mainmenu-wrapper" ref={mainMenuRef}>
            <div className="LandingPage-mainmenu">
              <ul className="list-unstyled">
                {outerMenuItems.map((item) => (
                  <li
                    key={item.id}
                    className={`menu-item ${
                      outerActiveMenu === item.id ? 'submenu-active' : ''
                    }`}
                    onClick={() => toggleOuterMenu(item.id)}
                  >
                    <a>{parse(item.title.rendered)}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="LandingPage-bottom-menu">
              <ul>
                {bottomMenuData.map((item) => (
                  <li key={item.id}>
                    <Link to={`/${item.title.rendered.toLowerCase()}`}>
                      {parse(item.title.rendered)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Render submenu for the outer menu */}
          {outerActiveMenu && (
            <div className="submenu" ref={subMenuRef}>
              <ul>
                {innerMenuItems
                  .filter((item) => item.parent === outerActiveMenu)
                  .map((item) => (
                    <li
                      key={item.id}
                      className={`menu-item ${
                        innerActiveMenu === item.id ? 'submenu-active' : ''
                      }`}
                      onClick={() => toggleInnerMenu(item.id)}
                    >
                      <a>
                        {parse(item.title.rendered)}
                        <img
                          src={
                            innerMenuItems.some(
                              (inner) => inner.parent === item.id
                            )
                              ? '/clubsoda/assets/left.svg'
                              : '/clubsoda/assets/open.svg'
                          }
                          alt="Submenu Icon"
                          className="menu-arrow"
                        />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* Render inner submenus */}
          {innerActiveMenu && (
            <div className="submenu-inside" ref={subMenuInsideRef}>
              <ul>
                {innerMenuItems
                  .filter((item) => item.parent === innerActiveMenu)
                  .map((item) => (
                    <li key={item.id}>
                      <Link to={item.url}>
                        {parse(item.title.rendered)}
                        <img
                          src="/clubsoda/assets/open.svg"
                          alt="External Link Icon"
                          className="menu-arrow"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
