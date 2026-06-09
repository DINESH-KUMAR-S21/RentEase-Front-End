import { useEffect } from 'react';

const MetaData = ({ title }) => {
    useEffect(() => {
        document.title = `${title} | Rentyfy`;
    }, [title]);

    return null;
};

export default MetaData;