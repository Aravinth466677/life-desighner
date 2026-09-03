import { Helmet } from 'react-helmet-async'

function Noindex(){
    return(
        <Helmet>
            <meta name='robots' content='noindex,follow'/>
        </Helmet>
    )
}

export default Noindex;