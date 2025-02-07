import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm2 from './CustomerForm2';

const CustomerFormWrapper2 = (props) => {
    const params = useParams();
    const navigate = useNavigate();

    return <CustomerForm2 {...props} params={params} navigate={navigate} />;
};

export default CustomerFormWrapper2;
