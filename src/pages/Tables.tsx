import Breadcrumb from '../components/Breadcrumb';
import TableOne from '../components/TableOne';
import TableThree from '../components/TableThree';
import TableTwo from '../components/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Inventory" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableThree />
      </div>
    </>
  );
};

export default Tables;
