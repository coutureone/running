import { useMemo } from 'react';
import YearStat from '@/components/YearStat';
import useActivities from '@/hooks/useActivities';
import { INFO_MESSAGE } from '@/utils/const';

const YearsStat = ({
  year,
  onClick,
  onYearSummaryClick,
}: {
  year: string;
  onClick: (_year: string) => void;
  onYearSummaryClick?: (_year: string) => void;
}) => {
  const { years } = useActivities();

  // Memoize the years array calculation
  const yearsArrayUpdate = useMemo(() => {
    // make sure the year click on front
    let updatedYears = years.slice();
    updatedYears.push('Total');
    updatedYears = updatedYears.filter((x) => x !== year);
    updatedYears.unshift(year);
    return updatedYears;
  }, [years, year]);

  const infoMessage = useMemo(() => {
    return INFO_MESSAGE(years.length, year);
  }, [years.length, year]);

  // for short solution need to refactor
  return (
    <div className="w-full pb-16 pr-16 lg:w-full lg:pr-16">
      <section className="pb-0">
        <p className="leading-relaxed">
          {infoMessage}
          <br />
          <br />
          何为强大？何为奔跑？何为生存？一切都在风之彼方。希望就在我们各自心中。看啊，道路就在我们脚下。所以我们要奔跑于今天。一直奔跑，直到永恒。
        </p>
        <p className="text-right" style={{ fontFamily: 'serif' }}>——《强风吹拂》</p>
      </section>
      <hr />
      {yearsArrayUpdate.map((yearItem) => (
        <YearStat
          key={yearItem}
          year={yearItem}
          onClick={onClick}
          onYearSummaryClick={onYearSummaryClick}
        />
      ))}
    </div>
  );
};

export default YearsStat;
