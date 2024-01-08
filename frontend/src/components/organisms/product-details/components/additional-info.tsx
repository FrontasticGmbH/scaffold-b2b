import { AdditionalInfoProps } from '../types';
import AdditionalInfoItem from './additional-info-item';

const AdditionalInfo = ({ className, additionalInfo }: AdditionalInfoProps) => {
  return (
    <div className={className}>
      {additionalInfo?.map((info, index) => (
        <AdditionalInfoItem className={index == 0 ? 'border-b-0' : ''} key={info.title} {...info} />
      ))}
    </div>
  );
};

export default AdditionalInfo;
