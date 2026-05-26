import { useEffect } from 'react';

const MetaData = ({ title }) => {
    useEffect(() => {
        document.title = `${title} | RentEase`;
    }, [title]);

    return null;
};

export default MetaData;