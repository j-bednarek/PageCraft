import logo from '/logo-svg.svg';
import './footer.css';
export default function Footer(){
    return(
        <>
    <div className='footer'>
        <div className='left'>
            <div className='inline gap5rem'>
                <img src={logo} alt="" /><h3>PageCraft</h3>
            </div>
            <p>The fastest way to build and publish beautiful one-page websites.</p>
        </div>
        <div className='right inline'>
            <div>
                <p>Features</p>
                <p>Templates</p>
                <p>Pricing</p>
            </div>
            <div>
                <p>Blog</p>
                <p>Changelog</p>
                <p>Status</p>
            </div>
            <div>
                <p>Privacy</p>
                <p>Terms</p>
                <p>Contact</p>
            </div>
        </div>

    </div>
     <div className='bottom'>
            <p>© 2026 PageCraft, Inc.</p>
            <p>Made with care in Łodź</p>
        </div>
        </>
    )
}
