import React from 'react';
import { useState } from 'react';

import videoBg from '../../../assets/heroSectionBg.mp4';
import editorExample from '../../../assets/creatorExample.png';
import './mainPage.css';

import exp1 from '../../../assets/exp1.png';
import exp2 from '../../../assets/exp2.png';
import exp3 from '../../../assets/exp3.png';
import exp4 from '../../../assets/exp4.png';
import exp5 from '../../../assets/exp5.png';
import dashboardImg from '../../../assets/dashboard.png'
import checkedIcon from '../../../assets/checkedIcon.svg'
export default function HeroSection() {
        const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All",
        "Portfolios",
        "Businesses",
        "Events",
        "Personal"
    ];
    return (
        <div className="main-page">
            <div className="hero-section">
                <h6 className="adn"><span className="dot"></span>Now in public beta <span className="version">v1.0</span></h6>
                <h1 className="hero-title">Build stunning pages.<br />
                    <span className="gradient1">Ship in minutes.</span></h1>
                <h4>PageCraft gives you a live visual editor, beautiful templates, and instant publishing - everything you need to launch a professional one-page site today.</h4>
                <div className="hero-buttons">
                    <button className="cta-button">Start building free</button>
                    <button className="secondary-button">Learn more</button>
                </div>
                <div className="hero-stats">
                    <div>
                        <p className="stat-number gradient2">12,400+</p>
                        <p className="stat-label">Pages created</p>
                    </div>

                    <div>
                        <p className="stat-number gradient2">500+</p>
                        <p className="stat-label">Templates</p>
                    </div>

                    <div>
                        <p className="stat-number gradient2">99%</p>
                        <p  className="stat-label">Uptime</p>
                    </div>
                </div>
            </div>
        <div className="editorExample ">
            <h5>Live Editor</h5>
            <h1>See changes. <span className="gradient1">Instantly.</span></h1>
            <h4>Tweak fonts, colors, and layout in the editor panel - your page updates in real time on the right.</h4>
            <img src={editorExample} alt="Editor Example" className="editor-image" />

        </div>

        <div className="templatesExample ">
            <h5>Template Gallery</h5>
            <h1>Start with  <span className="gradient2">perfection</span></h1>
            <h4>Professionally designed templates for portfolios, businesses, events, and more. One click to customize.</h4>
            <div className="template-categories">
            {categories.map((category) => (
                <button
                    key={category}
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => setActiveCategory(category)}
                >
                    {category}
                </button>
            ))}

            </div>
            <div className="exampleImages">
                <div><img src={exp1} alt="exp1" />
                <p>Lumen Portfolio<br /><button className='greenBtn'>Minimal</button> <button className='greenBtn'>Dark</button></p>

                </div>

                <div><img src={exp2} alt="exp2" />
                <p>Prism Business<br /><button className='purpleBtn'>Bold</button> <button className='purpleBtn'>Corporate</button></p>
                </div>
                <div><img src={exp3} alt="exp3" />
                <p>Horizon Event<br /><button className='orangeBtn'>Vibrant</button> <button className='orangeBtn'>Landing</button></p>
                </div>
                <div><img src={exp4} alt="exp4" />
                <p>Orbit SaaS<br /><button className='cyanBtn'>Futuristic</button> <button className='cyanBtn'>Tech</button></p>
                </div>
                <div><img src={exp5} alt="exp5" />
                <p>Dusk Personal<br /><button className='yellowBtn'>Warm</button> <button className='yellowBtn'>Editorial</button></p>
                </div>
            </div>
            <button className="browseTemplates">Browse all 40+ templates</button>
        </div>
         <div className="editorExample height">
            <h5>User Dashboard</h5>
            <h1>Everything in <span className="gradient3">one place.</span></h1>
            <h4>Manage all your pages from a clean central hub. Toggle publish status, edit your slug, and track live traffic.</h4>
            <img src={dashboardImg} alt="Editor Example" className="dashboard-image" />

        </div>
               <div className="editorExample height">
            <h5>Pricing</h5>
            <h1>Pay for pages, <span className="gradient1">not features.</span></h1>
            <h4>Simple, transparent pricing based on how many pages you need. All plans include every feature.</h4>
            <div className="price-cards">
                <div className='freeCart'>
                    <section className='plan'> <h3> Free </h3> <span className="circle">0</span></section>
                    <p>Try PageCraft with no commitment.</p>
                    <section className='price'>
                    <h2>Free</h2>
                    </section>
                    <p className="note"><span className="shade">Up to </span> 5 working pages</p>
                    <ul>
                        <li><i className="fa-solid fa-check"></i>Full access to the visual website builder</li>
                        <li><i className="fa-solid fa-check"></i>All free templates available in the gallery</li>
                        <li><i className="fa-solid fa-check"></i>Unlimited project saving as drafts</li>
                        <li><i className="fa-solid fa-check"></i>Live website preview inside the dashboard</li>

                    </ul>
                    <button className="cartBtn">Get started</button>
                </div>
                <div className='basicCart'><section className='plan'> <h3> Basic </h3> <span className="circle colorOrang">1</span></section>
                    <p>Perfect for freelancers and creators.</p>
                    <section className='price'>
                    <h2 className='colorOrang'>$9</h2> <p>per month</p>
                    </section>
                    <p className="note colorOrang"><span className="shade">Up to </span> 1 active page</p>
                    <ul>
                        <li><i className="fa-solid fa-check colorOrang"></i>1 published website online</li>
                        <li><i className="fa-solid fa-check colorOrang"></i>Your own unique URL (e.g. pagecraft.pl/your-name)</li>
                        <li><i className="fa-solid fa-check colorOrang"></i>Fast and secure hosting included</li>
                        <li><i className="fa-solid fa-check colorOrang"></i>No "Made with PageCraft" watermark</li>
                        <li><i className="fa-solid fa-check colorOrang"></i>Basic technical support</li>
                    </ul>
                    <button className="cartBtn">Start Basic</button></div>
                <div className='proCart'><section className='plan'> <h3> Pro </h3> <span className="circle colorPurpl">3</span></section>
                    <p>For agencies and power builders.</p>

                    <section className='price'>
                    <h2 className='colorPurpl'>$29</h2> <p>per month</p>
                    </section>
                    <p className="note colorPurpl"><span className="shade ">Up to </span> 3 active pages</p>
                    <ul>
                        <li> <i className="fa-solid fa-check colorPurpl"></i>Up to 3 published websites simultaneously</li>
                        <li> <i className="fa-solid fa-check colorPurpl"></i>Access to exclusive Premium templates</li>
                        <li><i className="fa-solid fa-check colorPurpl"></i>Priority 24/7 support</li>
                        <li><i className="fa-solid fa-check colorPurpl"></i>Early access to new widgets and builder features</li>
                        <li><i className="fa-solid fa-check colorPurpl"></i>No "Made with PageCraft" watermark</li>
                        <li><i className="fa-solid fa-check colorPurpl"></i>Fast and secure hosting included</li>
                        <li><i className="fa-solid fa-check colorPurpl"></i>Your own unique URL (e.g. pagecraft.pl/your-name)</li>
                    </ul>
                    <button className="grandientBtn">Start Pro</button></div>
            </div>
            <p className="adnotation">All plans include SSL, CDN delivery, and 99.9% uptime. No credit card required for Free plan.</p>
        </div>
        </div>
    );
}
