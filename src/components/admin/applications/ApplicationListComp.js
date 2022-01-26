import { useState } from 'react/cjs/react.development';
import styles from './ApplicationListComp.module.css';
import ApplicationCard from '../../applications/ApplicationCard';
import Button from '../../button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logoutInitiate } from '../../../redux/actions/logoutActions';
import Dropdown from '../../dropdown/Dropdown';
import { options, statusEnum } from '../../../constants/enum';

const ApplicationListComp = () => {
  const [values, setValues] = useState({
    queryCode: '',
    filterVal: '',
  });
  const { user, data } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleLogout = () => {
    user.currUser && dispatch(logoutInitiate());
  };

  const applicationList = data?.applications
    ?.filter((item) => {
      if (values.filterVal !== '' && item.status !== values.filterVal)
        return false;
      if (!item.id.toLowerCase().includes(values.queryCode.toLowerCase()))
        return false;
      return true;
    })
    .filter(
      (item) => values.filterVal == statusEnum.ANSWERED.name || item.status == statusEnum.EVALUATING.name
    )
    .map((app) => <ApplicationCard app={app} key={app.id} to={`${app.id}`} />);

  return (
    <div className={styles['main-container']}>
      <div className={styles['header-container']}>
        <div className={styles['title-admin']}>
          <h2>Cevap bekleyen başvurular</h2>
          <Button onClick={handleLogout} type="reset" content={'çıkış'} />
        </div>
        <div className={styles['filter-container']}>
          <div>
            <input
              type={'text'}
              placeholder="Başvuru kodu ile filtreleyiniz."
              name="queryCode"
              value={values.queryCode}
              onChange={handleChange}
              className={styles['filter-input--admin']}
            />
          </div>
          <Dropdown
            label="Başvuru durumuna göre filtereleyiniz"
            name="filterVal"
            data={options}
            onChange={handleChange}
            value={values.filterVal}
            customClass={styles['custom-dropdown']}
          />
        </div>
      </div>
      <div className={styles['card-container']}>{applicationList}</div>
    </div>
  );
};

export default ApplicationListComp;
